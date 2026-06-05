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

const Home = ({ session }: { session: any }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalActiveTasks, setTotalActiveTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const { likedTracks, playTrack } = useMusicStore();

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      const activeTasks = data.filter((t: Task) => !t.is_done);
      setTotalActiveTasks(activeTasks.length);
      setTasks(activeTasks.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="w-full space-y-10 pb-10">

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] p-6 shadow-[4px_4px_0px_#0F1A0F]">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-2 border-[#0F1A0F] bg-[#D4A843] opacity-30" />
        <div className="absolute right-16 top-16 h-20 w-20 rounded-full border-2 border-[#0F1A0F] bg-[#3B6B4A] opacity-20" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-4xl flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#5A6E5A]">
              Today
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0F1A0F] lg:text-5xl">
              Welcome {" "}
              <span className="text-[#3B6B4A]">{session?.user?.name || "Explorer"}</span>
            </h1>
            <p className="mt-4 text-sm font-medium text-[#5A6E5A] md:text-base">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 md:w-auto">
            <div className="rounded-md border-2 border-[#0F1A0F] bg-[#D4A843] p-5 text-center shadow-[4px_4px_0px_#0F1A0F]">
              {loading ? (
                <div className="h-8 w-12 mx-auto animate-pulse rounded-sm bg-[#0F1A0F]/20" />
              ) : (
                <span className="block text-3xl font-black text-[#0F1A0F]">{totalActiveTasks}</span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0F1A0F]/70">
                Active tasks
              </span>
            </div>
            <div className="rounded-md border-2 border-[#0F1A0F] bg-[#3B6B4A] p-5 text-center shadow-[4px_4px_0px_#0F1A0F]">
              {loading ? (
                <div className="h-8 w-12 mx-auto animate-pulse rounded-sm bg-[#F5F8F4]/20" />
              ) : (
                <span className="block text-3xl font-black text-[#F5F8F4]">
                  {likedTracks.length}
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F5F8F4]/80">
                Saved tracks
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

        {/* Tasks Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#0F1A0F] pb-4">
            <div className="flex items-center gap-4">
              <Clock className="text-[#D4A843]" size={28} />
              <h2 className="text-2xl font-black tracking-tight text-[#0F1A0F] md:text-3xl">
                Priority{" "}
                <span className="text-[#3B6B4A]">tasks</span>
              </h2>
            </div>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1 rounded-md border-2 border-[#0F1A0F] bg-[#D4A843] px-4 py-2 text-xs font-bold text-[#0F1A0F] shadow-[3px_3px_0px_#0F1A0F] transition-all hover:shadow-[5px_5px_0px_#0F1A0F] hover:-translate-x-px hover:-translate-y-px active:shadow-[1px_1px_0px_#0F1A0F] active:translate-x-0.5 active:translate-y-0.5"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-md border-2 border-[#0F1A0F]/20 bg-[#F5F8F4]" />
                ))}
              </div>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="h-24 group flex items-center justify-between gap-4 rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] p-5 shadow-[4px_4px_0px_#0F1A0F] transition-all hover:shadow-[6px_6px_0px_#3B6B4A] hover:border-[#3B6B4A] hover:-translate-x-px hover:-translate-y-px"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-[#0F1A0F] bg-[#D4A843] font-black text-[#0F1A0F] transition-colors group-hover:bg-[#3B6B4A] group-hover:text-[#F5F8F4]">
                      {task.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="mb-1 line-clamp-1 text-base font-bold text-[#0F1A0F]">
                        {task.title}
                      </p>
                      <span className="rounded-sm border border-[#0F1A0F]/30 bg-[#E8EDE6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#5A6E5A]">
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <CheckCircle2
                    className="shrink-0 text-[#0F1A0F]/20 transition-colors group-hover:text-[#3B6B4A]"
                    size={22}
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col gap-4" style={{ minHeight: "calc(100vh - 380px)" }}>
                <div className="flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-[#0F1A0F]/30 bg-[#F5F8F4] text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5A6E5A]">
                    All clear. No tasks pending.
                  </p>
                </div>
                <Link
                  href="/tasks"
                  className="group flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-[#0F1A0F]/30 text-center transition-all hover:border-[#3B6B4A] hover:bg-[#F5F8F4]"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#5A6E5A] group-hover:text-[#3B6B4A]">
                    + Create a new task
                  </span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Music Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#0F1A0F] pb-4">
            <div className="flex items-center gap-4">
              <Heart className="text-[#8B4A2B]" size={28} fill="currentColor" />
              <h2 className="text-2xl font-black tracking-tight text-[#0F1A0F] md:text-3xl">
                Favorite{" "}
                <span className="text-[#3B6B4A]">tracks</span>
              </h2>
            </div>
            <Link
              href="/musics"
              className="inline-flex items-center gap-1 rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] px-4 py-2 text-xs font-bold text-[#0F1A0F] shadow-[3px_3px_0px_#0F1A0F] transition-all hover:shadow-[5px_5px_0px_#0F1A0F] hover:-translate-x-px hover:-translate-y-px active:shadow-[1px_1px_0px_#0F1A0F] active:translate-x-0.5 active:translate-y-0.5"
            >
              Browse <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {likedTracks.length > 0 ? (
              likedTracks.slice(0, 6).map((track) => (
                <div
                  key={track.id}
                  className="group flex flex-col rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] p-2 shadow-[4px_4px_0px_#0F1A0F] transition-all hover:shadow-[6px_6px_0px_#3B6B4A] hover:border-[#3B6B4A] hover:-translate-x-px hover:-translate-y-px"
                >
                  <div className="relative mb-2 aspect-square overflow-hidden rounded-sm border-2 border-[#0F1A0F]">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <button
                      onClick={() => playTrack(track)}
                      className="absolute inset-0 flex items-center justify-center bg-[#3B6B4A]/40 opacity-0 transition-all group-hover:opacity-100"
                    >
                      <div className="rounded-full border-2 border-[#F5F8F4] bg-[#F5F8F4] p-2 shadow-[2px_2px_0px_#0F1A0F]">
                        <Play fill="#0F1A0F" size={16} className="text-[#0F1A0F] ml-0.5" />
                      </div>
                    </button>
                  </div>
                  <p className="mb-0.5 truncate text-[11px] font-bold leading-tight text-[#0F1A0F]">
                    {track.title}
                  </p>
                  <p className="truncate text-[9px] font-bold uppercase tracking-[0.1em] text-[#3B6B4A]">
                    {track.artist}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-[#0F1A0F]/30 bg-[#F5F8F4] text-center min-h-[300px] md:min-h-[550px] p-8">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5A6E5A]">
                  No tracks saved yet.
                </p>
                <Link
                  href="/musics"
                  className="mt-4 inline-flex items-center gap-1 rounded-md border-2 border-[#0F1A0F] bg-[#3B6B4A] px-4 py-2 text-xs font-bold text-[#F5F8F4] shadow-[3px_3px_0px_#0F1A0F]"
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