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

const Musics = () => {
  const [genre, setGenre] = useState("pop");
  return (
    <div className="max-w-5xl">
      {/* Main Content */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Vibe <span className="text-[var(--accent-pink)]">Library</span></h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="brutal-btn brutal-btn-pink">Genre: {genre}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black border-2 border-white rounded-none p-2">
            <DropdownMenuLabel className="text-white font-black uppercase text-xs">Select Genre</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white" />
            <DropdownMenuRadioGroup value={genre} onValueChange={setGenre} className="text-white">
              <DropdownMenuRadioItem value="pop" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">Pop</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="jazz" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">Jazz</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="klasik" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">Klasik</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="chill" className="hover:bg-white hover:text-black font-bold uppercase cursor-pointer">Chill</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Playlist */}
      <div className="space-y-6">
        {[
          { title: "Upbeat Coding", mood: "Upbeat" },
          { title: "Chill Vibes", mood: "Chill" }
        ].map((m, i) => (
          <div key={i} className="brutal-card p-6 flex justify-between items-center group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[var(--accent-neon)] border-2 border-white flex items-center justify-center font-black text-black text-2xl group-hover:bg-white transition-all">
                {i + 1}
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase">{m.title}</h3>
                <p className="text-[var(--accent-pink)] text-xs font-bold uppercase tracking-widest mt-1">Mood: {m.mood}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="brutal-btn bg-white text-black hover:bg-[var(--accent-neon)]">
                ▶ PLAY
              </button>
              <button className="brutal-btn bg-black text-white hover:bg-white hover:text-black">
                SET FOR TASK
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Musics;
