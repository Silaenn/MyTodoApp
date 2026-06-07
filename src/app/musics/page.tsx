"use client";

import React, { useState, useEffect } from "react";
import { Search, Play, Heart, Disc } from "lucide-react";
import { useMusicStore } from "@/lib/music-store";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  duration?: number;
}

// Animation Variants
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.99 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const Musics = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recommendations, setRecommendations] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchExecuted, setSearchExecuted] = useState(false);
  
  // Extract state from music store
  const { playTrack, toggleLike, isLiked, likedTracks, currentTrack } = useMusicStore();

  const fetchRecommendations = async () => {
    const randomKeywords = ["lofi chill", "trending music 2024", "aesthetic vibes", "indie gems", "gaming beats"];
    const randomSearch = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
    
    try {
      const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(randomSearch)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setRecommendations(data);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setSearchExecuted(false);
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
      setSearchExecuted(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // If user clears the input, we show recommendations again
  useEffect(() => {
    if (query === "") {
      setSearchExecuted(false);
      setResults([]);
    }
  }, [query]);

  const TrackCard = ({ track, compact = false, list }: { track: SearchResult; compact?: boolean, list: SearchResult[] }) => (
    <div className={`brutal-card group flex flex-col overflow-hidden ${compact ? "p-2 sm:p-3" : "p-4"}`}>
      <div className="relative aspect-square overflow-hidden rounded-sm border-2 border-[#0F1A0F]">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-[#3B6B4A]/40 opacity-0 transition-all group-hover:opacity-100">
          <button
            onClick={() => playTrack(track, list)}
            className="rounded-full border-2 border-[#F5F8F4] bg-[#F5F8F4] p-3 text-[#0F1A0F] shadow-brutal-sm transition-all hover:scale-105"
          >
            <Play className="fill-current ml-0.5" size={20} />
          </button>
        </div>
        <button
          onClick={() => toggleLike(track)}
          className={`absolute right-2 top-2 rounded-sm border-2 border-[#0F1A0F] p-1.5 transition-all ${
            isLiked(track.id)
              ? "bg-[#8B4A2B] text-[#F5F8F4] shadow-brutal-sm"
              : "bg-[#F5F8F4] text-[#0F1A0F] hover:bg-[#D4A843]"
          }`}
        >
          <Heart size={12} fill={isLiked(track.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className={`truncate font-black leading-tight text-[#0F1A0F] ${compact ? "text-[11px]" : "text-base"}`}>
          {track.title}
        </h3>
        <p className={`truncate font-bold uppercase tracking-[0.2em] text-[#3B6B4A] ${compact ? "text-[8px]" : "text-[10px]"}`}>
          {track.artist}
        </p>
      </div>

      {!compact && (
        <button
          onClick={() => playTrack(track, list)}
          className="mt-3 w-full brutal-btn brutal-btn-secondary py-2 text-xs shadow-brutal-sm"
        >
          Play track
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full h-[calc(100vh-60px)] flex flex-col overflow-hidden">

      {/* Header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="mb-6 flex flex-col gap-6 rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] p-6 shadow-brutal shrink-0"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#5A6E5A]">
              Music search
            </p>
            <h1 className="mt-2 text-5xl font-black tracking-tight text-[#0F1A0F]">
              Vibe <span className="text-[#3B6B4A]">discovery</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 rounded-md border-2 border-[#0F1A0F] bg-[#E8EDE6] p-4 shadow-brutal-sm">
            <Heart size={22} fill="currentColor" className="text-[#8B4A2B]" />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#5A6E5A]">
                Favorite vault
              </span>
              <span className="text-xl font-black text-[#0F1A0F]">
                {likedTracks.length} tracks
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex w-full gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6E5A] z-10"
              size={20}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or artist..."
              className="brutal-input pl-12 shadow-brutal"
            />
          </div>
          <button
            type="submit"
            className="brutal-btn brutal-btn-primary px-8 shadow-brutal"
          >
            Search
          </button>
        </form>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {loading || (initialLoading && !recommendations.length) ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#E8EDE6] z-20"
            >
              <div className="h-14 w-14 animate-spin rounded-sm border-4 border-[#0F1A0F] border-t-[#3B6B4A]" />
              <p className="text-2xl font-black tracking-tight text-[#0F1A0F]">
                Scanning frequencies...
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="h-full overflow-y-auto custom-scrollbar overflow-x-hidden flex flex-col"
            >
              <div className="flex-1 flex flex-col">
                {/* Liked Playlist Section */}
                {likedTracks.length > 0 && !searchExecuted && (
                  <div className="mb-12 shrink-0">
                    <div className="mb-6 flex items-center gap-4 border-b-2 border-[#0F1A0F] pb-4">
                      <Heart className="text-[#8B4A2B]" size={28} fill="currentColor" />
                      <h2 className="text-2xl font-black tracking-tight text-[#0F1A0F]">
                        Liked <span className="text-[#3B6B4A]">playlist</span>
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 py-2">
                      {likedTracks.map((track) => (
                        <TrackCard key={track.id} track={track} compact list={likedTracks} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Title Section (Recommendations or Results) */}
                <div className="mb-6 flex items-center gap-4 border-b-2 border-[#0F1A0F] pb-4 shrink-0">
                  {!searchExecuted ? (
                    <>
                      <Disc className="text-[#D4A843]" size={28} />
                      <h2 className="text-2xl font-black tracking-tight text-[#0F1A0F]">
                        Weekly <span className="text-[#3B6B4A]">picks</span>
                      </h2>
                    </>
                  ) : (
                    <>
                      <Search className="text-[#3B6B4A]" size={28} />
                      <h2 className="text-2xl font-black tracking-tight text-[#0F1A0F]">
                        Search <span className="text-[#3B6B4A]">results</span>
                      </h2>
                    </>
                  )}
                </div>

                {/* Results Grid */}
                <div className="flex-1 flex flex-col py-2">
                  {(!searchExecuted ? recommendations : results).length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {(!searchExecuted ? recommendations : results).map((m) => (
                        <TrackCard key={m.id} track={m} list={!searchExecuted ? recommendations : results} />
                      ))}
                    </div>
                  ) : searchExecuted && !loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-[#0F1A0F]/30 bg-[#F5F8F4] text-center p-8">
                      <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#5A6E5A]">
                        No matches found for &quot;{query}&quot;
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
              
              {/* Dynamic Spacer */}
              <div className={`transition-all duration-300 ${currentTrack ? "h-32" : "h-0"} shrink-0`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Musics;