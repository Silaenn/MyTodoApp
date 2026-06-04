"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Trash2 } from "lucide-react";
import { DialogDemo } from "@/components/Dialog";

interface Task {
  id: string;
  title: string;
  category: string;
  deadline: string;
  is_done: boolean;
}

const categoryOptions = ["all", "work", "personal", "hobby", "urgent"];

const categoryColors: Record<string, string> = {
  work:     "brutal-badge-primary",
  personal: "bg-[#8B4A2B] text-[#F5F8F4]",
  hobby:    "brutal-badge-secondary",
  urgent:   "bg-[#0F1A0F] text-[#F5F8F4]",
  all:      "brutal-badge-muted",
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
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

  const filteredTasks =
    category === "all"
      ? tasks
      : tasks.filter((t) => t.category.toLowerCase() === category.toLowerCase());

  return (
    <div className="w-full pb-28">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] p-6 shadow-[4px_4px_0px_#0F1A0F]">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="brutal-btn brutal-btn-outline capitalize">
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

            <DialogDemo />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex h-[calc(100vh-440px)] flex-col items-center justify-center gap-6">
          <p className="text-4xl font-black tracking-tight text-[#3B6B4A]">
            Loading tasks...
          </p>
          <div className="h-3 w-56 overflow-hidden rounded-sm border-2 border-[#0F1A0F] bg-[#F5F8F4] shadow-[3px_3px_0px_#0F1A0F]">
            <div className="h-full w-1/3 animate-pulse bg-[#3B6B4A]" />
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`brutal-card flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between ${
                  task.is_done ? "opacity-60 grayscale-[0.5]" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`brutal-badge ${
                        categoryColors[task.category.toLowerCase()] ?? categoryColors.all
                      }`}
                    >
                      {task.category}
                    </span>
                    {task.is_done && (
                      <span className="brutal-badge brutal-badge-primary">
                        Done
                      </span>
                    )}
                  </div>
                  <h3 className={`text-2xl font-black tracking-tight text-[#0F1A0F] ${task.is_done ? "line-through opacity-50" : ""}`}>
                    {task.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5A6E5A]">
                      Deadline:
                    </span>
                    <span className="rounded-sm border border-[#0F1A0F]/20 bg-[#E8EDE6] px-2 py-0.5 text-xs font-bold text-[#3B6B4A]">
                      {task.deadline || "None"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="brutal-btn brutal-btn-accent md:self-center"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center rounded-md border-2 border-dashed border-[#0F1A0F]/30 bg-[#F5F8F4] p-10 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#5A6E5A]">
                No tasks found.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;