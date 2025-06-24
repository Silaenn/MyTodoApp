"use client";
import React from "react";

const tasks = [
  { title: "Finish Report", category: "Work", isDone: false },
  { title: "Read Book", category: "Personal", isDone: false },
];

const Home = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {tasks.map((task, idx) => (
        <div
          key={idx}
          className="bg-form rounded-xl p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-500 rounded border-gray-600"
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Category: {task.category}
          </p>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors w-full font-mono">
            ▶ Play Song
          </button>
        </div>
      ))}
    </section>
  );
};

export default Home;
