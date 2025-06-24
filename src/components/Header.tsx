import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";

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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{isName}</h1>

        {isName !== "Profile" && (
          <div className="flex items-center gap-4">
            <Button className="flex gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus size={16} />
              Add Task
            </Button>

            <div className="w-10 h-10 bg-form text-white font-semibold rounded-full flex items-center justify-center">
              U
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {isName !== "Profile" && (
        <div className="relative mb-6 w-full md:w-96">
          <SearchIcon className="z-10 absolute left-2 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-white/10 text-white placeholder:text-white/60 border border-white/20 backdrop-blur-md"
          />
        </div>
      )}
    </>
  );
};

export default Header;
