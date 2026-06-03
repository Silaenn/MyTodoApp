"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LogOut, X, User, Home, CheckSquare, Music } from "lucide-react";
import { signOut } from "next-auth/react";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Music", href: "/musics", icon: Music },
];

type UserProfile = {
  id?: string | null;
  image?: string | null;
  name?: string | null;
};

const Dashboard = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#1A1208]/50 z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[70] md:flex flex-col w-72 h-screen border-r-2 border-[#1A1208] bg-[#F5ECD7] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col justify-between p-6">
          <div>
            {/* Logo */}
            <div className="flex justify-between items-center mb-8 border-b-2 border-[#1A1208] pb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#6B5744]">
                  Workspace
                </p>
                <h2 className="text-3xl font-black tracking-tight text-[#1A1208]">
                  TASK<span className="text-[#C75B2D]">TUNE</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="md:hidden inline-flex items-center justify-center rounded-sm border-2 border-[#1A1208] bg-[#FDFAF4] p-2 shadow-[2px_2px_0px_#1A1208] transition-all hover:shadow-[3px_3px_0px_#1A1208] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
              >
                <X size={20} className="text-[#1A1208]" />
              </button>
            </div>

            {/* Nav */}
            <nav className="space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`relative flex items-center gap-3 rounded-md border-2 border-[#1A1208] px-4 py-3.5 font-bold tracking-wide transition-all ${
                      isActive
                        ? "bg-[#C75B2D] text-[#FDFAF4] shadow-[4px_4px_0px_#1A1208]"
                        : "bg-[#FDFAF4] text-[#1A1208] shadow-[3px_3px_0px_#1A1208] hover:shadow-[5px_5px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-sm bg-[#E8A838]" />
                    )}
                    <Icon size={18} className={isActive ? "text-[#FDFAF4]" : "text-[#6B5744]"} />
                    <span className={isActive ? "pl-1" : ""}>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3">
            {/* User Card */}
            <div className="flex items-center gap-3 rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] p-4 shadow-[3px_3px_0px_#1A1208]">
              <div className="w-11 h-11 overflow-hidden rounded-sm border-2 border-[#1A1208] flex-shrink-0 shadow-[2px_2px_0px_#1A1208]">
                {user?.image ? (
                  <img
                    src={user.image ?? undefined}
                    alt={user.name ?? "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#E8A838]">
                    <User size={18} className="text-[#1A1208]" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black truncate leading-none mb-1 text-[#1A1208]">
                  {user?.name || "Guest"}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4A7C59] truncate">
                  Online
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center justify-center rounded-sm border-2 border-[#1A1208] bg-[#F5ECD7] p-2 shadow-[2px_2px_0px_#1A1208] transition-all hover:bg-[#C75B2D] hover:text-[#FDFAF4] hover:shadow-[3px_3px_0px_#1A1208] active:shadow-none"
                title="Logout"
              >
                <LogOut size={16} className="text-[#1A1208]" />
              </button>
            </div>

            {/* Status */}
            <div className="rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] p-4 shadow-[2px_2px_0px_#1A1208]">
              <div className="flex items-center gap-2 text-[#1A1208]">
                <span className="w-2 h-2 rounded-full bg-[#4A7C59] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                  System online
                </span>
              </div>
              <span className="mt-1.5 block text-[9px] font-medium text-[#6B5744] tracking-wider">
                ID: {user?.id?.substring(0, 8) || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Dashboard;