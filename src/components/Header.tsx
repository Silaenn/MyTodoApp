"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { useState } from "react";

export function Header() {
  const { tasks } = useTasks();
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-lg mb-6"
    >
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] font-poppins">
        🎧Todo Music
      </h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-300 font-roboto-mono">
          {completedTasks}/${tasks.length} Done
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-300 hover:text-white"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </Button>
      </div>
    </motion.header>
  );
}
