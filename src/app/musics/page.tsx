"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="relative aspect-square overflow-hidden rounded-md border-2 border-[#1A1208]">
        <img src={track.thumbnail} alt={track.title} className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
        <div className="absolute inset-0 flex items-center justify-center bg-[#1A1208]/30 opacity-0 transition-all group-hover:opacity-100">
          <button
            onClick={() => playTrack(track)}
            className="rounded-full border-2 border-[#1A1208] bg-[#FDFAF4] p-3 text-[#1A1208] transition-transform hover:scale-105"
          >
            <Play className="fill-current" size={24} />
          </button>
        </div>
        <button
          onClick={() => toggleLike(track)}
          className={`absolute right-3 top-3 rounded-full border-2 border-[#1A1208] p-2 transition-all ${
            isLiked(track.id) ? "bg-[#C75B2D] text-[#FDFAF4]" : "bg-[#FDFAF4]/60 text-[#1A1208] hover:bg-[#FDFAF4]"
          }`}
        >
          <Heart size={16} fill={isLiked(track.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <h3 className="truncate text-lg font-bold leading-tight text-[#1A1208]">{track.title}</h3>
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.25em] text-[#C75B2D] opacity-80">{track.artist}</p>
      </div>

      <Button onClick={() => playTrack(track)} className="mt-4 w-full text-xs">
        Play track
      </Button>
    </div>
  );

  return (
    <div className="w-full pb-32">
      <div className="mb-8 flex flex-col gap-6 brutal-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#6B5744]">Music search</p>
            <h1 className="mt-2 text-5xl font-black tracking-tight text-[#1A1208]">
              Vibe <span className="text-[#C75B2D]">discovery</span>
            </h1>
          </div>

          <div className="brutal-card flex items-center gap-4 p-4">
            <Heart size={24} fill="currentColor" className="text-[#C75B2D]" />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B5744]">Favorite vault</span>
              <span className="text-xl font-black text-[#1A1208]">{likedTracks.length} tracks</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-[#6B5744]" size={22} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or artist..."
            className="h-14 pl-14 text-base"
          />
          <Button type="submit" className="absolute right-2 top-1/2 h-10 -translate-y-1/2 px-4">
            Search
          </Button>
        </form>
      </div>

      {likedTracks.length > 0 && !query && (
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-[#C75B2D]" />
            <h2 className="text-2xl font-black tracking-tight text-[#1A1208]">
              Liked <span className="text-[#C75B2D]">playlist</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 xl:grid-cols-6">
            {likedTracks.map((track) => (
              <TrackCard key={track.id} track={track} compact />
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-6 py-24">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#1A1208] border-t-[#C75B2D]" />
          <p className="text-2xl font-black tracking-tight text-[#1A1208]">Scanning frequencies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.length > 0 ? (
            results.map((m) => <TrackCard key={m.id} track={m} />)
          ) : query && !loading ? (
            <div className="col-span-full brutal-card border-dashed p-12 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6B5744]">No matches found.</p>
            </div>
          ) : !likedTracks.length ? (
            <div className="col-span-full brutal-card border-dashed py-24 text-center">
              <Music2 size={112} className="mx-auto mb-6 text-[#1A1208]/20" />
              <p className="text-3xl font-black tracking-tight text-[#1A1208]">Search to initiate vibe</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Musics;
