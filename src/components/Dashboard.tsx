"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { LogOut, X, User, Home, CheckSquare, Music } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, Variants } from "framer-motion";

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

const sidebarVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
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
          className="fixed inset-0 bg-brutal-ink/50 z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[70] md:flex flex-col w-72 md:w-20 lg:w-64 xl:w-72 h-screen border-r-2 border-brutal-ink bg-brutal-parchment shadow-brutal-sidebar transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
          className="flex h-full flex-col justify-between p-6 md:p-3 lg:p-4 xl:p-6"
        >
          <div>
            {/* Logo */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-between items-center mb-8 border-b-2 border-brutal-ink pb-6"
            >
              <div className="flex items-center gap-3 md:flex-col lg:flex-row md:gap-1 lg:gap-3 w-full">
                <div className="flex-shrink-0">
                  <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="md:w-10 md:h-10 lg:w-12 lg:h-12" />
                </div>
                <div className="md:hidden lg:block">
                  <p className="text-tiny font-bold uppercase tracking-brutal text-brutal-muted leading-none">
                    Workspace
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-brutal-ink">
                    TASK<span className="text-brutal-primary">TUNE</span>
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="md:hidden inline-flex items-center justify-center rounded-sm border-2 border-brutal-ink bg-brutal-paper p-3 shadow-brutal-sm transition-all hover:shadow-brutal hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
              >
                <X size={20} className="text-brutal-ink" />
              </button>
            </motion.div>

            {/* Nav */}
            <nav className="space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`relative flex items-center gap-3 rounded-md border-2 border-brutal-ink px-4 py-3.5 md:px-0 lg:px-4 md:justify-center lg:justify-start font-bold tracking-tight transition-all ${
                        isActive
                          ? "bg-brutal-primary text-brutal-paper shadow-brutal"
                          : "bg-brutal-paper text-brutal-ink shadow-brutal-sm hover:shadow-brutal hover:-translate-x-px hover:-translate-y-px"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-sm bg-brutal-secondary lg:block md:hidden" />
                      )}
                      <Icon size={18} className={isActive ? "text-brutal-paper" : "text-brutal-muted"} />
                      <span className={`lg:block md:hidden ${isActive ? "pl-1" : ""}`}>{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>

          <motion.div variants={itemVariants} className="space-y-3">
            {/* User Card */}
            <div className="flex items-center gap-3 rounded-md border-2 border-brutal-ink bg-brutal-paper p-4 md:p-2 lg:p-4 md:justify-center lg:justify-start shadow-brutal-sm">
              <div className="w-11 h-11 overflow-hidden rounded-sm border-2 border-brutal-ink flex-shrink-0 shadow-brutal-sm">
                {user?.image ? (
                  <Image
                    src={user.image || "/images/no_image.png"}
                    alt={user.name ?? "User"}
                    width={44}
                    height={44}
                    unoptimized={user.image?.startsWith("http")}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brutal-secondary">
                    <User size={18} className="text-brutal-ink" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 lg:block md:hidden">
                <p className="text-sm font-bold truncate leading-tight mb-1 text-brutal-ink">
                  {user?.name || "Guest"}
                </p>
                <p className="text-tiny font-bold uppercase tracking-brutal text-brutal-primary truncate">
                  Online
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="group lg:inline-flex md:hidden inline-flex items-center justify-center rounded-md border-2 border-brutal-ink bg-brutal-parchment p-2 shadow-brutal-sm transition-all hover:bg-brutal-accent hover:text-brutal-paper hover:shadow-brutal active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                title="Logout"
              >
                <LogOut size={16} className="text-brutal-ink group-hover:text-brutal-paper" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </aside>
    </>
  );
};

export default Dashboard;