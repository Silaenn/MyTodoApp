"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Trash2, Search, ArrowUpDown, CheckCircle2, Circle } from "lucide-react";
import { DialogDemo } from "@/components/Dialog";

interface Task {
  id: string;
  title: string;
  category: string;
  deadline: string;
  is_done: boolean;
}

const categoryOptions = ["all", "work", "personal", "hobby", "urgent", "study"];

const categoryColors: Record<string, string> = {
  work:     "brutal-badge-primary",
  personal: "bg-[#8B4A2B] text-[#F5F8F4]",
  hobby:    "brutal-badge-secondary",
  urgent:   "bg-[#FF0000] text-[#F5F8F4]",
  study:    "bg-[#3B6B4A] text-[#F5F8F4]",
  all:      "brutal-badge-muted",
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const toggleDone = async (task: Task) => {
    const newStatus = !task.is_done;
    try {
      // Optimistic update
      setTasks(tasks.map(t => t.id === task.id ? { ...t, is_done: newStatus } : t));

      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_done: newStatus }),
      });
    } catch (error) {
      console.error("Failed to toggle task status:", error);
      // Revert on error
      setTasks(tasks.map(t => t.id === task.id ? { ...t, is_done: !newStatus } : t));
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Category Filter
    if (category !== "all") {
      result = result.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    // Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(query));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") return -1; // Default is newest from API
      if (sortBy === "oldest") return 1;
      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [tasks, category, searchQuery, sortBy]);

  return (
    <div className="w-full h-[calc(100vh-60px)] flex flex-col overflow-hidden">

      {/* Header & Controls - Fixed Height */}
      <div className="mb-6 flex flex-col gap-6 rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] p-6 shadow-[4px_4px_0px_#0F1A0F] shrink-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#5A6E5A]">
              Task board
            </p>
            <h1 className="mt-2 text-5xl font-black tracking-tight text-[#0F1A0F]">
              Manage <span className="text-[#3B6B4A]">tasks</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-[#5A6E5A]">
              {tasks.length} total · {tasks.filter(t => !t.is_done).length} remaining
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DialogDemo />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6E5A]" size={18} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="brutal-input pl-10 h-11"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="brutal-btn brutal-btn-outline h-11 capitalize min-w-[140px]">
                  Filter: {category}
                  <ChevronDown size={15} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[180px] border-2 border-[#0F1A0F] bg-[#F5F8F4] shadow-[4px_4px_0px_#0F1A0F]">
                <DropdownMenuLabel className="font-bold">Category</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#0F1A0F]/20" />
                <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                  {categoryOptions.map((cat) => (
                    <DropdownMenuRadioItem
                      key={cat}
                      value={cat}
                      className="cursor-pointer capitalize font-bold hover:bg-[#3B6B4A] hover:text-[#F5F8F4] focus:bg-[#3B6B4A] focus:text-[#F5F8F4]"
                    >
                      {cat}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="brutal-btn brutal-btn-outline h-11 min-w-[140px]">
                  <ArrowUpDown size={15} />
                  Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[180px] border-2 border-[#0F1A0F] bg-[#F5F8F4] shadow-[4px_4px_0px_#0F1A0F]">
                <DropdownMenuLabel className="font-bold">Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#0F1A0F]/20" />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                  <DropdownMenuRadioItem value="newest" className="cursor-pointer font-bold focus:bg-[#3B6B4A] focus:text-[#F5F8F4]">Newest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest" className="cursor-pointer font-bold focus:bg-[#3B6B4A] focus:text-[#F5F8F4]">Oldest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="deadline" className="cursor-pointer font-bold focus:bg-[#3B6B4A] focus:text-[#F5F8F4]">Deadline</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="title" className="cursor-pointer font-bold focus:bg-[#3B6B4A] focus:text-[#F5F8F4]">Title</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content Area - Only this scrolls */}
      <div className="flex-1 min-h-0 relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#E8EDE6]">
            <p className="text-4xl font-black tracking-tight text-[#3B6B4A]">
              Loading tasks...
            </p>
            <div className="h-3 w-56 overflow-hidden rounded-sm border-2 border-[#0F1A0F] bg-[#F5F8F4] shadow-[3px_3px_0px_#0F1A0F]">
              <div className="h-full w-1/3 animate-pulse bg-[#3B6B4A]" />
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-4 custom-scrollbar overflow-x-hidden pb-32">
            <div className="grid gap-4 h-full flex-col py-1">
              {filteredAndSortedTasks.length > 0 ? (
                filteredAndSortedTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`brutal-card flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between transition-all ${
                      task.is_done ? "opacity-60 grayscale-[0.5]" : ""
                    }`}
                  >
                    <div className="flex flex-1 items-start gap-4">
                      <button 
                        onClick={() => toggleDone(task)}
                        className={`mt-1.5 transition-colors ${task.is_done ? "text-[#3B6B4A]" : "text-[#5A6E5A] hover:text-[#3B6B4A]"}`}
                      >
                        {task.is_done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>

                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2 flex-wrap">
                          <span
                            className={`brutal-badge ${
                              categoryColors[task.category.toLowerCase()] ?? categoryColors.all
                            }`}
                          >
                            {task.category.toUpperCase()}
                          </span>
                        </div>
                        <h3 className={`text-2xl font-black tracking-tight text-[#0F1A0F] ${task.is_done ? "line-through opacity-50" : ""}`}>
                          {task.title}
                        </h3>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5A6E5A]">
                            Deadline:
                          </span>
                          <span className={`rounded-sm border border-[#0F1A0F]/20 px-2 py-0.5 text-xs font-bold ${
                            task.deadline && new Date(task.deadline) < new Date() && !task.is_done
                              ? "bg-red-100 text-red-600 border-red-200"
                              : "bg-[#E8EDE6] text-[#3B6B4A]"
                          }`}>
                            {task.deadline || "None"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:self-center">
                      <DialogDemo task={task} />
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="brutal-btn brutal-btn-accent"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-[#0F1A0F]/30 bg-[#F5F8F4] p-10 text-center min-h-[400px] lg:min-h-[650px]">
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#5A6E5A]">
                    {searchQuery ? "No matching tasks." : "No tasks found."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;