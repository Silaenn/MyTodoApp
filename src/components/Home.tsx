"use client";
import React, { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  category: string;
  is_done: boolean;
}

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data.slice(0, 6)); // Show only first 6 tasks on home
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleDone = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_done: !currentStatus }),
      });
      setTasks(tasks.map(t => t.id === id ? { ...t, is_done: !currentStatus } : t));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {loading ? (
        <p className="text-xl font-black uppercase italic animate-pulse">Scanning Tasks...</p>
      ) : tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className={`brutal-card p-6 flex flex-col justify-between min-h-[180px] transition-all ${
              task.is_done ? "opacity-60 grayscale" : ""
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <h3 className={`text-xl font-black uppercase leading-tight ${task.is_done ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                <input
                  type="checkbox"
                  checked={task.is_done}
                  onChange={() => toggleDone(task.id, task.is_done)}
                  className="w-6 h-6 border-2 border-white bg-black checked:bg-[var(--accent-neon)] appearance-none cursor-pointer transition-all"
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                CAT: <span className="text-white bg-white/10 px-1">{task.category}</span>
              </p>
            </div>
            
            <button className="brutal-btn brutal-btn-pink mt-6 w-full text-sm font-black italic">
              ▶ PLAY VIBE
            </button>
          </div>
        ))
      ) : (
        <div className="brutal-card p-8 col-span-full text-center">
          <p className="text-xl font-black uppercase italic mb-4">You are all clear!</p>
          <p className="text-sm font-bold text-gray-400">ADD SOME TASKS TO START THE VIBE.</p>
        </div>
      )}
      
      {/* Add Task Placeholder */}
      <div 
        onClick={() => window.location.href = '/tasks'}
        className="brutal-card p-6 flex items-center justify-center border-dashed border-gray-500 opacity-60 hover:opacity-100 cursor-pointer"
      >
        <span className="text-4xl font-black">+</span>
      </div>
    </section>
  );
};

export default Home;
