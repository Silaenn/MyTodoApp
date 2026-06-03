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
      <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-brutal backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Workspace view</p>
          <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-50">
            {isName}
          </h1>
        </div>

        {isName !== "Profile" && (
          <div className="flex items-center gap-4 sm:gap-6">
            <DialogDemo />

            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-brutal-neon/25 translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900 text-sm font-semibold text-white shadow-brutal transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 sm:h-16 sm:w-16">
                {user?.image ? (
                  <img src={user.image ?? undefined} alt={user.name ?? "User"} className="w-full h-full object-cover" />
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
          <SearchIcon className="z-10 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brutal-neon transition-colors" size={22} />
          <Input
            type="search"
            placeholder="ACCESS DATABASE..."
            className="pl-14 h-14 sm:h-16 text-base sm:text-lg shadow-brutal border-white/10"
          />
        </div>
      )}
    </>
  );
};

export default Header;
