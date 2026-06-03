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

  const filteredTasks = category === "all" 
    ? tasks 
    : tasks.filter(t => t.category.toLowerCase() === category.toLowerCase());

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Manage <span className="text-[var(--accent-neon)]">Tasks</span></h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="brutal-btn brutal-btn-primary">Filter: {category}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black border-2 border-white rounded-none p-2 z-[100]">
            <DropdownMenuLabel className="text-white font-black uppercase text-xs">Category</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white" />
            <DropdownMenuRadioGroup
              value={category}
              onValueChange={setCategory}
              className="text-white"
            >
              <DropdownMenuRadioItem value="all" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="work" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">Work</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="personal" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">Personal</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="hobby" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">Hobby</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <p className="text-xl font-black uppercase italic animate-pulse">Loading Tasks...</p>
      ) : (
        <div className="grid gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((t) => (
              <div key={t.id} className="brutal-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <span className="text-[10px] font-black bg-white text-black px-2 py-0.5 mb-2 inline-block uppercase">{t.category}</span>
                  <h3 className={`text-2xl font-black uppercase italic ${t.is_done ? 'line-through opacity-50' : ''}`}>{t.title}</h3>
                  <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">DL: {t.deadline || "NO DEADLINE"}</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => deleteTask(t.id)}
                    className="brutal-btn bg-white text-black hover:bg-red-500 flex-1 sm:flex-none"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 font-bold uppercase tracking-widest italic">No tasks found in this category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
