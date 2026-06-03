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
        router.refresh();
        if (typeof window !== "undefined") window.location.reload();
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
        <button className="inline-flex items-center gap-2 rounded-md border-2 border-[#1A1208] bg-[#C75B2D] px-5 py-2.5 text-sm font-bold text-[#FDFAF4] shadow-[3px_3px_0px_#1A1208] transition-all hover:shadow-[5px_5px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px active:shadow-[1px_1px_0px_#1A1208] active:translate-x-0.5 active:translate-y-0.5">
          <Plus size={18} className="stroke-[3px]" />
          Add task
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px] z-[100]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b-2 border-[#1A1208] pb-4 mb-5">
            <DialogTitle>
              New <span className="text-[#C75B2D]">Task</span>
            </DialogTitle>
            <DialogDescription>
              Capture the next thing you want to move forward.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-[0.3em] text-[#6B5744]"
              >
                Task name
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. finish landing page"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="deadline"
                className="text-xs font-bold uppercase tracking-[0.3em] text-[#6B5744]"
              >
                Deadline
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="category"
                className="text-xs font-bold uppercase tracking-[0.3em] text-[#6B5744]"
              >
                Category
              </Label>
              <Select name="category" defaultValue="work">
                <SelectTrigger id="category">
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
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] px-5 py-2.5 text-sm font-bold text-[#1A1208] shadow-[3px_3px_0px_#1A1208] transition-all hover:shadow-[5px_5px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px active:shadow-[1px_1px_0px_#1A1208] active:translate-x-0.5 active:translate-y-0.5"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md border-2 border-[#1A1208] bg-[#C75B2D] px-5 py-2.5 text-sm font-bold text-[#FDFAF4] shadow-[3px_3px_0px_#1A1208] transition-all hover:shadow-[5px_5px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px active:shadow-[1px_1px_0px_#1A1208] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Saving..." : "Save task"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}