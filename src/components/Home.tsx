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
      <div className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-320px)] sm:h-[calc(100vh-350px)] md:h-[calc(100vh-380px)] overflow-hidden">
        <p className="text-4xl md:text-6xl font-black tracking-tight text-brutal-neon">
          Scanning systems...
        </p>
        <div className="mt-8 h-3 w-64 md:w-96 overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-brutal">
          <div className="h-full w-1/2 animate-pulse bg-brutal-neon" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.5em] text-white/40 animate-pulse">
          Accessing workspace data
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 pb-20">
      <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-brutal backdrop-blur-xl md:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brutal-neon/15 blur-3xl transition-all group-hover:bg-brutal-neon/25" />
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Today</p>
            <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-50 md:text-6xl">
              Welcome back, <span className="text-brutal-neon">user</span>
            </h1>
            <p className="mt-4 text-sm text-slate-300 md:text-base">
              System online // {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 md:w-auto">
            <div className="brutal-card min-w-[140px] p-5 text-center">
              <span className="block text-3xl font-black text-slate-50">{tasks.length}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">Active tasks</span>
            </div>
            <div className="brutal-card min-w-[140px] p-5 text-center">
              <span className="block text-3xl font-black text-brutal-pink">{likedTracks.length}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">Saved tracks</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <Clock className="text-brutal-yellow" size={28} />
              <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                Priority <span className="text-brutal-yellow">tasks</span>
              </h2>
            </div>
            <Link href="/tasks" className="brutal-btn bg-white px-4 py-2 text-xs text-slate-950 hover:bg-teal-300">
              View all <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="brutal-card group flex items-center justify-between gap-4 p-5 transition-all hover:border-brutal-yellow">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 font-semibold transition-colors group-hover:bg-brutal-yellow group-hover:text-slate-950">
                      {task.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="mb-1 text-lg font-semibold leading-none text-slate-50">{task.title}</p>
                      <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className="text-white/20 transition-colors group-hover:text-brutal-yellow" />
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">All systems clear.</p>
              </div>
            )}

            <Link href="/tasks" className="group block rounded-3xl border border-dashed border-white/10 p-4 text-center transition-all hover:border-brutal-neon hover:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] group-hover:text-brutal-neon">+ Create a new task</span>
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <Heart className="text-brutal-pink" size={32} fill="currentColor" />
              <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                Favorite <span className="text-brutal-pink">tracks</span>
              </h2>
            </div>
            <Link href="/musics" className="brutal-btn bg-white px-4 py-2 text-xs text-slate-950 hover:bg-orange-300">
              Browse <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {likedTracks.length > 0 ? (
              likedTracks.slice(0, 4).map((track) => (
                <div key={track.id} className="brutal-card group flex flex-col p-3 transition-all hover:border-brutal-pink">
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl border border-white/10">
                    <img src={track.thumbnail} alt={track.title} className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                    <button
                      onClick={() => playTrack(track)}
                      className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-all group-hover:opacity-100"
                    >
                      <Play fill="white" size={28} />
                    </button>
                  </div>
                  <p className="mb-1 truncate text-sm font-semibold leading-none text-slate-50">{track.title}</p>
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-brutal-pink opacity-80">
                    {track.artist}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">No tracks saved yet.</p>
                <Link href="/musics" className="brutal-btn mt-4 bg-white px-4 py-2 text-xs text-slate-950">
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
