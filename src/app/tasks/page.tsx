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
  work:     "bg-[#C75B2D] text-[#FDFAF4]",
  personal: "bg-[#4A7C59] text-[#FDFAF4]",
  hobby:    "bg-[#E8A838] text-[#1A1208]",
  urgent:   "bg-[#1A1208] text-[#FDFAF4]",
  all:      "bg-[#FDFAF4] text-[#1A1208]",
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
      <div className="mb-8 flex flex-col gap-6 rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] p-6 shadow-[4px_4px_0px_#1A1208]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#6B5744]">
              Task board
            </p>
            <h1 className="mt-2 text-5xl font-black tracking-tight text-[#1A1208]">
              Manage <span className="text-[#C75B2D]">tasks</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-[#6B5744]">
              {tasks.length} total · {tasks.filter(t => !t.is_done).length} remaining
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] px-4 py-2.5 text-sm font-bold text-[#1A1208] shadow-[3px_3px_0px_#1A1208] transition-all hover:shadow-[5px_5px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px active:shadow-[1px_1px_0px_#1A1208] active:translate-x-0.5 active:translate-y-0.5 capitalize">
                  Filter: {category}
                  <ChevronDown size={15} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[180px]">
                <DropdownMenuLabel>Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                  {categoryOptions.map((cat) => (
                    <DropdownMenuRadioItem
                      key={cat}
                      value={cat}
                      className="cursor-pointer capitalize font-medium"
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
          <p className="text-4xl font-black tracking-tight text-[#C75B2D]">
            Loading tasks...
          </p>
          <div className="h-3 w-56 overflow-hidden rounded-sm border-2 border-[#1A1208] bg-[#FDFAF4] shadow-[3px_3px_0px_#1A1208]">
            <div className="h-full w-1/3 animate-pulse bg-[#C75B2D]" />
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`flex flex-col gap-5 rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] p-5 shadow-[4px_4px_0px_#1A1208] transition-all hover:shadow-[6px_6px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px md:flex-row md:items-center md:justify-between ${
                  task.is_done ? "opacity-60" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`rounded-sm border-2 border-[#1A1208] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.3em] ${
                        categoryColors[task.category.toLowerCase()] ?? categoryColors.all
                      }`}
                    >
                      {task.category}
                    </span>
                    {task.is_done && (
                      <span className="rounded-sm border-2 border-[#4A7C59] bg-[#4A7C59] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.3em] text-[#FDFAF4]">
                        Done
                      </span>
                    )}
                  </div>
                  <h3 className={`text-2xl font-black tracking-tight text-[#1A1208] ${task.is_done ? "line-through opacity-50" : ""}`}>
                    {task.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B5744]">
                      Deadline:
                    </span>
                    <span className="rounded-sm border border-[#1A1208]/20 bg-[#F5ECD7] px-2 py-0.5 text-xs font-bold text-[#C75B2D]">
                      {task.deadline || "None"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="inline-flex items-center gap-2 self-start rounded-md border-2 border-[#1A1208] bg-[#1A1208] px-4 py-2.5 text-sm font-bold text-[#FDFAF4] shadow-[3px_3px_0px_#C75B2D] transition-all hover:shadow-[5px_5px_0px_#C75B2D] hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-0.5 active:translate-y-0.5 md:self-center"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center rounded-md border-2 border-dashed border-[#1A1208]/30 bg-[#FDFAF4] p-10 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6B5744]">
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