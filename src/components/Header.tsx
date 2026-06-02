import React from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { DialogDemo } from "./Dialog";

const Header = () => {
  const pathname = usePathname();
  const isName =
    pathname === "/"
      ? "Dashboard"
      : pathname === "/tasks"
      ? "Tasks"
      : pathname === "/musics"
      ? "Musics"
      : "Profile";

  return (
    <>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic">
          {isName}
        </h1>

        {isName !== "Profile" && (
          <div className="flex items-center gap-6">
            <DialogDemo />

            <div className="w-12 h-12 bg-[var(--accent-neon)] border-2 border-white text-black font-black flex items-center justify-center text-xl shadow-[4px_4px_0px_#ffffff]">
              U
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {isName !== "Profile" && (
        <div className="relative mb-8 w-full md:w-[450px]">
          <SearchIcon className="z-10 absolute left-4 top-1/2 -translate-y-1/2 text-white h-5 w-5" />
          <Input
            type="search"
            placeholder="SEARCH SOMETHING..."
            className="pl-12 h-14 bg-[#121212] text-white border-2 border-white rounded-none font-bold uppercase tracking-widest focus-visible:ring-0 focus-visible:border-[var(--accent-neon)] transition-all shadow-[4px_4px_0px_#ffffff]"
          />
        </div>
      )}
    </>
  );
};

export default Header;
