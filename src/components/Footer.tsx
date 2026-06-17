"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Repeat1, Repeat, Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, X, ChevronDown } from "lucide-react";
import { useMusicStore } from "@/lib/music-store";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { 
    currentTrack, isPlaying, streamUrl, setIsPlaying, 
    nextTrack, prevTrack, shuffle, toggleShuffle, 
    repeat, toggleRepeat, volume, setVolume, stopMusic,
    isLoading 
  } = useMusicStore();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Lock scroll when drawer is expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  useEffect(() => {
    if (audioRef.current) {
      // Always sync volume before playing
      audioRef.current.volume = volume;
      
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, streamUrl, volume]);

  // Force stop audio when loading new track without triggering "not suitable" error
  useEffect(() => {
    if (isLoading && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isLoading]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    if (repeat === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      nextTrack();
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={streamUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-[90] bg-brutal-ink/60 backdrop-blur-sm sm:hidden"
            />
            
            {/* Bottom Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col bg-brutal-paper p-6 sm:hidden rounded-t-[32px] border-t-4 border-brutal-ink h-[90dvh] shadow-[0_-10px_40px_rgba(15,26,15,0.3)]"
            >
              {/* Handle Bar */}
              <div className="w-12 h-1.5 bg-brutal-ink/20 rounded-full self-center mb-6 shrink-0" />

              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-4 shrink-0">
                <button onClick={() => setIsExpanded(false)} className="p-2 border-2 border-brutal-ink rounded-sm bg-white shadow-brutal-sm">
                  <ChevronDown size={20} />
                </button>
                <span className="font-black text-tiny uppercase tracking-brutal text-brutal-muted">Now Playing</span>
                <button onClick={() => { stopMusic(); setIsExpanded(false); }} className="p-2 border-2 border-brutal-ink rounded-sm bg-brutal-accent text-white shadow-brutal-sm">
                  <X size={18} />
                </button>
              </div>

              {/* Album Art & Info (Flexible Container) */}
              <div className="flex-1 flex flex-col items-center justify-around min-h-0 py-4">
                {/* Album Art Container */}
                <div className={`relative aspect-square w-[75vw] max-w-[320px] rounded-md border-4 border-brutal-ink shadow-brutal overflow-hidden flex-shrink min-h-0 ${isLoading ? "animate-pulse" : ""}`}>
                  <Image src={currentTrack.thumbnail || "/images/no_image.png"} alt="" fill unoptimized={currentTrack.thumbnail?.includes("ytimg.com")} className={`object-cover ${isLoading ? "grayscale opacity-50" : ""}`} />
                </div>
                
                <div className="w-full flex flex-col gap-6">
                  {/* Title & Artist */}
                  <div className="text-center space-y-2 w-full px-4">
                    <h2 className={`text-2xl font-black text-brutal-ink line-clamp-2 leading-tight ${isLoading ? "opacity-50" : ""}`}>{currentTrack.title}</h2>
                    <p className="text-sm font-bold text-brutal-primary uppercase tracking-brutal">{isLoading ? "Loading Stream..." : currentTrack.artist}</p>
                  </div>

                  {/* Main Playback Controls */}
                  <div className="flex items-center justify-between w-full px-4 py-2">
                    <button onClick={toggleShuffle} className={shuffle ? "text-brutal-primary" : "text-brutal-muted"}>
                      <Shuffle size={20} className={shuffle ? "stroke-[3px]" : ""} />
                    </button>
                    <div className="flex items-center gap-6">
                      <button onClick={prevTrack} className="text-brutal-ink"><SkipBack size={28} fill="currentColor" /></button>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-brutal-ink bg-brutal-primary text-brutal-paper shadow-brutal"
                      >
                        {isLoading
                          ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          : isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />
                        }
                      </button>
                      <button onClick={nextTrack} className="text-brutal-ink"><SkipForward size={28} fill="currentColor" /></button>
                    </div>
                    <button onClick={toggleRepeat} className={repeat !== "none" ? "text-brutal-primary" : "text-brutal-muted"}>
                      {repeat === "one" ? <Repeat1 size={20} className="stroke-[3px]" /> : <Repeat size={20} className={repeat === "all" ? "stroke-[3px]" : ""} />}
                    </button>
                  </div>

                  {/* Progress & Volume */}
                  <div className="w-full space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-brutal-parchment border-2 border-brutal-ink rounded-sm relative overflow-hidden">
                        {isLoading ? (
                          <div className="h-full w-full relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-brutal-primary/40 to-transparent" />
                          </div>
                        ) : (
                          <div className="h-full bg-brutal-primary" style={{ width: `${(progress / (duration || 1)) * 100}%` }} />
                        )}
                        <input
                          type="range" min={0} max={duration || 0} value={progress}
                          onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = parseFloat(e.target.value); }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between text-tiny font-black text-brutal-muted tabular-nums">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Volume Slider */}
                    <div className="flex items-center gap-3 bg-brutal-parchment p-3 rounded-md border-2 border-brutal-ink shadow-brutal-sm">
                      <Volume2 size={18} className="text-brutal-ink" />
                      <div className="relative flex-1 h-1.5 bg-white border border-brutal-ink rounded-full overflow-hidden">
                        <input
                          type="range" min={0} max={1} step={0.01} value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full bg-brutal-secondary" style={{ width: `${volume * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 left-4 right-4 z-50 flex flex-col rounded-md border-2 border-brutal-ink bg-brutal-paper shadow-brutal-lg md:bottom-8 md:left-[7rem] lg:left-[20rem] md:right-8 sm:left-6 sm:right-6 overflow-hidden">
        {/* Progress Bar - Always on top */}
        <div className="h-1.5 w-full bg-brutal-parchment relative cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const clickedValue = (x / rect.width) * duration;
            if (audioRef.current) audioRef.current.currentTime = clickedValue;
          }}
        >
          {isLoading ? (
            <div className="h-full w-full relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-brutal-primary/40 to-transparent" />
            </div>
          ) : (
            <div
              className="h-full bg-brutal-primary transition-all duration-100"
              style={{ width: `${(progress / (duration || 1)) * 100}%` }}
            />
          )}
        </div>

        {/* --- MOBILE LAYOUT (< 640px) --- */}
        <div className="flex sm:hidden items-center justify-between px-3 py-2.5 gap-2">
          <div 
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
          >
             <div className={`flex-shrink-0 w-10 h-10 rounded-sm border-2 border-brutal-ink shadow-brutal-sm relative overflow-hidden ${isLoading ? "animate-pulse" : ""}`}>
                <Image src={currentTrack.thumbnail || "/images/no_image.png"} alt="" fill unoptimized={currentTrack.thumbnail?.includes("ytimg.com")} className={`object-cover ${isLoading ? "grayscale opacity-50" : ""}`} />
             </div>
             <div className="flex flex-col min-w-0">
                <span className={`font-black text-sm truncate text-brutal-ink ${isLoading ? "opacity-50" : ""}`}>{currentTrack.title}</span>
                <span className="text-tiny font-bold text-brutal-muted uppercase truncate">{isLoading ? "Loading..." : currentTrack.artist}</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-md border-2 border-brutal-ink bg-brutal-primary text-brutal-paper shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
            >
               {isLoading 
                ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                : isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />
               }
            </button>
            <button 
              onClick={stopMusic}
              className="flex h-11 w-11 items-center justify-center rounded-md border-2 border-brutal-ink bg-brutal-paper text-brutal-accent shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
            >
              <X size={24} className="stroke-[3px]" />
            </button>
          </div>
        </div>

        {/* --- DESKTOP LAYOUT (>= 640px) --- */}
        <div className="hidden sm:flex items-center justify-between px-4 py-4 gap-4">
          {/* Left: Info */}
          <div className="flex items-center gap-4 w-[30%] min-w-0">
            <div className={`flex-shrink-0 w-16 h-16 rounded-sm border-2 border-brutal-ink shadow-brutal relative overflow-hidden ${isLoading ? "animate-pulse" : ""}`}>
              <Image src={currentTrack.thumbnail || "/images/no_image.png"} alt="" fill unoptimized={currentTrack.thumbnail?.includes("ytimg.com")} className={`object-cover ${isLoading ? "grayscale opacity-50" : ""}`} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`font-black text-lg truncate text-brutal-ink leading-tight ${isLoading ? "opacity-50" : ""}`}>{currentTrack.title}</span>
              <span className="text-xs font-bold text-brutal-muted uppercase tracking-brutal truncate">{isLoading ? "Loading Stream..." : currentTrack.artist}</span>
            </div>
          </div>

          {/* Center: Controls */}
          <div className="flex flex-col items-center flex-1 gap-1">
            <div className="flex items-center gap-6">
              <button onClick={toggleShuffle} className={shuffle ? "text-brutal-primary" : "text-brutal-muted"}>
                <Shuffle size={20} className={shuffle ? "stroke-[3px]" : ""} />
              </button>
              <button onClick={prevTrack} className="text-brutal-ink"><SkipBack size={24} fill="currentColor" /></button>
              <button
                onClick={togglePlay}
                className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-brutal-ink bg-brutal-primary text-brutal-paper shadow-brutal hover:-translate-y-0.5 transition-transform"
              >
                {isLoading 
                  ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  : isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />
                }
              </button>
              <button onClick={nextTrack} className="text-brutal-ink"><SkipForward size={24} fill="currentColor" /></button>
              <button onClick={toggleRepeat} className={repeat !== "none" ? "text-brutal-primary" : "text-brutal-muted"}>
                {repeat === "one" ? <Repeat1 size={20} className="stroke-[3px]" /> : <Repeat size={20} className={repeat === "all" ? "stroke-[3px]" : ""} />}
              </button>
            </div>
            <span className="mt-2 text-tiny font-bold text-brutal-muted tabular-nums">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right: Utils */}
          <div className="flex items-center gap-4 w-[30%] justify-end">
            <div className="flex items-center gap-3 w-32 group">
              <Volume2 size={20} className="text-brutal-muted" />
              <div className="relative flex-1 h-2 bg-brutal-parchment border border-brutal-ink rounded-full overflow-hidden">
                <input
                  type="range" min={0} max={1} step={0.01} value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full bg-brutal-secondary" style={{ width: `${volume * 100}%` }} />
              </div>
            </div>
            <button 
              onClick={stopMusic}
              className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-brutal-ink bg-brutal-paper shadow-brutal-sm hover:bg-brutal-accent hover:text-white transition-colors"
            >
              <X size={20} className="stroke-[3px]" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;