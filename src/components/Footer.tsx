"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Repeat1, Repeat, Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, X } from "lucide-react";
import { useMusicStore } from "@/lib/music-store";

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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

      <footer className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] px-4 py-4 shadow-brutal-lg md:bottom-8 md:left-[7rem] lg:left-[20rem] md:right-8 sm:left-6 sm:right-6">
        {/* Close Button - Top Right Corner */}
        <button 
          onClick={stopMusic}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-sm border-2 border-[#0F1A0F] bg-[#F5F8F4] shadow-brutal-sm transition-all hover:bg-[#FF0000] hover:text-[#F5F8F4] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 z-[60]"
          title="Close Player"
        >
          <X size={18} className="stroke-[3px]" />
        </button>

        {/* Track Info */}
        <div className="flex items-center gap-2 sm:gap-6 w-[40%] md:w-[35%] lg:w-[30%]">
          <div className={`flex-shrink-0 overflow-hidden rounded-sm border-2 border-brutal-ink shadow-brutal-sm relative w-12 h-12 sm:w-16 sm:h-16 ${isLoading ? "animate-pulse" : ""}`}>
            <Image
              className={`object-cover transition-all duration-500 ${
                isPlaying && !isLoading ? "grayscale-0 scale-105" : "grayscale opacity-60"
              }`}
              src={currentTrack.thumbnail || "/images/no_image.png"}
              alt={currentTrack.title}
              fill
              sizes="64px"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`font-black tracking-tight text-base sm:text-lg leading-none truncate mb-1 text-brutal-ink ${isLoading ? "opacity-50" : ""}`}>
              {currentTrack.title}
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 bg-brutal-primary ${isPlaying ? "animate-pulse" : ""}`} />
              <span className="text-[10px] sm:text-xs font-bold text-brutal-primary uppercase tracking-brutal truncate">
                {isLoading ? "Loading Stream..." : currentTrack.artist}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 flex-1 px-2 sm:px-4 min-w-0">
          <div className="flex items-center gap-4 sm:gap-8 shrink-0">
            <button 
              onClick={toggleShuffle}
              className={`hidden sm:block transition-colors ${shuffle ? "text-brutal-primary" : "text-brutal-muted hover:text-brutal-primary"}`}
            >
              <Shuffle size={22} className={shuffle ? "stroke-[3px]" : ""} />
            </button>
            <button 
              onClick={prevTrack}
              className="text-brutal-ink hover:text-brutal-primary transition-colors hover:-translate-x-0.5"
            >
              <SkipBack size={28} fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className={`flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-md border-2 border-brutal-ink font-black shadow-brutal transition-all hover:shadow-brutal-lg hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
                isPlaying
                  ? "bg-brutal-secondary text-brutal-ink"
                  : "bg-brutal-primary text-brutal-paper"
              }`}
            >
               {isLoading
                  ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  : isPlaying
                    ? <Pause size={24} fill="currentColor" />
                    : <Play size={24} fill="currentColor" className="ml-0.5" />
                }
            </button>
            <button 
              onClick={nextTrack}
              className="text-brutal-ink hover:text-brutal-primary transition-colors hover:translate-x-0.5"
            >
              <SkipForward size={28} fill="currentColor" />
            </button>
            <button 
              onClick={toggleRepeat}
              className={`hidden sm:block transition-colors ${repeat !== "none" ? "text-brutal-primary" : "text-brutal-muted hover:text-brutal-primary"}`}
            >
              {repeat === "one" ? <Repeat1 size={22} className="stroke-[3px]" /> : <Repeat size={22} className={repeat === "all" ? "stroke-[3px]" : ""} />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="hidden sm:flex items-center gap-4 w-full max-w-[600px]">
            <span className="text-[10px] font-bold text-brutal-muted uppercase tracking-widest tabular-nums">
              {formatTime(progress)}
            </span>
            <div className="relative flex-1 h-3 group">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={progress}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (audioRef.current) audioRef.current.currentTime = val;
                  setProgress(val);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="h-full w-full rounded-sm border-2 border-brutal-ink bg-brutal-parchment overflow-hidden">
                {isLoading
                  ? // Shimmer effect
                    <div className="h-full w-full relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#3B6B4A]/40 to-transparent" />
                    </div>
                  : // Progress bar normal
                    <div
                      className="h-full bg-brutal-primary transition-all duration-100"
                      style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                    />
                }
              </div>
            </div>
            <span className="text-[10px] font-bold text-brutal-muted uppercase tracking-widest tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 sm:gap-6 w-[30%] justify-end">
          <div className="flex items-center gap-2 sm:gap-3 group relative h-3 w-16 sm:w-28">
            <Volume2 size={20} className="text-brutal-muted shrink-0" />
            <div className="relative flex-1 h-full">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="h-full w-full rounded-sm border-2 border-brutal-ink bg-brutal-parchment overflow-hidden">
                <div 
                  className="h-full bg-brutal-secondary transition-all" 
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;