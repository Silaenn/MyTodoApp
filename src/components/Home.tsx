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

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      work: "bg-brutal-blue",
      personal: "bg-brutal-pink",
      music: "bg-brutal-neon",
      urgent: "bg-brutal-yellow text-black",
    };
    return colors[cat.toLowerCase()] || "bg-white/20";
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-320px)] sm:h-[calc(100vh-350px)] md:h-[calc(100vh-380px)] overflow-hidden">
        <p className="text-4xl md:text-6xl font-black uppercase italic animate-bounce text-brutal-neon text-stroke-sm">
          Scanning Systems...
        </p>
        <div className="w-64 md:w-96 h-6 border-4 border-white mt-8 overflow-hidden bg-brutal-gray shadow-brutal">
          <div className="h-full bg-brutal-neon animate-[vibrate_0.1s_linear_infinite] w-1/2 border-r-4 border-white"></div>
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.5em] text-white/30 animate-pulse">
          Accessing encrypted protocols
        </p>
      </div>
    );
  }


  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`brutal-card p-6 flex flex-col justify-between min-h-[220px] transition-all relative overflow-hidden group ${
            task.is_done ? "opacity-50 grayscale" : ""
          }`}
        >
          {/* Background Accent */}
          <div className={`absolute -right-4 -top-4 w-16 h-16 rotate-12 opacity-20 group-hover:opacity-40 transition-all ${getCategoryColor(task.category)}`}></div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col gap-1">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 w-fit shadow-brutal-sm border-2 border-white ${getCategoryColor(task.category)}`}>
                  {task.category}
                </span>
                <h3 className={`text-2xl font-black uppercase leading-tight mt-2 ${task.is_done ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
              </div>
              <button 
                onClick={() => toggleDone(task.id, task.is_done)}
                className={`w-10 h-10 border-4 border-white flex items-center justify-center transition-all ${
                  task.is_done ? "bg-brutal-neon shadow-none translate-x-1 translate-y-1" : "bg-black shadow-brutal-sm hover:bg-white hover:text-black"
                }`}
              >
                {task.is_done ? "✔" : ""}
              </button>
            </div>
          </div>
          
          <button className="brutal-btn brutal-btn-secondary mt-6 w-full text-sm font-black italic group-hover:animate-vibrate">
            ▶ ACTIVATE VIBE
          </button>
        </div>
      ))}
      
      {/* Add Task Card */}
      <div 
        onClick={() => window.location.href = '/tasks'}
        className="brutal-card p-6 flex flex-col items-center justify-center border-dashed border-white/30 bg-transparent shadow-none hover:shadow-brutal hover:border-solid hover:border-brutal-neon cursor-pointer group min-h-[220px]"
      >
        <span className="text-6xl font-black mb-2 group-hover:scale-125 transition-transform">+</span>
        <span className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Add New Protocol</span>
      </div>
    </section>
  );
};

export default Home;
