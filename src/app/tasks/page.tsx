"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  category: string;
  deadline: string;
  is_done: boolean;
}

const categoryOptions = ["all", "work", "personal", "hobby", "urgent"];

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
    if (!confirm("Are you sure?")) return;

    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const filteredTasks =
    category === "all" ? tasks : tasks.filter((t) => t.category.toLowerCase() === category.toLowerCase());

  return (
    <div className="w-full pb-28">
      <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-brutal backdrop-blur-xl md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Task board</p>
          <h1 className="mt-2 text-5xl font-black tracking-tight text-slate-50">
            Manage <span className="text-brutal-neon">tasks</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Filter work, personal, hobby, and urgent items from one clean view.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg">
              Filter: {category}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[220px]">
            <DropdownMenuLabel>Select category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
              {categoryOptions.map((cat) => (
                <DropdownMenuRadioItem
                  key={cat}
                  value={cat}
                  className="cursor-pointer px-3 py-2 font-medium capitalize"
                >
                  {cat}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <div className="flex h-[calc(100vh-440px)] flex-col items-center justify-center">
          <p className="text-4xl font-black tracking-tight text-brutal-neon">Loading tasks...</p>
          <div className="mt-6 h-3 w-56 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <div className="h-full w-1/3 animate-pulse bg-brutal-neon" />
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`brutal-card flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between ${
                  task.is_done ? "opacity-60" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-brutal-neon" />
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {task.category}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-semibold tracking-tight text-slate-50 ${task.is_done ? "line-through opacity-60" : ""}`}>
                    {task.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-300">
                      Deadline
                    </span>
                    <span className="text-brutal-pink">{task.deadline || "None"}</span>
                  </div>
                </div>

                <Button variant="destructive" onClick={() => deleteTask(task.id)} className="self-start md:self-center">
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">No tasks found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
