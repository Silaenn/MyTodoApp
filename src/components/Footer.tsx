"use client";

import React, { useRef, useEffect, useState } from "react";
import { Repeat1, Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, ListMusic } from "lucide-react";
import Image from "next/image";
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
      <footer className="bg-black fixed bottom-0 left-0 md:left-64 w-full md:w-[calc(100%-256px)] flex items-center justify-between border-t-8 border-white px-4 sm:px-10 py-6 z-50 shadow-[0_-8px_0_0_#000]">
        <div className="flex items-center gap-4 sm:gap-6 w-[35%]">
          <div className="border-4 border-white shadow-brutal flex-shrink-0 rotate-3 group-hover:rotate-0 transition-transform">
            <img
              className={`w-14 h-14 sm:w-20 sm:h-20 transition-all duration-500 object-cover ${isPlaying ? 'grayscale-0 animate-[vibrate_5s_linear_infinite]' : 'grayscale opacity-50'}`}
              src={currentTrack.thumbnail || "/images/BG-3.jpg"}
              alt={currentTrack.title}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black uppercase italic tracking-tighter text-lg sm:text-2xl leading-none truncate mb-1">
              {currentTrack.title}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-brutal-pink animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-black text-brutal-pink uppercase tracking-[0.2em] truncate">
                {currentTrack.artist}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3 sm:gap-4 flex-1 px-4">
          <div className="flex items-center gap-6 sm:gap-10">
            <button className="hidden sm:block text-white hover:text-brutal-neon transition-all hover:scale-125">
              <Shuffle size={24} />
            </button>
            <button className="text-white hover:text-brutal-neon transition-all hover:-translate-x-1">
              <SkipBack size={32} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className={`flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center border-4 border-white text-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ${
                isPlaying ? "bg-brutal-yellow" : "bg-brutal-neon"
              }`}
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
            </button>
            <button className="text-white hover:text-brutal-neon transition-all hover:translate-x-1">
              <SkipForward size={32} fill="currentColor" />
            </button>
            <button className="hidden sm:block text-white hover:text-brutal-neon transition-all hover:scale-125">
              <Repeat1 size={24} />
            </button>
          </div>
          
          <div className="hidden sm:flex items-center gap-6 w-full max-w-[600px]">
            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest tabular-nums">{formatTime(progress)}</span>
            <div className="h-4 flex-1 border-4 border-white bg-brutal-gray relative cursor-pointer overflow-hidden" 
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const percent = (e.clientX - rect.left) / rect.width;
                   if (audioRef.current) audioRef.current.currentTime = percent * duration;
                 }}>
              <div 
                className="absolute top-0 left-0 h-full bg-brutal-neon border-r-4 border-white" 
                style={{ width: `${(progress / duration) * 100}%` }}
              >
                <div className="absolute top-0 right-0 w-full h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 w-[35%] justify-end">
          <button className="text-white hover:text-brutal-pink transition-all hover:rotate-12">
            <ListMusic size={28} />
          </button>
          <div className="flex items-center gap-4">
            <Volume2 size={24} className="text-white" />
            <div className="h-4 w-32 border-4 border-white bg-brutal-gray relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-[70%] bg-brutal-pink border-r-4 border-white"></div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
