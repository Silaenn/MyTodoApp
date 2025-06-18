"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Task } from "../lib/types";
import { triggerConfetti } from "../lib/confetti";
import { reorderTasks, updateTaskOrder } from "@/lib/dragAndDrop";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    async function fetchTasks() {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("order", { ascending: true });
      setTasks(data || []);
    }
    fetchTasks();

    const subscription = supabase
      .channel("tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => fetchTasks()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isClient]);

  const addTask = async ({
    title,
    category,
  }: {
    title: string;
    category: string;
  }) => {
    const newOrder = tasks.length
      ? Math.max(...tasks.map((t) => t.order)) + 1
      : 0;
    const { data } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          category,
          completed: false,
          song_url: "/sample-song.mp3",
          order: newOrder,
        },
      ])
      .select();
    if (data && data.length > 0) {
      setTasks([...tasks, data[0]]);
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    const { data } = await supabase
      .from("tasks")
      .update({ completed: !completed })
      .eq("id", id)
      .select();
    if (data && data.length > 0) {
      setTasks(tasks.map((task) => (task.id === id ? data[0] : task)));
      if (!completed) triggerConfetti();
    }
  };

  const deleteTask = async (id: number) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const updatedTasks = reorderTasks(tasks, active.id, over.id);
    setTasks(updatedTasks);
    await updateTaskOrder(updatedTasks);
  };

  return { tasks, addTask, toggleTask, deleteTask, handleDragEnd };
}
