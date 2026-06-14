"use client";

import { useMusicStore } from "@/lib/music-store";

export const MusicSpacer = () => {
  const { currentTrack } = useMusicStore();
  return (
    <div className={`transition-all duration-300 shrink-0 ${currentTrack ? "h-24 sm:h-32" : "h-0"}`} />
  );
};
