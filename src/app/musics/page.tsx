"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { Search, Play, Heart, Disc } from "lucide-react";
import { useMusicStore } from "@/lib/music-store";
import { MusicSpacer } from "@/components/MusicSpacer";
import { motion, AnimatePresence, Variants } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  duration?: number;
}

// Animation Variants
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const contentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.99 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Memoized TrackCard to prevent flickering
const TrackCard = memo(({ 
  track, 
  compact = false, 
  onPlay 
}: { 
  track: SearchResult; 
  compact?: boolean; 
  onPlay: (t: SearchResult) => void;
}) => {
  const toggleLike = useMusicStore((state) => state.toggleLike);
  const likedTracks = useMusicStore((state) => state.likedTracks);
  const liked = likedTracks.some((t) => t.id === track.id);

  return (
    <div className={`brutal-card group flex flex-col overflow-hidden ${compact ? "p-2 sm:p-3" : "p-3 sm:p-4"}`}>
      <div className="relative aspect-square overflow-hidden rounded-sm border-2 border-brutal-ink">
        <Image
          src={track.thumbnail || "/images/no_image.png"}
          alt={track.title}
          fill
          unoptimized={track.thumbnail?.includes("ytimg.com")}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-brutal-primary/40 sm:opacity-0 transition-all sm:group-hover:opacity-100">
          <button
            onClick={() => onPlay(track)}
            className="rounded-full border-2 border-brutal-paper bg-brutal-paper p-2.5 sm:p-3 text-brutal-ink shadow-brutal-sm transition-all hover:scale-105"
          >
            <Play className="fill-current ml-0.5 size-4 sm:size-5" />
          </button>
        </div>
        <button
          onClick={() => toggleLike(track)}
          className={`absolute right-1 top-2 sm:right-1 sm:top-2.5 rounded-sm border-2 border-brutal-ink p-1.5 transition-all ${
            liked
              ? "bg-brutal-accent text-brutal-paper shadow-brutal-sm"
              : "bg-brutal-paper text-brutal-ink hover:bg-brutal-secondary"
          }`}
          aria-label="Toggle favorite"
        >
          <Heart size={12} className="sm:size-4" fill={liked ? "currentColor" : "none"} />
        </button>
        </div>

        <div className="mt-2 sm:mt-3 flex flex-col gap-1">
        <h3 className={`line-clamp-1 font-black leading-tight text-brutal-ink ${compact ? "text-tiny sm:text-[11px]" : "text-sm sm:text-base"}`}>
          {track.title}
        </h3>
        <p className={`line-clamp-1 font-bold uppercase tracking-brutal text-brutal-primary ${compact ? "text-tiny sm:text-tiny" : "text-tiny sm:text-tiny"}`}>
          {track.artist}
        </p>
        </div>

      {!compact && (
        <button
          onClick={() => onPlay(track)}
          className="mt-2 sm:mt-3 w-full brutal-btn brutal-btn-secondary py-1.5 sm:py-2 text-tiny sm:text-xs shadow-brutal-sm"
        >
          Play track
        </button>
      )}
    </div>
  );
});

TrackCard.displayName = "TrackCard";

const Musics = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [weeklyPicks, setWeeklyPicks] = useState<SearchResult[]>([]);
  const [radioQueue, setRadioQueue] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const searchAbortControllerRef = React.useRef<AbortController | null>(null);
  
  const playTrack = useMusicStore((state) => state.playTrack);
  const likedTracks = useMusicStore((state) => state.likedTracks);

  const fetchWeeklyPicks = useCallback(async () => {
    const randomKeywords = [
      "lofi hip hop chill",
      "bedroom pop indie",
      "midnight phonk",
      "neo soul vibes",
      "dark academia music",
      "synthwave retro",
      "alt r&b english",
      "acoustic singer songwriter english",
      "chillwave dream pop",
      "jazz cafe western",
      "indie folk morning english",
      "electronic ambient chill",
      "pop punk energy",
      "city pop japanese",
      "ethereal indie pop english"
    ];
    const randomSearch = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
    
    try {
      const res = await fetch(`${BACKEND_URL}/search?q=${encodeURIComponent(randomSearch)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setWeeklyPicks(data);
      }
    } catch (error) {
      console.error("Failed to fetch picks:", error);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeeklyPicks();
  }, [fetchWeeklyPicks]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setSearchExecuted(false);
      setResults([]);
      setRadioQueue([]);
      return;
    }

    // Abort previous search if still running
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    searchAbortControllerRef.current = controller;
    
    setLoading(true);
    setRadioQueue([]); // Clear old recommendations immediately
    try {
      const res = await fetch(
        `${BACKEND_URL}/search?q=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        // Update results immediately
        setResults(data);
        setSearchExecuted(true);
        
        // Background fetch for Radio Mode WITHOUT affecting results state
        if (data.length > 0) {
          fetch(`${BACKEND_URL}/recommendations/${data[0].id}`)
            .then(r => r.json())
            .then(recData => {
              if (Array.isArray(recData)) {
                setRadioQueue(recData);
              }
            }).catch(err => {
              if (err.name !== 'AbortError') console.error("Radio fetch failed", err);
            });
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Search failed:", error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handlePlayWithRadio = useCallback((track: SearchResult) => {
    const fullQueue = [track, ...radioQueue.filter(r => r.id !== track.id)];
    playTrack(track, fullQueue);
  }, [radioQueue, playTrack]);

  const handlePlayLiked = useCallback((track: SearchResult) => {
    playTrack(track, likedTracks);
  }, [likedTracks, playTrack]);

  const handlePlayWeekly = useCallback((track: SearchResult) => {
    playTrack(track, weeklyPicks);
  }, [weeklyPicks, playTrack]);

  useEffect(() => {
    if (query === "") {
      setSearchExecuted(false);
      setResults([]);
    }
  }, [query]);

  return (
    <div className="w-full h-[calc(100vh-60px)] flex flex-col overflow-hidden">

      {/* Header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="mb-6 sm:mb-10 flex flex-col gap-4 sm:gap-6 rounded-md border-2 border-brutal-ink bg-brutal-paper p-4 sm:p-6 shadow-brutal shrink-0"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-tiny font-bold uppercase tracking-brutal text-brutal-muted">
              Music search
            </p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-brutal-ink leading-tight">
              Vibe <span className="text-brutal-primary">discovery</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 rounded-md border-2 border-brutal-ink bg-brutal-parchment p-3 sm:p-4 shadow-brutal-sm">
            <Heart size={20} fill="currentColor" className="text-brutal-accent sm:size-[22px]" />
            <div>
              <span className="block text-tiny font-bold uppercase tracking-brutal text-brutal-muted">
                Favorite vault
              </span>
              <span className="text-lg sm:text-xl font-black text-brutal-ink">
                {likedTracks.length} tracks
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex w-full gap-2 sm:gap-3 items-center">
          <div className="relative flex-1 min-w-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brutal-muted z-10 shrink-0"
              size={18}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="brutal-input pl-10 pr-4 shadow-brutal text-sm h-11 w-full"
            />
          </div>
          <button
            type="submit"
            className="brutal-btn brutal-btn-primary px-4 sm:px-6 shadow-brutal h-11 text-sm shrink-0 whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {loading || (initialLoading && !weeklyPicks.length) ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-brutal-parchment z-20"
            >
              <div className="h-14 w-14 animate-spin rounded-sm border-4 border-brutal-ink border-t-brutal-primary" />
              <p className="text-2xl font-black tracking-tight text-brutal-ink">
                Scanning frequencies...
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="h-full overflow-y-auto custom-scrollbar flex flex-col"
            >
              <div className="flex-1 flex flex-col px-2 sm:px-4 pt-2 pb-2">
                {/* Liked Playlist Section */}
                {likedTracks.length > 0 && !searchExecuted && (
                  <div className="mb-8 sm:mb-12 shrink-0">
                    <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 border-b-2 border-brutal-ink pb-3 sm:pb-4">
                      <Heart className="text-brutal-accent size-6 sm:size-7" fill="currentColor" />
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-brutal-ink">
                        Liked <span className="text-brutal-primary">playlist</span>
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 py-2">
                      {likedTracks.map((track) => (
                        <TrackCard key={track.id} track={track} compact onPlay={handlePlayLiked} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Title Section (Weekly Picks or Results) */}
                <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 border-b-2 border-brutal-ink pb-3 sm:pb-4 shrink-0">
                  {!searchExecuted ? (
                    <>
                      <Disc className="text-brutal-secondary size-6 sm:size-7" />
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-brutal-ink">
                        Weekly <span className="text-brutal-primary">picks</span>
                      </h2>
                    </>
                  ) : (
                    <>
                      <Search className="text-brutal-primary size-6 sm:size-7" />
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-brutal-ink">
                        Search <span className="text-brutal-primary">results</span>
                      </h2>
                    </>
                  )}
                </div>

                {/* Results Grid */}
                <div className="flex-1 flex flex-col py-2">
                  {(searchExecuted ? results : weeklyPicks).length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {(searchExecuted ? results : weeklyPicks).map((track) => (
                        <TrackCard 
                          key={track.id} 
                          track={track} 
                          onPlay={searchExecuted ? handlePlayWithRadio : handlePlayWeekly}
                        />
                      ))}
                    </div>
                  ) : searchExecuted && !loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-brutal-ink/30 bg-brutal-paper text-center p-8">
                      <p className="text-sm font-bold uppercase tracking-brutal text-brutal-muted">
                        No matches found for &quot;{query}&quot;
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <MusicSpacer />
    </div>
  );
};

export default Musics;
