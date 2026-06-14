"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import { motion, Variants } from "framer-motion";

type SessionUser = {
  id?: string | null;
  image?: string | null;
  name?: string | null;
};

type SessionLike = {
  user?: SessionUser | null;
} | null;

const contentVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15,
      delay: 0.3, // Slight delay to let dashboard start first
    },
  },
};

export default function LayoutClient({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionLike;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginOrRegister = pathname === "/login" || pathname === "/register";

  // Auto-refresh session when active
  useEffect(() => {
    if (!session) return;

    const refreshSession = async () => {
      // Fetch session endpoint to trigger updateAge: 0
      await fetch("/api/auth/session");
    };

    let timeout: NodeJS.Timeout;
    const handleActivity = () => {
      clearTimeout(timeout);
      // Debounce refresh call (misal: panggil refresh hanya sekali setiap 5 menit jika aktif)
      timeout = setTimeout(refreshSession, 5 * 60 * 1000); 
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearTimeout(timeout);
    };
  }, [session]);

  return (
    <>
      {!isLoginOrRegister && (
        <Dashboard
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          user={session?.user ?? undefined}
        />
      )}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isLoginOrRegister
            ? "md:ml-20 lg:ml-64 xl:ml-72 px-4 sm:px-6 md:px-8 py-4 sm:py-6"
            : ""
        }`}
      >
        {!isLoginOrRegister && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 mb-6 md:hidden"
          >
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="brutal-btn brutal-btn-primary h-11 w-11 p-0"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-black tracking-tight text-brutal-ink">
              TASKTUNE
            </h1>
          </motion.div>
        )}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          className="flex-1 flex flex-col w-full"
        >
          {children}
        </motion.div>
        {!isLoginOrRegister && pathname !== "/profile" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Footer />
          </motion.div>
        )}
      </main>
    </>
  );
} 
