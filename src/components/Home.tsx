"use client";
import React, { useEffect, useState } from "react";
import { useMusicStore } from "@/lib/music-store";
import { Play, CheckCircle2, Clock, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

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
      // Only get top 3 unfinished tasks for dashboard
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
        <p className="text-4xl md:text-6xl font-black uppercase italic animate-bounce text-brutal-neon text-stroke-sm">
          Scanning Systems...
        </p>
        <div className="w-64 md:w-96 h-6 border-4 border-white mt-8 overflow-hidden bg-brutal-gray shadow-brutal">
          <div className="h-full bg-brutal-neon animate-[vibrate_0.1s_linear_infinite] w-1/2 border-r-4 border-white"></div>
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.5em] text-white/30 animate-pulse">
          Accessing encrypted protocols
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Welcome Hero */}
      <section className="relative p-8 md:p-12 border-4 border-white bg-brutal-gray shadow-brutal-neon overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brutal-neon/10 rounded-full blur-3xl group-hover:bg-brutal-neon/20 transition-all"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-4 text-stroke-sm">
              WELCOME <span className="text-brutal-neon !text-white !italic">USER</span>
            </h1>
            <p className="text-sm md:text-lg font-black uppercase tracking-[0.3em] opacity-60">
              System Online // {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="brutal-card p-4 bg-white text-black text-center min-w-[120px]">
              <span className="block text-3xl font-black italic">{tasks.length}</span>
              <span className="text-[8px] font-black uppercase">Active Protocols</span>
            </div>
            <div className="brutal-card p-4 bg-brutal-pink text-white text-center min-w-[120px]">
              <span className="block text-3xl font-black italic">{likedTracks.length}</span>
              <span className="text-[8px] font-black uppercase">Stored Vibes</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Urgent Tasks Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-white pb-4">
            <div className="flex items-center gap-4">
              <Clock className="text-brutal-yellow" size={32} />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Priority <span className="text-brutal-yellow">Tasks</span></h2>
            </div>
            <Link href="/tasks" className="brutal-btn py-1 px-3 text-[10px] bg-white text-black hover:bg-brutal-neon">
              VIEW ALL <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="brutal-card p-4 flex items-center justify-between group hover:border-brutal-yellow transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border-2 border-white bg-brutal-gray flex items-center justify-center font-black group-hover:bg-brutal-yellow group-hover:text-black transition-colors">
                      {task.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black uppercase text-lg leading-none mb-1">{task.title}</p>
                      <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5">{task.category}</span>
                    </div>
                  </div>
                  <CheckCircle2 className="text-white/20 group-hover:text-brutal-yellow transition-colors" />
                </div>
              ))
            ) : (
              <div className="p-8 border-4 border-dashed border-white/20 text-center">
                <p className="text-sm font-black text-gray-500 uppercase tracking-widest italic">All systems clear.</p>
              </div>
            )}
            <Link href="/tasks" className="block p-4 border-4 border-dashed border-white/20 text-center hover:border-brutal-neon hover:bg-white/5 transition-all group">
              <span className="text-xs font-black uppercase tracking-widest group-hover:text-brutal-neon">+ INITIATE NEW PROTOCOL</span>
            </Link>
          </div>
        </section>

        {/* Favorite Vibes Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-white pb-4">
            <div className="flex items-center gap-4">
              <Heart className="text-brutal-pink" size={32} fill="currentColor" />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Favorite <span className="text-brutal-pink">Vibes</span></h2>
            </div>
            <Link href="/musics" className="brutal-btn py-1 px-3 text-[10px] bg-white text-black hover:bg-brutal-pink">
              BROWSE <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {likedTracks.length > 0 ? (
              likedTracks.slice(0, 4).map((track) => (
                <div key={track.id} className="brutal-card p-3 flex flex-col group hover:border-brutal-pink transition-all">
                  <div className="relative aspect-square border-2 border-white overflow-hidden mb-3">
                    <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <button 
                      onClick={() => playTrack(track)}
                      className="absolute inset-0 bg-brutal-pink/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                    >
                      <Play fill="white" size={32} />
                    </button>
                  </div>
                  <p className="font-black uppercase text-[10px] truncate leading-none mb-1">{track.title}</p>
                  <p className="text-brutal-pink font-black text-[8px] truncate opacity-80">{track.artist}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 border-4 border-dashed border-white/20 text-center">
                <p className="text-sm font-black text-gray-500 uppercase tracking-widest italic">No vibes stored in archives.</p>
                <Link href="/musics" className="inline-block mt-4 brutal-btn py-1 px-4 text-[10px] bg-white text-black">
                  EXPLORE MUSIC
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
