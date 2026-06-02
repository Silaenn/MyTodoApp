"use client";
import React from "react";

const tasks = [
  { title: "Finish Report", category: "Work", isDone: false },
  { title: "Read Book", category: "Personal", isDone: false },
];

const Home = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tasks.map((task, idx) => (
        <div
          key={idx}
          className="brutal-card p-6 flex flex-col justify-between min-h-[180px]"
        >
          <div>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-black uppercase leading-tight">{task.title}</h3>
              <input
                type="checkbox"
                className="w-6 h-6 border-2 border-white bg-black checked:bg-[var(--accent-neon)] appearance-none cursor-pointer transition-all"
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              CAT: <span className="text-white">{task.category}</span>
            </p>
          </div>
          
          <button className="brutal-btn brutal-btn-pink mt-6 w-full text-sm font-black italic">
            ▶ PLAY VIBE
          </button>
        </div>
      ))}
      
      {/* Add Task Placeholder */}
      <div className="brutal-card p-6 flex items-center justify-center border-dashed border-gray-500 opacity-60 hover:opacity-100 cursor-pointer">
        <span className="text-4xl font-black">+</span>
      </div>
    </section>
  );
};

export default Home;
