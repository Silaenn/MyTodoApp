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
    <div className="max-w-5xl">
      <div className="flex flex-col gap-8 mb-10">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic">Vibe <span className="text-[var(--accent-pink)]">Discovery</span></h1>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH FOR A SONG, ARTIST, OR VIBE..."
            className="pl-12 h-16 bg-[#121212] border-4 border-white rounded-none font-bold uppercase tracking-widest text-lg shadow-[8px_8px_0px_#ffffff] focus-visible:ring-0 focus-visible:border-[var(--accent-neon)] transition-all"
          />
          <button type="submit" className="hidden">SEARCH</button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 bg-white rounded-none"></div>
          <p className="text-2xl font-black uppercase italic">Scanning frequencies...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {results.length > 0 ? (
            results.map((m) => (
              <div key={m.id} className="brutal-card p-4 flex justify-between items-center group">
                <div className="flex items-center gap-6 overflow-hidden">
                  <div className="relative w-20 h-20 border-2 border-white flex-shrink-0 overflow-hidden">
                    <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <Play className="text-[var(--accent-neon)] fill-current" size={32} />
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-xl font-black uppercase truncate leading-none">{m.title}</h3>
                    <p className="text-[var(--accent-pink)] text-xs font-bold uppercase tracking-widest mt-2 truncate">{m.artist}</p>
                  </div>
                </div>
                <div className="flex space-x-4 flex-shrink-0">
                  <button 
                    onClick={() => playTrack(m)}
                    className="brutal-btn bg-white text-black hover:bg-[var(--accent-neon)] font-black italic"
                  >
                    ▶ PLAY
                  </button>
                </div>
              </div>
            ))
          ) : query && !loading ? (
            <p className="text-gray-500 font-bold uppercase tracking-widest italic">No vibes found. Try another search.</p>
          ) : (
            <div className="py-20 text-center opacity-30">
              <Music2 size={80} className="mx-auto mb-4" />
              <p className="text-2xl font-black uppercase italic">Search to start the vibe</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Musics;
