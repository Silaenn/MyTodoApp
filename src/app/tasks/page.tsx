"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Tasks = () => {
  const [category, setCategory] = useState("chill");
  return (
    <>
      <div className="flex justify-end items-center mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gray-700">Category</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 bg-gray-700 mr-6 mt-1">
            <DropdownMenuLabel>Select</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={category}
              onValueChange={setCategory}
            >
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="personal">
                Personal
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="chill">Chill</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Finish Report</h3>
            <p className="text-gray-400 text-sm">Deadline: 2025-06-25</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
              Edit
            </button>
            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Read Book</h3>
            <p className="text-gray-400 text-sm">Deadline: 2025-06-30</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
              Edit
            </button>
            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* No Tasks Message */}
      {false && ( // Ganti dengan logika jika task kosong
        <p className="text-center text-gray-400 mt-6">No tasks available.</p>
      )}
    </>
  );
};

export default Tasks;
