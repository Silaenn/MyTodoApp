"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LogOut, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tasks", href: "/tasks" },
  { label: "Music", href: "/musics" },
];

const Dashboard = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 z-[70] md:flex flex-col justify-between w-64 h-screen bg-black border-r-4 border-white p-6 text-white transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div>
          <div className="flex justify-between items-center mb-10 border-b-4 border-white pb-6">
            <h2 className="text-4xl font-black italic tracking-tighter text-stroke">
              TASK<span className="text-brutal-neon !text-white !italic">TUNE</span>
            </h2>
            <button onClick={onClose} className="md:hidden text-white border-2 border-white p-1">
              <X size={24} />
            </button>
          </div>
          <nav className="space-y-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`relative block px-4 py-4 border-4 transition-all font-black uppercase tracking-[0.2em] shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1 ${
                    isActive
                      ? "bg-brutal-neon text-black border-white shadow-brutal-white"
                      : "bg-black text-white border-white hover:bg-white hover:text-black"
                  }`}
                >
                  {isActive && (
                    <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-white border-2 border-black"></span>
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-4 border-white bg-brutal-gray font-black text-[10px] uppercase tracking-[0.3em] flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-brutal-neon animate-pulse"></span>
            SYSTEM ONLINE
          </div>
          <span className="opacity-50 text-[8px]">BUILD VERSION: 1.0.42-STABLE</span>
        </div>
      </aside>
    </>
  );
};

export default Dashboard;
