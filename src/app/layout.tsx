"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginOrRegister = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white min-h-screen flex overflow-x-hidden`}
        suppressHydrationWarning
      >
        {!isLoginOrRegister && (
          <Dashboard isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
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
                className="brutal-btn p-2 bg-[var(--accent-neon)] text-black border-white"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-black italic tracking-tighter">TASKTUNE</h1>
            </div>
          )}
          
          {!isLoginOrRegister && <Header />}
          <div className="flex-1">
            {children}
          </div>
          {!isLoginOrRegister && pathname !== "/profile" && <Footer />}
        </main>
      </body>
    </html>
  );
}
