"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LayoutClient({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
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
          user={session?.user}
        />
      )}
      
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isLoginOrRegister ? "md:ml-64 p-4 sm:p-6 md:p-8" : ""
        } mb-24`} 
      >
        {!isLoginOrRegister && (
          <div className="flex items-center gap-4 mb-4 md:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="brutal-btn p-2 bg-brutal-neon text-black border-white shadow-brutal-sm"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black italic tracking-tighter">TASKTUNE</h1>
          </div>
        )}
        
        {!isLoginOrRegister && <Header user={session?.user} />}
        <div className="flex-1">
          {children}
        </div>
        {!isLoginOrRegister && pathname !== "/profile" && <Footer />}
      </main>
    </>
  );
}
