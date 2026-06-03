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
          className="brutal-btn bg-brutal-neon text-slate-950 flex gap-2 items-center"
        >
          <Plus size={20} className="stroke-[3px]" />
          Add task
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px] z-[100]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="text-3xl font-black tracking-tight">New <span className="text-brutal-neon">Task</span></DialogTitle>
            <DialogDescription className="text-sm text-slate-400">
              Capture the next thing you want to move forward.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                Task name
              </Label>
              <Input 
                id="name" 
                name="name" 
                required
                placeholder="e.g. finish landing page" 
                className="h-12"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                Deadline
              </Label>
              <Input 
                id="deadline" 
                name="deadline" 
                type="date" 
                className="h-12"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                Category
              </Label>
              <Select name="category" defaultValue="work">
                <SelectTrigger id="category" className="h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="z-[110]">
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="hobby">Hobby</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-6 gap-3">
            <DialogClose asChild>
              <button type="button" className="brutal-btn brutal-btn-outline">Cancel</button>
            </DialogClose>
            <button 
              type="submit" 
              disabled={loading}
              className="brutal-btn bg-brutal-neon text-slate-950 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save task"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
