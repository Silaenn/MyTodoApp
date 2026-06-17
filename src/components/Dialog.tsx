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
import { Plus, Edit2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  category: string;
  deadline: string;
  is_done: boolean;
}

export function DialogDemo({ 
  task, 
  onOpenChange,
  onSuccess 
}: { 
  task?: Task; 
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Sync internal open state with parent if needed
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
  };

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
      const url = task ? `/api/tasks/${task.id}` : "/api/tasks";
      const method = task ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        handleOpenChange(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {task ? (
          <button className="brutal-btn brutal-btn-outline p-2.5 w-full sm:w-auto justify-center">
            <Edit2 size={15} />
          </button>
        ) : (
          <button className="brutal-btn brutal-btn-primary px-3 sm:px-6">
            <Plus size={18} className="stroke-[3px]" />
            <span className="text-sm sm:text-base">Add task</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[448px] z-[100] border-4 border-brutal-ink bg-brutal-paper shadow-brutal-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b-2 border-brutal-ink pb-4 mb-5">
            <DialogTitle className="text-3xl font-black italic">
              {task ? "Edit" : "New"} <span className="text-brutal-primary">Task</span>
            </DialogTitle>
            <DialogDescription className="font-bold text-brutal-muted">
              {task ? "Update your task details below." : "Capture the next thing you want to move forward."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5">
            {/* ... (grid content) */}
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-tiny font-black uppercase tracking-brutal text-brutal-ink"
              >
                Task name
              </Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={task?.title}
                placeholder="e.g. finish landing page"
                className="brutal-input"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="deadline"
                className="text-tiny font-black uppercase tracking-brutal text-brutal-ink"
              >
                Deadline
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                defaultValue={task?.deadline}
                className="brutal-input"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="category"
                className="text-tiny font-black uppercase tracking-brutal text-brutal-ink"
              >
                Category
              </Label>
              <Select name="category" defaultValue={task?.category || "work"}>
                <SelectTrigger id="category" className="brutal-input bg-brutal-paper">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="z-[110] border-2 border-brutal-ink bg-brutal-paper shadow-brutal">
                  <SelectItem value="work" className="font-bold focus:bg-brutal-primary focus:text-brutal-paper">Work</SelectItem>
                  <SelectItem value="study" className="font-bold focus:bg-brutal-primary focus:text-brutal-paper">Study</SelectItem>
                  <SelectItem value="hobby" className="font-bold focus:bg-brutal-primary focus:text-brutal-paper">Hobby</SelectItem>
                  <SelectItem value="personal" className="font-bold focus:bg-brutal-primary focus:text-brutal-paper">Personal</SelectItem>
                  <SelectItem value="urgent" className="font-bold focus:bg-brutal-primary focus:text-brutal-paper">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-8 border-t-2 border-brutal-ink pt-6 gap-3">
            <DialogClose asChild>
              <button
                type="button"
                className="brutal-btn brutal-btn-outline shadow-brutal-sm"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={loading}
              className="brutal-btn brutal-btn-primary shadow-brutal-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : (task ? "Update task" : "Save task")}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}