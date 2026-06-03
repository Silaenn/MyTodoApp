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
      <footer className="bg-black fixed bottom-0 left-0 md:left-64 w-full md:w-[calc(100%-256px)] flex items-center justify-between border-t-4 border-white px-4 sm:px-8 py-4 z-50">
        <div className="flex items-center gap-3 sm:gap-4 w-[30%]">
          <div className="border-2 border-white shadow-[2px_2px_0px_#ffffff] sm:shadow-[4px_4px_0px_#ffffff] flex-shrink-0">
            <img
              className={`w-12 h-12 sm:w-16 sm:h-16 transition-all duration-300 ${isPlaying ? 'grayscale-0' : 'grayscale'}`}
              src={currentTrack.thumbnail || "/images/BG-3.jpg"}
              alt={currentTrack.title}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black uppercase italic tracking-tighter text-sm sm:text-lg leading-none truncate">
              {currentTrack.title}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[var(--accent-pink)] uppercase tracking-widest mt-1 truncate">
              {currentTrack.artist}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 px-4">
          <div className="flex items-center gap-4 sm:gap-8">
            <button className="hidden sm:block text-white hover:text-[var(--accent-neon)] transition-colors">
              <Shuffle size={20} />
            </button>
            <button className="text-white hover:text-[var(--accent-neon)] transition-colors">
              <SkipBack size={24} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center bg-[var(--accent-neon)] border-2 border-white text-black shadow-[3px_3px_0px_#ffffff] sm:shadow-[4px_4px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-white hover:text-[var(--accent-neon)] transition-colors">
              <SkipForward size={24} fill="currentColor" />
            </button>
            <Repeat1 className="hidden sm:block cursor-pointer text-white hover:text-[var(--accent-neon)]" size={24} />
          </div>
          
          <div className="hidden sm:flex items-center gap-4 w-full max-w-[500px]">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{formatTime(progress)}</span>
            <div className="h-2 flex-1 border-2 border-white bg-[#121212] relative cursor-pointer" 
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const percent = (e.clientX - rect.left) / rect.width;
                   if (audioRef.current) audioRef.current.currentTime = percent * duration;
                 }}>
              <div 
                className="absolute top-0 left-0 h-full bg-[var(--accent-neon)]" 
                style={{ width: `${(progress / duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 w-[30%] justify-end">
          <button className="text-white hover:text-[var(--accent-pink)] transition-colors">
            <ListMusic size={20} />
          </button>
          <div className="flex items-center gap-3">
            <Volume2 size={20} className="text-white" />
            <div className="h-2 w-24 border-2 border-white bg-[#121212] relative">
              <div className="absolute top-0 left-0 h-full w-[70%] bg-[var(--accent-pink)]"></div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
