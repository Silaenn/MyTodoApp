"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DialogDemo() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button
            className="brutal-btn bg-[var(--accent-neon)] text-black flex gap-2 items-center"
          >
            <Plus size={20} className="stroke-[3px]" />
            ADD TASK
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-black border-4 border-white rounded-none shadow-[8px_8px_0px_#ffffff]">
          <DialogHeader className="border-b-2 border-white pb-4 mb-4">
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">New <span className="text-[var(--accent-neon)]">Task</span></DialogTitle>
            <DialogDescription className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              Setup your next big vibe.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-black uppercase tracking-widest text-xs">
                TASK NAME
              </Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="E.G. FINISH MIXTAPE" 
                className="bg-[#121212] border-2 border-white rounded-none h-12 font-bold focus-visible:border-[var(--accent-neon)]"
              />
            </div>

            {/* Deadline */}
            <div className="grid gap-2">
              <Label htmlFor="deadline" className="font-black uppercase tracking-widest text-xs">
                DEADLINE
              </Label>
              <Input 
                id="deadline" 
                name="deadline" 
                type="date" 
                className="bg-[#121212] border-2 border-white rounded-none h-12 font-bold focus-visible:border-[var(--accent-neon)]"
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category" className="font-black uppercase tracking-widest text-xs">
                CATEGORY
              </Label>
              <Select name="category">
                <SelectTrigger id="category" className="bg-[#121212] border-2 border-white rounded-none h-12 font-bold">
                  <SelectValue placeholder="SELECT CATEGORY" />
                </SelectTrigger>
                <SelectContent className="bg-black border-2 border-white rounded-none">
                  <SelectItem value="work" className="hover:bg-white hover:text-black font-bold uppercase">Work</SelectItem>
                  <SelectItem value="study" className="hover:bg-white hover:text-black font-bold uppercase">Study</SelectItem>
                  <SelectItem value="hobby" className="hover:bg-white hover:text-black font-bold uppercase">Hobby</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Music */}
            <div className="grid gap-2">
              <Label htmlFor="music" className="font-black uppercase tracking-widest text-xs">
                VIBE/MUSIC
              </Label>
              <Select name="music">
                <SelectTrigger id="music" className="bg-[#121212] border-2 border-white rounded-none h-12 font-bold">
                  <SelectValue placeholder="SELECT VIBE" />
                </SelectTrigger>
                <SelectContent className="bg-black border-2 border-white rounded-none">
                  <SelectItem value="jazz" className="hover:bg-white hover:text-black font-bold uppercase">Jazz</SelectItem>
                  <SelectItem value="pop" className="hover:bg-white hover:text-black font-bold uppercase">Pop</SelectItem>
                  <SelectItem value="lofi" className="hover:bg-white hover:text-black font-bold uppercase">Lo-fi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-6 gap-4">
            <DialogClose asChild>
              <button type="button" className="brutal-btn bg-black text-white hover:bg-white hover:text-black">CANCEL</button>
            </DialogClose>
            <button type="submit" className="brutal-btn bg-[var(--accent-neon)] text-black">SAVE TASK</button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
