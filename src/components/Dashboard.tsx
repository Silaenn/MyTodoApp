"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LogOut, X, User, Home, CheckSquare, Music } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

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

const sidebarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
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
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-[#0F1A0F]/50 z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[70] md:flex flex-col w-72 h-screen border-r-2 border-[#0F1A0F] bg-[#E8EDE6] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
          className="flex h-full flex-col justify-between p-6"
        >
          <div>
            {/* Logo */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-between items-center mb-8 border-b-2 border-[#0F1A0F] pb-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#5A6E5A]">
                  Workspace
                </p>
                <h2 className="text-3xl font-black tracking-tight text-[#0F1A0F]">
                  TASK<span className="text-[#3B6B4A]">TUNE</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="md:hidden inline-flex items-center justify-center rounded-sm border-2 border-[#0F1A0F] bg-[#F5F8F4] p-2 shadow-brutal-sm transition-all hover:shadow-brutal hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
              >
                <X size={20} className="text-[#0F1A0F]" />
              </button>
            </motion.div>

            {/* Nav */}
            <nav className="space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`relative flex items-center gap-3 rounded-md border-2 border-[#0F1A0F] px-4 py-3.5 font-bold tracking-wide transition-all ${
                        isActive
                          ? "bg-[#3B6B4A] text-[#F5F8F4] shadow-brutal"
                          : "bg-[#F5F8F4] text-[#0F1A0F] shadow-brutal-sm hover:shadow-brutal hover:-translate-x-px hover:-translate-y-px"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-sm bg-[#D4A843]" />
                      )}
                      <Icon size={18} className={isActive ? "text-[#F5F8F4]" : "text-[#5A6E5A]"} />
                      <span className={isActive ? "pl-1" : ""}>{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>

          <motion.div variants={itemVariants} className="space-y-3">
            {/* User Card */}
            <div className="flex items-center gap-3 rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] p-4 shadow-brutal-sm">
              <div className="w-11 h-11 overflow-hidden rounded-sm border-2 border-[#0F1A0F] flex-shrink-0 shadow-brutal-sm">
                {user?.image ? (
                  <img
                    src={user.image ?? undefined}
                    alt={user.name ?? "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#D4A843]">
                    <User size={18} className="text-[#0F1A0F]" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black truncate leading-none mb-1 text-[#0F1A0F]">
                  {user?.name || "Guest"}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#3B6B4A] truncate">
                  Online
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center justify-center rounded-sm border-2 border-[#0F1A0F] bg-[#E8EDE6] p-2 shadow-brutal-sm transition-all hover:bg-[#8B4A2B] hover:text-[#F5F8F4] hover:shadow-brutal active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                title="Logout"
              >
                <LogOut size={16} className="text-[#0F1A0F]" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </aside>
    </>
  );
};

export default Dashboard;