"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmProps {
  onConfirm: () => void;
  title?: string;
  trigger?: React.ReactNode;
}

export const DeleteConfirm = ({ 
  onConfirm, 
  title = "Delete Task", 
  trigger 
}: DeleteConfirmProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button className="brutal-btn brutal-btn-accent shadow-brutal-sm flex items-center justify-center gap-2 py-2 px-4 h-11 sm:w-auto">
            <Trash2 size={16} />
            <span className="text-xs sm:text-sm font-bold">Delete</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border-4 border-brutal-ink bg-brutal-paper shadow-brutal-lg rounded-md overflow-hidden p-0 gap-0">
        <div className="bg-brutal-accent p-6 flex items-center gap-4 border-b-4 border-brutal-ink">
          <div className="bg-brutal-paper p-2 rounded-md border-2 border-brutal-ink shadow-brutal-sm">
            <AlertTriangle size={28} className="text-brutal-accent stroke-[3px]" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-brutal-paper">
            Confirm Delete
          </DialogTitle>
        </div>

        <div className="p-8 space-y-6">
          <DialogDescription className="text-base font-bold text-brutal-ink leading-relaxed">
            Are you sure you want to delete <span className="text-brutal-accent underline decoration-4 underline-offset-4">&quot;{title}&quot;</span>? 
            <br /><br />
            This action is <span className="uppercase text-brutal-accent">irreversible</span> and will wipe this frequency from your board.
          </DialogDescription>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <DialogClose asChild>
              <button className="flex-1 brutal-btn brutal-btn-outline h-12 text-sm font-black uppercase">
                Abort Mission
              </button>
            </DialogClose>
            <button
              onClick={() => {
                onConfirm();
              }}
              className="flex-1 brutal-btn brutal-btn-accent bg-red-600 text-brutal-paper h-12 text-sm font-black uppercase shadow-brutal hover:bg-red-700"
            >
              Destroy Data
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};