"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

export function DialogDemo() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("name"),
      deadline: formData.get("deadline"),
      category: formData.get("category"),
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh(); // Refresh current page data
        // If on /tasks or /, we might want a harder refresh or custom event
        if (typeof window !== 'undefined') window.location.reload(); 
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="brutal-btn bg-[var(--accent-neon)] text-black flex gap-2 items-center"
        >
          <Plus size={20} className="stroke-[3px]" />
          ADD TASK
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border-4 border-white rounded-none shadow-[8px_8px_0px_#ffffff] z-[100]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b-2 border-white pb-4 mb-4">
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">New <span className="text-[var(--accent-neon)]">Task</span></DialogTitle>
            <DialogDescription className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              Setup your next big vibe.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-black uppercase tracking-widest text-xs text-white">
                TASK NAME
              </Label>
              <Input 
                id="name" 
                name="name" 
                required
                placeholder="E.G. FINISH MIXTAPE" 
                className="bg-[#121212] border-2 border-white rounded-none h-12 font-bold focus-visible:border-[var(--accent-neon)] text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline" className="font-black uppercase tracking-widest text-xs text-white">
                DEADLINE
              </Label>
              <Input 
                id="deadline" 
                name="deadline" 
                type="date" 
                className="bg-[#121212] border-2 border-white rounded-none h-12 font-bold focus-visible:border-[var(--accent-neon)] text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category" className="font-black uppercase tracking-widest text-xs text-white">
                CATEGORY
              </Label>
              <Select name="category" defaultValue="work">
                <SelectTrigger id="category" className="bg-[#121212] border-2 border-white rounded-none h-12 font-bold text-white">
                  <SelectValue placeholder="SELECT CATEGORY" />
                </SelectTrigger>
                <SelectContent className="bg-black border-2 border-white rounded-none z-[110]">
                  <SelectItem value="work" className="hover:bg-white hover:text-black font-bold uppercase text-white">Work</SelectItem>
                  <SelectItem value="study" className="hover:bg-white hover:text-black font-bold uppercase text-white">Study</SelectItem>
                  <SelectItem value="hobby" className="hover:bg-white hover:text-black font-bold uppercase text-white">Hobby</SelectItem>
                  <SelectItem value="personal" className="hover:bg-white hover:text-black font-bold uppercase text-white">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-6 gap-4">
            <DialogClose asChild>
              <button type="button" className="brutal-btn bg-black text-white hover:bg-white hover:text-black">CANCEL</button>
            </DialogClose>
            <button 
              type="submit" 
              disabled={loading}
              className="brutal-btn bg-[var(--accent-neon)] text-black disabled:opacity-50"
            >
              {loading ? "SAVING..." : "SAVE TASK"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
