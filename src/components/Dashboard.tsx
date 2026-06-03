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
          <div className="flex justify-between items-center mb-10 border-b-2 border-white pb-4">
            <h2 className="text-3xl font-black italic tracking-tighter">
              TASK<span className="text-[var(--accent-neon)]">TUNE</span>
            </h2>
            <button onClick={onClose} className="md:hidden text-white">
              <X size={24} />
            </button>
          </div>
          <nav className="space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
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

        <div className="p-4 border-2 border-white bg-[#121212] font-bold text-[10px] uppercase tracking-widest">
          Personal Music Assistant v1.0
        </div>
      </aside>
    </>
  );
};

export default Dashboard;
