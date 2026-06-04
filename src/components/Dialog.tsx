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
        <button className="brutal-btn brutal-btn-primary">
          <Plus size={18} className="stroke-[3px]" />
          Add task
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px] z-[100] border-4 border-[#0F1A0F] bg-[#F5F8F4] shadow-[8px_8px_0px_#0F1A0F] rounded-none">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b-2 border-[#0F1A0F] pb-4 mb-5">
            <DialogTitle className="text-3xl font-black italic">
              New <span className="text-[#3B6B4A]">Task</span>
            </DialogTitle>
            <DialogDescription className="font-bold text-[#5A6E5A]">
              Capture the next thing you want to move forward.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-xs font-black uppercase tracking-[0.3em] text-[#0F1A0F]"
              >
                Task name
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. finish landing page"
                className="brutal-input"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="deadline"
                className="text-xs font-black uppercase tracking-[0.3em] text-[#0F1A0F]"
              >
                Deadline
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                className="brutal-input"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="category"
                className="text-xs font-black uppercase tracking-[0.3em] text-[#0F1A0F]"
              >
                Category
              </Label>
              <Select name="category" defaultValue="work">
                <SelectTrigger id="category" className="brutal-input bg-[#F5F8F4]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="z-[110] border-2 border-[#0F1A0F] bg-[#F5F8F4] shadow-[4px_4px_0px_#0F1A0F]">
                  <SelectItem value="work" className="font-bold focus:bg-[#3B6B4A] focus:text-[#F5F8F4]">Work</SelectItem>
                  <SelectItem value="study" className="font-bold focus:bg-[#3B6B4A] focus:text-[#F5F8F4]">Study</SelectItem>
                  <SelectItem value="hobby" className="font-bold focus:bg-[#3B6B4A] focus:text-[#F5F8F4]">Hobby</SelectItem>
                  <SelectItem value="personal" className="font-bold focus:bg-[#3B6B4A] focus:text-[#F5F8F4]">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-6 gap-3">
            <DialogClose asChild>
              <button
                type="button"
                className="brutal-btn brutal-btn-outline"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={loading}
              className="brutal-btn brutal-btn-primary disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save task"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}