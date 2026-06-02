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
    <aside className="fixed left-0 top-0 hidden md:flex flex-col justify-between w-64 h-screen bg-black border-r-4 border-white p-6 text-white">
      <div>
        <h2 className="text-3xl font-black italic tracking-tighter mb-10 border-b-2 border-white pb-4">
          TASK<span className="text-[var(--accent-neon)]">TUNE</span>
        </h2>
        <nav className="space-y-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 border-2 transition-all font-bold uppercase tracking-widest shadow-[4px_4px_0px_#ffffff] ${
                  isActive
                    ? "bg-[var(--accent-neon)] text-black border-white"
                    : "bg-black text-white border-white hover:bg-white hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button className="brutal-btn bg-red-600 text-white flex items-center gap-2 justify-center">
        <LogOut size={20} /> LOGOUT
      </button>
    </aside>
  );
};

export default Dashboard;
