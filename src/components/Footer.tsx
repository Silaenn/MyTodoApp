"use client";

import React, { useRef, useEffect, useState } from "react";
import { Repeat1, Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, ListMusic } from "lucide-react";
import { useMusicStore } from "@/lib/music-store";

const Footer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentTrack, isPlaying, streamUrl, setIsPlaying } = useMusicStore();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, streamUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      <audio 
        ref={audioRef} 
        src={streamUrl || undefined} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Music Widget (Sticky Bottom) */}
      <footer className="group fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 shadow-brutal-lg backdrop-blur-xl md:bottom-6 md:left-[18rem] md:right-6">
        <div className="flex items-center gap-4 sm:gap-6 w-[35%]">
          <div className="flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-brutal transition-transform rotate-2 group-hover:rotate-0">
            <img
              className={`w-14 h-14 sm:w-16 sm:h-16 transition-all duration-500 object-cover ${isPlaying ? 'grayscale-0 scale-105' : 'grayscale opacity-60'}`}
              src={currentTrack.thumbnail || "/images/BG-3.jpg"}
              alt={currentTrack.title}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold tracking-tight text-base sm:text-xl leading-none truncate mb-1">
              {currentTrack.title}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-brutal-pink animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-semibold text-brutal-pink uppercase tracking-[0.2em] truncate">
                {currentTrack.artist}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3 sm:gap-4 flex-1 px-4">
          <div className="flex items-center gap-6 sm:gap-10">
            <button className="hidden sm:block text-white/70 hover:text-brutal-neon transition-all hover:scale-110">
              <Shuffle size={24} />
            </button>
            <button className="text-white/80 hover:text-brutal-neon transition-all hover:-translate-x-0.5">
              <SkipBack size={32} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-white/10 text-black shadow-brutal hover:translate-y-0.5 hover:shadow-none transition-all ${
                isPlaying ? "bg-brutal-yellow" : "bg-brutal-neon"
              }`}
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-white/80 hover:text-brutal-neon transition-all hover:translate-x-0.5">
              <SkipForward size={32} fill="currentColor" />
            </button>
            <button className="hidden sm:block text-white/70 hover:text-brutal-neon transition-all hover:scale-110">
              <Repeat1 size={24} />
            </button>
          </div>
          
          <div className="hidden sm:flex items-center gap-6 w-full max-w-[600px]">
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest tabular-nums">{formatTime(progress)}</span>
            <div className="h-3 flex-1 rounded-full border border-white/10 bg-white/5 relative cursor-pointer overflow-hidden" 
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const percent = (e.clientX - rect.left) / rect.width;
                   if (audioRef.current) audioRef.current.currentTime = percent * duration;
                 }}>
              <div 
                className="absolute top-0 left-0 h-full bg-brutal-neon" 
                style={{ width: `${(progress / duration) * 100}%` }}
              >
                <div className="absolute top-0 right-0 w-full h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 w-[35%] justify-end">
          <button className="text-white/70 hover:text-brutal-pink transition-all hover:rotate-6">
            <ListMusic size={28} />
          </button>
          <div className="flex items-center gap-4">
            <Volume2 size={24} className="text-white/70" />
            <div className="h-3 w-32 rounded-full border border-white/10 bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-[70%] bg-brutal-pink"></div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
