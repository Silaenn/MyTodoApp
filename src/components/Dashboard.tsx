"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LogOut, X, User } from "lucide-react";
import { signOut } from "next-auth/react";

const navLinks = [
  { label: "Home", href: "/tasks" },
  { label: "Tasks", href: "/tasks" },
  { label: "Music", href: "/musics" },
];

type UserProfile = {
  id?: string | null;
  image?: string | null;
  name?: string | null;
};

const Dashboard = ({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user?: UserProfile }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 z-[70] md:flex flex-col justify-between w-72 h-screen border-r border-white/10 bg-slate-950/90 text-white transition-transform duration-300 backdrop-blur-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="flex h-full flex-col justify-between p-6">
          <div>
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Workspace</p>
                <h2 className="text-3xl font-black tracking-tight text-slate-50">
                  TASK<span className="text-brutal-neon">TUNE</span>
                </h2>
              </div>
              <button onClick={onClose} className="md:hidden rounded-full border border-white/10 bg-white/5 p-2 text-white">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`relative block rounded-2xl border px-4 py-4 transition-all font-semibold tracking-wide shadow-brutal active:translate-y-0.5 ${
                    isActive
                      ? "border-teal-300/40 bg-teal-400/15 text-teal-100 shadow-brutal-neon"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-3 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-brutal-neon"></span>
                  )}
                  <span className="pl-3">{link.label}</span>
                </Link>
              );
            })}
            </nav>
          </div>

        <div className="space-y-4">
          {/* User Profile Info */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-brutal-sm">
            <div className="w-11 h-11 overflow-hidden rounded-xl border border-white/10 bg-slate-900 flex-shrink-0">
              {user?.image ? (
                <img src={user.image ?? undefined} alt={user.name ?? "User"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brutal-neon text-slate-950">
                  <User size={20} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate leading-none mb-1">{user?.name || "Guest"}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-teal-300 truncate">Online</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="rounded-full border border-white/10 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-rose-300"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-300 shadow-brutal-sm">
            <div className="flex items-center gap-2 text-slate-100">
              <span className="w-2 h-2 rounded-full bg-brutal-neon animate-pulse"></span>
              System online
            </div>
            <span className="mt-2 block opacity-60 text-[9px]">User ID: {user?.id?.substring(0, 8) || "N/A"}</span>
          </div>
       </div>
      </div>
      </aside>
    </>
  );
};

export default Dashboard;
