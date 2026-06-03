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
          !isLoginOrRegister
            ? "md:ml-72 px-4 sm:px-6 md:px-8 py-4 sm:py-6"
            : ""
        } mb-28`}
      >
        {!isLoginOrRegister && (
          <div className="flex items-center gap-4 mb-6 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border-2 border-[#1A1208] bg-[#C75B2D] text-[#FDFAF4] shadow-[3px_3px_0px_#1A1208] transition-all hover:shadow-[5px_5px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px active:shadow-[1px_1px_0px_#1A1208] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-black tracking-tight text-[#1A1208]">
              TASKTUNE
            </h1>
          </div>
        )}
        {!isLoginOrRegister && <Header user={session?.user ?? undefined} />}
        <div className="flex-1">{children}</div>
        {!isLoginOrRegister && pathname !== "/profile" && <Footer />}
      </main>
    </>
  );
}