import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  likedTracks: Track[];
  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  playTrack: (track: Track) => Promise<void>;
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      streamUrl: null,
      likedTracks: [],
      
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      
      playTrack: async (track) => {
        // Set track immediately so UI updates (footer appears)
        set({ currentTrack: track, isPlaying: false, streamUrl: null });
        try {
          // Use a relative path or fixed localhost for now. 
          // The user mentioned backend needs to be running.
          const res = await fetch(`http://localhost:8000/stream?url=${encodeURIComponent(track.url)}`);
          const data = await res.json();
          if (data.stream_url) {
            set({ streamUrl: data.stream_url, isPlaying: true });
          }
        } catch (error) {
          console.error("Failed to get stream URL:", error);
        }
      },

      toggleLike: (track) => {
        const { likedTracks } = get();
        const isAlreadyLiked = likedTracks.some((t) => t.id === track.id);
        
        if (isAlreadyLiked) {
          set({ likedTracks: likedTracks.filter((t) => t.id !== track.id) });
        } else {
          set({ likedTracks: [...likedTracks, track] });
        }
      },

      isLiked: (trackId) => {
        return get().likedTracks.some((t) => t.id === trackId);
      },
    }),
    {
      name: "music-storage",
      partialize: (state) => ({ likedTracks: state.likedTracks }), // Only persist liked tracks
    }
  )
);
