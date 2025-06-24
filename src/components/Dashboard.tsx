"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tasks", href: "/tasks" },
  { label: "Music", href: "/musics" },
  { label: "Profile", href: "/profile" },
];

const Dashboard = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden md:flex flex-col justify-between w-64 h-screen bg-[#1F2937] p-6 text-white shadow-xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">📚 TaskTune</h2>
        <nav className="space-y-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md transition-colors font-medium ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Button className="mt-6 justify-start text-red-400 hover:text-red-300">
        <LogOut /> Logout
      </Button>
    </aside>
  );
};

export default Dashboard;
