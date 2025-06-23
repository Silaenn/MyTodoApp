import React from "react";
import { Input } from "./ui/input";
import { Plus, SearchIcon } from "lucide-react";

const Header = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="flex gap-1 bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600">
            <Plus />
            Add Task
          </button>
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            U
          </div>
        </div>
      </div>

      <div className="flex w-full items-center border border-gray-300 rounded-lg mb-6 px-2.5 py-1.5">
        <SearchIcon className="h-4 w-4 mr-2.5" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full border-0"
        />
      </div>
    </>
  );
};

export default Header;
