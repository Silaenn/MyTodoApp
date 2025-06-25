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
          <Button
            variant="outline"
            className="flex gap-1 border border-black/10 bg-blue-600 hover:bg-blue-700"
          >
            <Plus />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1F2937]">
          <DialogHeader>
            <DialogTitle className="text-white">Add Task</DialogTitle>
            <DialogDescription>
              Fill the form and click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">
                Name Task
              </Label>
              <Input id="name" name="name" placeholder="e.g. Finish Homework" />
            </div>

            {/* Deadline */}
            <div className="grid gap-2">
              <Label htmlFor="deadline" className="text-white">
                Deadline
              </Label>
              <Input id="deadline" name="deadline" type="date" />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-white">
                Category
              </Label>
              <Select name="category">
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-form">
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="hobby">Hobby</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Music */}
            <div className="grid gap-2">
              <Label htmlFor="music" className="text-white">
                Music
              </Label>
              <Select name="music">
                <SelectTrigger id="music">
                  <SelectValue placeholder="Select music" />
                </SelectTrigger>
                <SelectContent className="bg-form">
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="lofi">Lo-fi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
