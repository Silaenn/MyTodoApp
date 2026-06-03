"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Heart, Play } from "lucide-react";
import { useMusicStore } from "@/lib/music-store";

interface Task {
  id: string;
  title: string;
  category: string;
  is_done: boolean;
}

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { likedTracks, playTrack } = useMusicStore();

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data.filter((t: Task) => !t.is_done).slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-320px)]">
        <p className="text-4xl md:text-6xl font-black tracking-tight text-[#C75B2D]">
          Loading tasks...
        </p>
        <div className="mt-8 h-3 w-64 md:w-96 overflow-hidden rounded-sm border-2 border-[#1A1208] bg-[#FDFAF4] shadow-[3px_3px_0px_#1A1208]">
          <div className="h-full w-1/2 animate-pulse bg-[#C75B2D]" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.5em] text-[#6B5744] animate-pulse">
          Accessing workspace data
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 pb-20">

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] p-8 shadow-[6px_6px_0px_#1A1208] md:p-10">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-2 border-[#1A1208] bg-[#E8A838] opacity-30" />
        <div className="absolute right-16 top-16 h-20 w-20 rounded-full border-2 border-[#1A1208] bg-[#C75B2D] opacity-20" />
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#6B5744]">
              Today
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight text-[#1A1208] md:text-6xl">
              Welcome back,{" "}
              <span className="text-[#C75B2D]">user</span>
            </h1>
            <p className="mt-4 text-sm font-medium text-[#6B5744] md:text-base">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 md:w-auto">
            <div className="rounded-md border-2 border-[#1A1208] bg-[#E8A838] p-5 text-center shadow-[4px_4px_0px_#1A1208]">
              <span className="block text-3xl font-black text-[#1A1208]">
                {tasks.length}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1208]/70">
                Active tasks
              </span>
            </div>
            <div className="rounded-md border-2 border-[#1A1208] bg-[#4A7C59] p-5 text-center shadow-[4px_4px_0px_#1A1208]">
              <span className="block text-3xl font-black text-[#FDFAF4]">
                {likedTracks.length}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FDFAF4]/80">
                Saved tracks
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

        {/* Tasks Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#1A1208] pb-4">
            <div className="flex items-center gap-4">
              <Clock className="text-[#E8A838]" size={28} />
              <h2 className="text-2xl font-black tracking-tight text-[#1A1208] md:text-3xl">
                Priority{" "}
                <span className="text-[#C75B2D]">tasks</span>
              </h2>
            </div>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1 rounded-md border-2 border-[#1A1208] bg-[#E8A838] px-4 py-2 text-xs font-bold text-[#1A1208] shadow-[3px_3px_0px_#1A1208] transition-all hover:shadow-[5px_5px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px active:shadow-[1px_1px_0px_#1A1208] active:translate-x-0.5 active:translate-y-0.5"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center justify-between gap-4 rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] p-5 shadow-[4px_4px_0px_#1A1208] transition-all hover:shadow-[6px_6px_0px_#C75B2D] hover:border-[#C75B2D] hover:-translate-x-px hover:-translate-y-px"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-[#1A1208] bg-[#E8A838] font-black text-[#1A1208] transition-colors group-hover:bg-[#C75B2D] group-hover:text-[#FDFAF4]">
                      {task.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="mb-1 text-base font-bold leading-none text-[#1A1208]">
                        {task.title}
                      </p>
                      <span className="rounded-sm border border-[#1A1208]/30 bg-[#F5ECD7] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B5744]">
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <CheckCircle2
                    className="text-[#1A1208]/20 transition-colors group-hover:text-[#C75B2D]"
                    size={22}
                  />
                </div>
              ))
            ) : (
              <div className="rounded-md border-2 border-dashed border-[#1A1208]/30 bg-[#FDFAF4] p-8 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#6B5744]">
                  All clear. No tasks pending.
                </p>
              </div>
            )}

            <Link
              href="/tasks"
              className="group block rounded-md border-2 border-dashed border-[#1A1208]/30 p-4 text-center transition-all hover:border-[#C75B2D] hover:bg-[#FDFAF4]"
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#6B5744] group-hover:text-[#C75B2D]">
                + Create a new task
              </span>
            </Link>
          </div>
        </section>

        {/* Music Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#1A1208] pb-4">
            <div className="flex items-center gap-4">
              <Heart className="text-[#C75B2D]" size={28} fill="currentColor" />
              <h2 className="text-2xl font-black tracking-tight text-[#1A1208] md:text-3xl">
                Favorite{" "}
                <span className="text-[#C75B2D]">tracks</span>
              </h2>
            </div>
            <Link
              href="/musics"
              className="inline-flex items-center gap-1 rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] px-4 py-2 text-xs font-bold text-[#1A1208] shadow-[3px_3px_0px_#1A1208] transition-all hover:shadow-[5px_5px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px active:shadow-[1px_1px_0px_#1A1208] active:translate-x-0.5 active:translate-y-0.5"
            >
              Browse <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {likedTracks.length > 0 ? (
              likedTracks.slice(0, 4).map((track) => (
                <div
                  key={track.id}
                  className="group flex flex-col rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] p-3 shadow-[4px_4px_0px_#1A1208] transition-all hover:shadow-[6px_6px_0px_#C75B2D] hover:border-[#C75B2D] hover:-translate-x-px hover:-translate-y-px"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-sm border-2 border-[#1A1208]">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                    <button
                      onClick={() => playTrack(track)}
                      className="absolute inset-0 flex items-center justify-center bg-[#1A1208]/50 opacity-0 transition-all group-hover:opacity-100"
                    >
                      <Play fill="white" size={28} className="text-[#FDFAF4]" />
                    </button>
                  </div>
                  <p className="mb-1 truncate text-sm font-bold leading-none text-[#1A1208]">
                    {track.title}
                  </p>
                  <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-[#C75B2D]">
                    {track.artist}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-md border-2 border-dashed border-[#1A1208]/30 bg-[#FDFAF4] p-8 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#6B5744]">
                  No tracks saved yet.
                </p>
                <Link
                  href="/musics"
                  className="mt-4 inline-flex items-center gap-1 rounded-md border-2 border-[#1A1208] bg-[#C75B2D] px-4 py-2 text-xs font-bold text-[#FDFAF4] shadow-[3px_3px_0px_#1A1208]"
                >
                  Explore music
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;