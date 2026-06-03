import React from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { DialogDemo } from "./Dialog";

const Header = ({ user }: { user?: any }) => {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 border-b-4 border-white pb-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-stroke">
          {isName}
        </h1>

        {isName !== "Profile" && (
          <div className="flex items-center gap-4 sm:gap-8">
            <DialogDemo />

            <div className="group relative">
              <div className="absolute inset-0 bg-brutal-neon translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-black border-4 border-white text-white font-black flex items-center justify-center overflow-hidden italic group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform">
                {user?.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {isName !== "Profile" && (
        <div className="relative mb-10 w-full md:w-[600px] group">
          <SearchIcon className="z-10 absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-brutal-neon transition-colors" size={24} />
          <Input
            type="search"
            placeholder="ACCESS DATABASE..."
            className="pl-14 h-16 sm:h-20 text-lg sm:text-xl shadow-brutal border-4"
          />
        </div>
      )}
    </>
  );
};

export default Header;
