import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
}

type RepeatMode = "none" | "one" | "all";

interface MusicStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  streamUrl: string | null;
  likedTracks: Track[];
  queue: Track[];
  currentIndex: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  
  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  playTrack: (track: Track, newQueue?: Track[]) => Promise<void>;
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  stopMusic: () => void;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      streamUrl: null,
      likedTracks: [],
      queue: [],
      currentIndex: -1,
      volume: 0.7,
      shuffle: false,
      repeat: "none",
      
      stopMusic: () => set({ currentTrack: null, isPlaying: false, streamUrl: null }),
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      toggleRepeat: () => set((state) => {
        const modes: RepeatMode[] = ["none", "all", "one"];
        const currentIndex = modes.indexOf(state.repeat);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        return { repeat: nextMode };
      }),
      
      setQueue: (tracks) => set({ queue: tracks }),
      addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
      
      playTrack: async (track, newQueue) => {
        const { queue } = get();
        let currentQueue = newQueue || queue;
        
        // If not in queue, add it
        let index = currentQueue.findIndex((t) => t.id === track.id);
        if (index === -1) {
          currentQueue = [...currentQueue, track];
          index = currentQueue.length - 1;
        }

        set({ 
          currentTrack: track, 
          isPlaying: false, 
          streamUrl: null, 
          queue: currentQueue,
          currentIndex: index
        });

        try {
          const res = await fetch(`http://localhost:8000/stream?url=${encodeURIComponent(track.url)}`);
          const data = await res.json();
          if (data.stream_url) {
            set({ streamUrl: data.stream_url, isPlaying: true });
          }
        } catch (error) {
          console.error("Failed to get stream URL:", error);
        }
      },

      nextTrack: async () => {
        const { currentTrack, playTrack } = get();
        if (!currentTrack) return;

        try {
          // Spotify-style Radio Mode: Langsung cari rekomendasi berdasarkan lagu yang baru selesai
          const res = await fetch(`http://localhost:8000/recommendations/${currentTrack.id}`);
          const recommendations = await res.json();
          
          if (recommendations && recommendations.length > 0) {
            // Pilih lagu pertama dari rekomendasi (biasanya yang paling relevan/segenre)
            const nextRecommendedTrack = recommendations[0];
            
            // Masukkan ke antrean dan putar langsung
            set((state) => ({
              queue: [...state.queue, nextRecommendedTrack],
              currentIndex: state.queue.length
            }));
            
            playTrack(nextRecommendedTrack);
          } else {
            // Fallback jika rekomendasi gagal: gunakan logika queue biasa
            const { queue, currentIndex, shuffle, repeat } = get();
            if (queue.length === 0) return;

            let nextIndex = (currentIndex + 1) % queue.length;
            if (nextIndex === 0 && repeat === "none") {
              set({ isPlaying: false });
              return;
            }
            playTrack(queue[nextIndex]);
          }
        } catch (error) {
          console.error("Failed to fetch recommendations for autoplay:", error);
          set({ isPlaying: false });
        }
      },

      prevTrack: () => {
        const { queue, currentIndex, playTrack } = get();
        if (queue.length === 0) return;

        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        playTrack(queue[prevIndex]);
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
      partialize: (state) => ({ 
        likedTracks: state.likedTracks,
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat
      }), 
    }
  )
);
