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
  duration: number;
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

  const TrackCard = ({ track, compact = false }: { track: SearchResult, compact?: boolean }) => (
    <div className={`brutal-card flex flex-col group hover:border-brutal-neon transition-all overflow-hidden ${compact ? 'p-3' : 'p-4'}`}>
      <div className="relative aspect-square border-4 border-white overflow-hidden shadow-brutal-sm group-hover:shadow-brutal transition-all">
        <img 
          src={track.thumbnail} 
          alt={track.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
        />
        <div className="absolute inset-0 bg-brutal-neon/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
          <button 
            onClick={() => playTrack(track)}
            className="bg-white p-3 border-4 border-black hover:bg-brutal-neon transition-colors"
          >
            <Play className="text-black fill-current" size={32} />
          </button>
        </div>
        <button 
          onClick={() => toggleLike(track)}
          className={`absolute top-2 right-2 p-2 border-2 border-white transition-all ${
            isLiked(track.id) ? "bg-brutal-pink text-white" : "bg-black/50 text-white hover:bg-white hover:text-black"
          }`}
        >
          <Heart size={16} fill={isLiked(track.id) ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="mt-4 flex flex-col gap-1 overflow-hidden">
        <h3 className="text-lg font-black uppercase truncate leading-tight group-hover:text-brutal-neon transition-colors">
          {track.title}
        </h3>
        <p className="text-brutal-pink text-[10px] font-black uppercase tracking-[0.2em] truncate opacity-80">
          {track.artist}
        </p>
      </div>
      
      <button 
        onClick={() => playTrack(track)}
        className="brutal-btn brutal-btn-primary mt-4 py-2 text-xs italic w-full"
      >
        ▶ ACTIVATE
      </button>
    </div>
  );

  return (
    <div className="w-full pb-32">
      <div className="flex flex-col gap-10 mb-12 border-b-8 border-white pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h1 className="text-6xl sm:text-7xl font-black uppercase tracking-tighter italic text-stroke">
            VIBE <span className="text-brutal-pink !text-white !italic">DISCOVERY</span>
          </h1>
          <div className="bg-brutal-pink border-4 border-white p-4 shadow-brutal flex items-center gap-4">
            <Heart size={24} fill="white" className="animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase">FAVORITE VAULT</span>
              <span className="text-xl font-black italic">{likedTracks.length} TRACKS</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-brutal-neon z-10 transition-colors" size={28} />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="INPUT FREQUENCY OR ARTIST ID..."
            className="pl-16 h-20 text-xl sm:text-2xl shadow-brutal-neon border-brutal-neon group-focus-within:shadow-brutal group-focus-within:border-white transition-all"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 brutal-btn brutal-btn-primary h-12 px-6">
            ENGAGE
          </button>
        </form>
      </div>

      {likedTracks.length > 0 && !query && (
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-brutal-pink border-2 border-white"></div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">LIKED <span className="text-brutal-pink">PLAYLIST</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {likedTracks.map((track) => (
              <TrackCard key={track.id} track={track} compact />
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="w-20 h-20 border-8 border-white border-t-brutal-neon animate-spin"></div>
          <p className="text-3xl font-black uppercase italic text-stroke">SCANNING FREQUENCIES...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {results.length > 0 ? (
            results.map((m) => (
              <TrackCard key={m.id} track={m} />
            ))
          ) : query && !loading ? (
            <div className="col-span-full brutal-card p-12 text-center bg-transparent border-dashed">
              <p className="text-2xl font-black text-gray-500 uppercase italic tracking-widest">ZERO MATCHES FOUND IN ARCHIVES.</p>
            </div>
          ) : !likedTracks.length && (
            <div className="col-span-full py-24 text-center opacity-20 group">
              <Music2 size={120} className="mx-auto mb-6 group-hover:text-brutal-neon group-hover:scale-110 transition-all" />
              <p className="text-4xl font-black uppercase italic tracking-tighter">SEARCH TO INITIATE VIBE</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Musics;
