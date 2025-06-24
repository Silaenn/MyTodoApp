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
    <>
      {/* Main Content */}
      <div className="flex justify-end items-center mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-form">Genre</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 bg-form mr-6 mt-1">
            <DropdownMenuLabel>Select</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={genre} onValueChange={setGenre}>
              <DropdownMenuRadioItem value="pop">Pop</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="jazz">Jazz</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="klasik ">
                Klasik
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="chill">Chill</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Playlist */}
      <div className="space-y-4">
        <div className="bg-form p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Upbeat Coding</h3>
            <p className="text-gray-400 text-sm">Mood: Upbeat</p>
          </div>
          <div className="flex space-x-2">
            <Button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
              ▶ {""} Play
            </Button>
            <Button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
              Set for Task
            </Button>
          </div>
        </div>
        <div className="bg-form p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Chill Vibes</h3>
            <p className="text-gray-400 text-sm">Mood: Chill</p>
          </div>
          <div className="flex space-x-2">
            <Button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
              ▶ {""} Play
            </Button>
            <Button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
              Set for Task
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Musics;
