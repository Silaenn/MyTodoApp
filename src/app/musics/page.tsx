"use client";

import React, { useState } from "react";
import { Search, Music2, Play, Heart } from "lucide-react";
import { useMusicStore } from "@/lib/music-store";

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  duration?: number;
}

const Musics = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { playTrack, toggleLike, isLiked, likedTracks } = useMusicStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const TrackCard = ({ track, compact = false }: { track: SearchResult; compact?: boolean }) => (
    <div className={`brutal-card group flex flex-col overflow-hidden ${compact ? "p-3" : "p-4"}`}>
      <div className="relative aspect-square overflow-hidden rounded-sm border-2 border-[#0F1A0F]">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-[#0F1A0F]/40 opacity-0 transition-all group-hover:opacity-100">
          <button
            onClick={() => playTrack(track, compact ? likedTracks : results)}
            className="rounded-sm border-2 border-[#F5F8F4] bg-[#F5F8F4] p-3 text-[#0F1A0F] shadow-[2px_2px_0px_#0F1A0F] transition-all hover:scale-105"
          >
            <Play className="fill-current" size={22} />
          </button>
        </div>
        <button
          onClick={() => toggleLike(track)}
          className={`absolute right-2 top-2 rounded-sm border-2 border-[#0F1A0F] p-1.5 transition-all ${
            isLiked(track.id)
              ? "bg-[#8B4A2B] text-[#F5F8F4] shadow-[2px_2px_0px_#0F1A0F]"
              : "bg-[#F5F8F4] text-[#0F1A0F] hover:bg-[#D4A843]"
          }`}
        >
          <Heart size={14} fill={isLiked(track.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className="truncate text-base font-black leading-tight text-[#0F1A0F]">
          {track.title}
        </h3>
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.25em] text-[#3B6B4A]">
          {track.artist}
        </p>
      </div>

      <button
        onClick={() => playTrack(track, compact ? likedTracks : results)}
        className="mt-3 w-full brutal-btn brutal-btn-secondary py-2 text-xs"
      >
        Play track
      </button>
    </div>
  );

  return (
    <div className="w-full pb-32">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] p-6 shadow-[4px_4px_0px_#0F1A0F]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#5A6E5A]">
              Music search
            </p>
            <h1 className="mt-2 text-5xl font-black tracking-tight text-[#0F1A0F]">
              Vibe <span className="text-[#3B6B4A]">discovery</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 rounded-md border-2 border-[#0F1A0F] bg-[#E8EDE6] p-4 shadow-[3px_3px_0px_#0F1A0F]">
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
              className="brutal-input pl-12"
            />
          </div>
          <button
            type="submit"
            className="brutal-btn brutal-btn-primary px-8"
          >
            Search
          </button>
        </form>
      </div>

      {/* Liked Playlist */}
      {likedTracks.length > 0 && !query && (
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-4 border-b-2 border-[#0F1A0F] pb-4">
            <div className="h-8 w-8 rounded-sm border-2 border-[#0F1A0F] bg-[#3B6B4A] shadow-[2px_2px_0px_#0F1A0F]" />
            <h2 className="text-2xl font-black tracking-tight text-[#0F1A0F]">
              Liked <span className="text-[#3B6B4A]">playlist</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
            {likedTracks.map((track) => (
              <TrackCard key={track.id} track={track} compact />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-6 h-[calc(100vh-380px)]">
          <div className="h-14 w-14 animate-spin rounded-sm border-4 border-[#0F1A0F] border-t-[#3B6B4A]" />
          <p className="text-2xl font-black tracking-tight text-[#0F1A0F]">
            Scanning frequencies...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.length > 0 ? (
            results.map((m) => <TrackCard key={m.id} track={m} />)
          ) : query && !loading ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-[#0F1A0F]/30 bg-[#F5F8F4] text-center min-h-[calc(100vh-280px)]">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#5A6E5A]">
                No matches found.
              </p>
            </div>
          ) : !likedTracks.length ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-[#0F1A0F]/30 bg-[#F5F8F4] min-h-[calc(100vh-280px)]">
              <Music2 size={80} className="mb-6 text-[#0F1A0F]/20" />
              <p className="text-3xl font-black tracking-tight text-[#0F1A0F]">
                Search to discover music
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Musics;