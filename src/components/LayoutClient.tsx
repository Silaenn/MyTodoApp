"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type SessionUser = {
  id?: string | null;
  image?: string | null;
  name?: string | null;
};

type SessionLike = {
  user?: SessionUser | null;
} | null;

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
          !isLoginOrRegister ? "md:ml-72 px-4 sm:px-6 md:px-8 py-4 sm:py-6" : ""
        } mb-28`}
      >
        {!isLoginOrRegister && (
          <div className="flex items-center gap-4 mb-6 md:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="brutal-btn h-11 w-11 rounded-2xl bg-brutal-neon text-slate-950 shadow-brutal-neon"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black tracking-tight">TASKTUNE</h1>
          </div>
        )}
        
        {!isLoginOrRegister && <Header user={session?.user ?? undefined} />}
        <div className="flex-1">
          {children}
        </div>
        {!isLoginOrRegister && pathname !== "/profile" && <Footer />}
      </main>
    </>
  );
}
