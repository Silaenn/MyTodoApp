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
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Manage <span className="text-[var(--accent-neon)]">Tasks</span></h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="brutal-btn brutal-btn-primary">Filter: {category}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black border-2 border-white rounded-none p-2">
            <DropdownMenuLabel className="text-white font-black uppercase text-xs">Category</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white" />
            <DropdownMenuRadioGroup
              value={category}
              onValueChange={setCategory}
              className="text-white"
            >
              <DropdownMenuRadioItem value="all" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="work" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">Work</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="personal" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">Personal</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="chill" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">Chill</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task List */}
      <div className="space-y-6">
        {[
          { title: "Finish Report", date: "2025-06-25", cat: "Work" },
          { title: "Read Book", date: "2025-06-30", cat: "Personal" }
        ].map((t, i) => (
          <div key={i} className="brutal-card p-6 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black bg-white text-black px-2 py-0.5 mb-2 inline-block uppercase">{t.cat}</span>
              <h3 className="text-2xl font-black uppercase italic">{t.title}</h3>
              <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">DL: {t.date}</p>
            </div>
            <div className="flex gap-4">
              <button className="brutal-btn bg-white text-black hover:bg-yellow-400">
                EDIT
              </button>
              <button className="brutal-btn bg-white text-black hover:bg-red-500">
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
