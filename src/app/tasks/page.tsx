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
    <div className="w-full pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b-8 border-white pb-8">
        <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter italic text-stroke">
          MANAGE <span className="text-brutal-neon !text-white !italic">TASKS</span>
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="lg" className="shadow-brutal-neon">
              FILTER: {category}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black border-4 border-white rounded-none p-4 z-[100] min-w-[200px] shadow-brutal">
            <DropdownMenuLabel className="text-white font-black uppercase tracking-[0.2em] mb-2 text-sm border-b-2 border-white pb-2">Select Category</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={category}
              onValueChange={setCategory}
              className="text-white flex flex-col gap-1"
            >
              {["all", "work", "personal", "hobby", "urgent"].map((cat) => (
                <DropdownMenuRadioItem 
                  key={cat} 
                  value={cat} 
                  className="hover:bg-brutal-neon hover:text-black font-black uppercase tracking-widest cursor-pointer px-4 py-3 transition-all outline-none focus:bg-white focus:text-black"
                >
                  {cat}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-450px)] sm:h-[calc(100vh-480px)] md:h-[calc(100vh-520px)]">
          <p className="text-4xl md:text-5xl font-black uppercase italic animate-[vibrate_0.2s_linear_infinite] text-brutal-pink text-stroke-sm">
            Decrypting Tasks...
          </p>
          <div className="w-48 h-2 bg-white/10 mt-6 overflow-hidden border-2 border-white">
            <div className="h-full bg-brutal-pink animate-[vibrate_0.1s_linear_infinite] w-1/3"></div>
          </div>
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((t) => (
              <div 
                key={t.id} 
                className={`brutal-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:border-brutal-pink transition-all ${t.is_done ? 'opacity-40 grayscale' : ''}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 bg-brutal-neon border-2 border-white"></span>
                    <span className="text-[10px] font-black bg-white text-black px-3 py-1 uppercase tracking-[0.2em]">{t.category}</span>
                  </div>
                  <h3 className={`text-3xl font-black uppercase italic leading-none group-hover:text-brutal-neon transition-colors ${t.is_done ? 'line-through' : ''}`}>
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-4 text-gray-500 font-black uppercase tracking-[0.1em] text-xs">
                    <span className="text-white bg-brutal-gray border-2 border-white px-2 italic">DEADLINE:</span>
                    <span className="text-brutal-pink">{t.deadline || "NONE"}</span>
                  </div>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => deleteTask(t.id)}
                    className="brutal-btn bg-brutal-pink text-white hover:bg-white hover:text-black border-4 border-white px-8"
                  >
                    KILL
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-450px)] sm:h-[calc(100vh-480px)] md:h-[calc(100vh-520px)] border-4 border-dashed border-white/20 text-center bg-brutal-gray/5 group hover:border-white/40 transition-colors">
              <div className="relative">
                <div className="absolute inset-0 bg-brutal-neon blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <p className="relative text-3xl md:text-4xl font-black text-white uppercase italic tracking-widest text-stroke-sm">
                  System Clear.
                </p>
                <p className="text-sm font-black text-gray-500 uppercase tracking-[0.4em] mt-4">
                  No tasks detected in archives.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
