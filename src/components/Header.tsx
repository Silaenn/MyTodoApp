import React from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { DialogDemo } from "./Dialog";

type UserProfile = {
  image?: string | null;
  name?: string | null;
};

const Header = ({ user }: { user?: UserProfile }) => {
  const pathname = usePathname();
  const isName =
    pathname === "/"
      ? "Dashboard"
      : pathname === "/tasks"
      ? "Tasks"
      : pathname === "/musics"
      ? "Music"
      : "Profile";

  return (
    <>
      <div className="mb-8 flex flex-col gap-5 rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] p-6 shadow-[4px_4px_0px_#1A1208] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#6B5744]">
            Workspace view
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#1A1208] sm:text-5xl md:text-6xl">
            {isName}
          </h1>
        </div>

        {isName !== "Profile" && (
          <div className="flex items-center gap-4 sm:gap-6">
            <DialogDemo />
            <div className="group relative">
              <div className="absolute inset-0 rounded-sm border-2 border-[#1A1208] bg-[#E8A838] translate-x-1 translate-y-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-sm border-2 border-[#1A1208] bg-[#FDFAF4] text-sm font-black text-[#1A1208] transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 sm:h-14 sm:w-14">
                {user?.image ? (
                  <img
                    src={user.image ?? undefined}
                    alt={user.name ?? "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isName !== "Profile" && (
        <div className="relative mb-10 w-full md:w-[640px] group">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B5744] transition-colors group-focus-within:text-[#C75B2D] z-10"
            size={20}
          />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-12 h-12 sm:h-14 text-base sm:text-lg"
          />
        </div>
      )}
    </>
  );
};

export default Header;