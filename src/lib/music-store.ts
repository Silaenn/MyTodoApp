import { create } from "zustand";

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
}

interface MusicStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  streamUrl: string | null;
  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  playTrack: (track: Track) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  streamUrl: null,
  
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  playTrack: async (track) => {
    set({ currentTrack: track, isPlaying: false, streamUrl: null });
    try {
      const res = await fetch(`http://localhost:8000/stream?url=${encodeURIComponent(track.url)}`);
      const data = await res.json();
      set({ streamUrl: data.stream_url, isPlaying: true });
    } catch (error) {
      console.error("Failed to get stream URL:", error);
    }
  },
}));
