"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Heart, Play } from "lucide-react";
import { useMusicStore } from "@/lib/music-store";
import { MusicSpacer } from "@/components/MusicSpacer";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Session } from "next-auth";

interface Task {
  id: string;
  title: string;
  category: string;
  is_done: boolean;
}

// Parent container for all sections
const mainContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Animation for each major block (Hero, Task Section, Music Section)
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 12,
      mass: 0.8
    }
  }
};

const Home = ({ session }: { session: Session | null }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalActiveTasks, setTotalActiveTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Use selectors to prevent unnecessary re-renders
  const likedTracks = useMusicStore((state) => state.likedTracks);
  const playTrack = useMusicStore((state) => state.playTrack);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        setTasks([]);
        setTotalActiveTasks(0);
        return;
      }

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
    if (session) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [session]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 20 }}
      variants={mainContainerVariants}
      className="w-full flex-1 flex flex-col space-y-6 sm:space-y-10"
    >
      {/* Hero Section */}
      <motion.section 
        variants={sectionVariants}
        className="relative overflow-hidden rounded-md border-2 border-brutal-ink bg-brutal-paper p-4 sm:p-6 shadow-brutal"
      >
        {/* Ambient Glows */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brutal-primary/10 blur-[80px] pointer-events-none" />
        <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-brutal-secondary/10 blur-[60px] pointer-events-none" />
        
        <div className="absolute -right-8 -top-8 h-32 w-32 sm:h-40 sm:w-40 rounded-full border-2 border-brutal-ink bg-brutal-secondary opacity-30" />
        <div className="absolute right-12 top-12 sm:right-16 sm:top-16 h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-brutal-ink bg-brutal-primary opacity-20" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-4xl flex-1">
            <p className="text-tiny font-bold uppercase tracking-brutal text-brutal-muted">
              Today
            </p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brutal-ink leading-tight">
              Welcome {" "}
              <span className="text-brutal-primary line-clamp-1 block sm:inline">{session?.user?.name || "Explorer"}</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-bold text-brutal-muted md:text-base lg:text-lg">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 md:w-auto">
            <div className="rounded-md border-2 border-brutal-ink bg-brutal-secondary p-3 sm:p-5 text-center shadow-brutal min-w-[100px] sm:min-w-[140px]">
              {loading ? (
                <div className="h-8 w-12 mx-auto animate-pulse rounded-sm bg-brutal-ink/20" />
              ) : (
                <span className="block text-2xl sm:text-3xl font-black text-brutal-ink">{totalActiveTasks}</span>
              )}
              <span className="text-tiny font-bold uppercase tracking-brutal text-brutal-ink/70">
                Active tasks
              </span>
            </div>
            <div className="rounded-md border-2 border-brutal-ink bg-brutal-primary p-3 sm:p-5 text-center shadow-brutal min-w-[100px] sm:min-w-[140px]">
              {loading ? (
                <div className="h-8 w-12 mx-auto animate-pulse rounded-sm bg-brutal-paper/20" />
              ) : (
                <span className="block text-2xl sm:text-3xl font-black text-brutal-paper">
                  {likedTracks.length}
                </span>
              )}
              <span className="text-tiny font-bold uppercase tracking-brutal text-brutal-paper/80">
                Saved tracks
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 sm:gap-10 min-h-0">
        {/* Tasks Section */}
        <motion.section 
          variants={sectionVariants} 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="lg:flex-1 flex flex-col space-y-4 sm:space-y-6 min-h-0"
        >
          <div className="flex items-center justify-between border-b-2 border-brutal-ink pb-3 sm:pb-4 shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="text-brutal-secondary size-5 sm:size-6 md:size-7" />
              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black tracking-tight text-brutal-ink whitespace-nowrap">
                Priority{" "}
                <span className="text-brutal-primary">tasks</span>
              </h2>
            </div>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1 rounded-md border-2 border-brutal-ink bg-brutal-secondary px-3 sm:px-4 py-1.5 sm:py-2 text-tiny sm:text-xs font-bold text-brutal-ink shadow-brutal-sm transition-all hover:shadow-brutal hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col gap-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 sm:h-24 shrink-0 animate-pulse rounded-md border-2 border-brutal-ink/20 bg-brutal-paper" />
                  ))}
                </motion.div>
              ) : tasks.length > 0 ? (
                <motion.div 
                  key="tasks"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {tasks.map((task) => (
                    <Link
                      key={task.id}
                      href="/tasks"
                      className="min-h-[5rem] sm:min-h-[6rem] group flex items-center justify-between gap-3 sm:gap-4 rounded-md border-2 border-brutal-ink bg-brutal-paper p-4 sm:p-5 shadow-brutal transition-all hover:shadow-brutal-primary hover:border-brutal-primary hover:-translate-x-px hover:-translate-y-px hover:rotate-1"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-md border-2 border-brutal-ink bg-brutal-secondary font-black text-brutal-ink transition-colors group-hover:bg-brutal-primary group-hover:text-brutal-paper text-sm sm:text-base">
                          {task.title.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="mb-0.5 sm:mb-1 line-clamp-2 text-sm sm:text-base font-bold text-brutal-ink leading-tight">
                            {task.title}
                          </p>
                          <span className="rounded-sm border border-brutal-ink/30 bg-brutal-parchment px-1.5 sm:px-2 py-0.5 text-tiny sm:text-tiny font-bold uppercase tracking-brutal text-brutal-muted">
                            {task.category}
                          </span>
                        </div>
                      </div>
                      <ArrowRight
                        className="shrink-0 text-brutal-ink/50 transition-all group-hover:text-brutal-primary group-hover:translate-x-1 sm:size-5"
                        size={18}
                      />
                    </Link>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col gap-4"
                >
                  <div className="flex-1 flex items-center justify-center rounded-md border-2 border-dashed border-brutal-ink/30 bg-brutal-paper text-center p-6 sm:p-8">
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-brutal text-brutal-muted">
                      All clear. No tasks pending.
                    </p>
                  </div>
                  <Link
                    href="/tasks"
                    className="group flex min-h-[50px] sm:min-h-[60px] items-center justify-center rounded-md border-2 border-dashed border-brutal-ink/30 text-center transition-all hover:border-brutal-primary hover:bg-brutal-paper p-3 sm:p-4 shrink-0"
                  >
                    <span className="text-tiny sm:text-xs font-bold uppercase tracking-brutal text-brutal-muted group-hover:text-brutal-primary">
                      + Create a new task
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Music Section */}
        <motion.section 
          variants={sectionVariants} 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="lg:flex-1 flex flex-col space-y-4 sm:space-y-6 min-h-0"
        >
          <div className="flex items-center justify-between border-b-2 border-brutal-ink pb-3 sm:pb-4 shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <Heart className="text-brutal-accent size-5 sm:size-6 md:size-7" fill="currentColor" />
              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black tracking-tight text-brutal-ink whitespace-nowrap">
                Favorite{" "}
                <span className="text-brutal-primary">tracks</span>
              </h2>
            </div>
            <Link
              href="/musics"
              className="inline-flex items-center gap-1 rounded-md border-2 border-brutal-ink bg-brutal-paper px-3 sm:px-4 py-1.5 sm:py-2 text-tiny sm:text-xs font-bold text-brutal-ink shadow-brutal-sm transition-all hover:shadow-brutal hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
            >
              Browse <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {likedTracks.length > 0 ? (
                <motion.div 
                key="music-list"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 py-1 sm:py-2"
                >
                  {likedTracks.slice(0, 6).map((track) => (
                    <div
                      key={track.id}
                      className="group flex flex-col rounded-md border-2 border-brutal-ink bg-brutal-paper p-2 shadow-brutal transition-all hover:shadow-brutal-primary hover:border-brutal-primary hover:-translate-x-px hover:-translate-y-px hover:-rotate-1"
                    >
                      <div className="relative mb-2 aspect-square overflow-hidden rounded-sm border-2 border-brutal-ink">
                        <Image
                          src={track.thumbnail || "/images/no_image.png"}
                          alt={track.title}
                          fill
                          unoptimized={track.thumbnail?.includes("ytimg.com")}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                        <button
                          onClick={() => playTrack(track)}
                          className="absolute inset-0 flex items-center justify-center bg-brutal-primary/40 opacity-0 transition-all group-hover:opacity-100"
                        >
                          <div className="rounded-full border-2 border-brutal-paper bg-brutal-paper p-1.5 sm:p-2 shadow-brutal-sm">
                            <Play fill="currentColor" size={14} className="sm:size-4 text-brutal-ink ml-0.5" />
                          </div>
                        </button>
                      </div>
                      <p className="mb-0.5 line-clamp-2 text-tiny sm:text-[11px] font-bold leading-tight text-brutal-ink">
                        {track.title}
                      </p>
                      <p className="line-clamp-1 text-tiny sm:text-tiny font-bold uppercase tracking-brutal text-brutal-primary">
                        {track.artist}
                      </p>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="no-music"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-brutal-ink/30 bg-brutal-paper text-center p-6 sm:p-8"
                >
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-brutal text-brutal-muted">
                    No tracks saved yet.
                  </p>
                  <Link
                    href="/musics"
                    className="mt-3 sm:mt-4 inline-flex items-center gap-1 rounded-md border-2 border-brutal-ink bg-brutal-primary px-3 sm:px-4 py-1.5 sm:py-2 text-tiny sm:text-xs font-bold text-brutal-paper shadow-brutal-sm"
                  >
                    Explore music
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      <MusicSpacer />
    </motion.div>
  );
};

export default Home;