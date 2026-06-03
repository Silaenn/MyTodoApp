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
        onEnded={() => setIsPlaying(false)}
      />

      <footer className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] px-4 py-4 shadow-[6px_6px_0px_#1A1208] md:bottom-6 md:left-[18rem] md:right-6">

        {/* Track Info */}
        <div className="flex items-center gap-4 sm:gap-6 w-[35%]">
          <div className="flex-shrink-0 overflow-hidden rounded-sm border-2 border-[#1A1208] shadow-[3px_3px_0px_#1A1208]">
            <img
              className={`w-14 h-14 sm:w-16 sm:h-16 object-cover transition-all duration-500 ${
                isPlaying ? "grayscale-0 scale-105" : "grayscale opacity-60"
              }`}
              src={currentTrack.thumbnail || "/images/BG-3.jpg"}
              alt={currentTrack.title}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black tracking-tight text-base sm:text-lg leading-none truncate mb-1 text-[#1A1208]">
              {currentTrack.title}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#C75B2D] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-[#C75B2D] uppercase tracking-[0.2em] truncate">
                {currentTrack.artist}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 flex-1 px-4">
          <div className="flex items-center gap-6 sm:gap-8">
            <button className="hidden sm:block text-[#6B5744] hover:text-[#C75B2D] transition-colors">
              <Shuffle size={22} />
            </button>
            <button className="text-[#1A1208] hover:text-[#C75B2D] transition-colors hover:-translate-x-0.5">
              <SkipBack size={28} fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className={`flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-md border-2 border-[#1A1208] font-black shadow-[3px_3px_0px_#1A1208] transition-all hover:shadow-[5px_5px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px active:shadow-[1px_1px_0px_#1A1208] active:translate-x-0.5 active:translate-y-0.5 ${
                isPlaying
                  ? "bg-[#E8A838] text-[#1A1208]"
                  : "bg-[#C75B2D] text-[#FDFAF4]"
              }`}
            >
              {isPlaying
                ? <Pause size={24} fill="currentColor" />
                : <Play size={24} fill="currentColor" className="ml-0.5" />
              }
            </button>
            <button className="text-[#1A1208] hover:text-[#C75B2D] transition-colors hover:translate-x-0.5">
              <SkipForward size={28} fill="currentColor" />
            </button>
            <button className="hidden sm:block text-[#6B5744] hover:text-[#C75B2D] transition-colors">
              <Repeat1 size={22} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="hidden sm:flex items-center gap-4 w-full max-w-[600px]">
            <span className="text-[10px] font-bold text-[#6B5744] uppercase tracking-widest tabular-nums">
              {formatTime(progress)}
            </span>
            <div
              className="h-3 flex-1 rounded-sm border-2 border-[#1A1208] bg-[#F5ECD7] relative cursor-pointer overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                if (audioRef.current) audioRef.current.currentTime = percent * duration;
              }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-[#C75B2D] transition-all"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-[#6B5744] uppercase tracking-widest tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden lg:flex items-center gap-6 w-[35%] justify-end">
          <button className="text-[#6B5744] hover:text-[#C75B2D] transition-colors">
            <ListMusic size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Volume2 size={22} className="text-[#6B5744]" />
            <div className="h-3 w-28 rounded-sm border-2 border-[#1A1208] bg-[#F5ECD7] relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-[70%] bg-[#E8A838]" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;