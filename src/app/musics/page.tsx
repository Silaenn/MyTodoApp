"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Music2, Play } from "lucide-react";
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
  const playTrack = useMusicStore((state) => state.playTrack);

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

  return (
    <div className="w-full pb-32">
      <div className="flex flex-col gap-10 mb-12 border-b-8 border-white pb-10">
        <h1 className="text-6xl sm:text-7xl font-black uppercase tracking-tighter italic text-stroke">
          VIBE <span className="text-brutal-pink !text-white !italic">DISCOVERY</span>
        </h1>
        
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="w-20 h-20 border-8 border-white border-t-brutal-neon animate-spin"></div>
          <p className="text-3xl font-black uppercase italic text-stroke">SCANNING FREQUENCIES...</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {results.length > 0 ? (
            results.map((m) => (
              <div key={m.id} className="brutal-card p-6 flex flex-col sm:flex-row justify-between items-center gap-8 group hover:border-brutal-neon transition-all">
                <div className="flex flex-col sm:flex-row items-center gap-8 overflow-hidden w-full">
                  <div className="relative w-32 h-32 border-4 border-white flex-shrink-0 overflow-hidden shadow-brutal rotate-3 group-hover:rotate-0 transition-transform">
                    <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 bg-brutal-neon/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <Play className="text-white fill-current animate-ping" size={48} />
                    </div>
                  </div>
                  <div className="overflow-hidden text-center sm:text-left flex-1">
                    <h3 className="text-3xl font-black uppercase truncate leading-tight group-hover:text-brutal-neon transition-colors">{m.title}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                      <span className="w-4 h-1 bg-brutal-pink"></span>
                      <p className="text-brutal-pink text-sm font-black uppercase tracking-[0.3em] truncate">{m.artist}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4 flex-shrink-0 w-full sm:w-auto">
                  <button 
                    onClick={() => playTrack(m)}
                    className="brutal-btn brutal-btn-primary w-full sm:w-auto px-10 italic"
                  >
                    ▶ ACTIVATE
                  </button>
                </div>
              </div>
            ))
          ) : query && !loading ? (
            <div className="brutal-card p-12 text-center bg-transparent border-dashed">
              <p className="text-2xl font-black text-gray-500 uppercase italic tracking-widest">ZERO MATCHES FOUND IN ARCHIVES.</p>
            </div>
          ) : (
            <div className="py-24 text-center opacity-20 group">
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
