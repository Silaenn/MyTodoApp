import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  streamUrl?: string; // Cache untuk link stream agar instan
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
  isLoading: boolean;

  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  playTrack: (track: Track, newQueue?: Track[]) => Promise<void>;
  preloadNext: (nextIndex: number) => Promise<void>;
  toggleLike: (track: Track) => void;
}

// Tambahkan di luar store untuk tracking fetch yang sedang berjalan
let currentAbortController: AbortController | null = null;

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
      isLoading: false,
      
      stopMusic: () => {
        if (currentAbortController) currentAbortController.abort();
        set({ currentTrack: null, isPlaying: false, streamUrl: null, isLoading: false });
      },
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
        // Batalkan fetch lagu sebelumnya jika masih berjalan
        if (currentAbortController) {
          currentAbortController.abort();
        }
        currentAbortController = new AbortController();
        const { signal } = currentAbortController;

        const { queue } = get();
        let currentQueue = newQueue || queue;
        
        let index = currentQueue.findIndex((t) => t.id === track.id);
        if (index === -1) {
          currentQueue = [...currentQueue, track];
          index = currentQueue.length - 1;
        }

        // 1. CEK APAKAH SUDAH ADA DI CACHE (PRELOADED)
        const trackWithCache = currentQueue[index];
        if (trackWithCache.streamUrl) {
          console.log("Using cached stream for:", track.title);
          set({ 
            currentTrack: trackWithCache, 
            isPlaying: true, 
            streamUrl: trackWithCache.streamUrl, 
            queue: currentQueue,
            currentIndex: index,
            isLoading: false
          });
          
          // Siapkan preload untuk lagu SETELAHNYA lagi
          const nextIdx = index + 1;
          if (nextIdx < currentQueue.length) {
            get().preloadNext(nextIdx);
          }
          return;
        }

        set({ 
          currentTrack: track, 
          isPlaying: false, 
          streamUrl: null, 
          queue: currentQueue,
          currentIndex: index,
          isLoading: true
        });

        try {
          const res = await fetch(`http://localhost:8000/stream?url=${encodeURIComponent(track.url)}`, { signal });
          const data = await res.json();
          
          if (data.stream_url) {
            set({ streamUrl: data.stream_url, isPlaying: true, isLoading: false });
            
            // 2. BEGITU LAGU JALAN, SIAPKAN LAGU SELANJUTNYA (PRELOAD)
            const nextIdx = index + 1;
            if (nextIdx < currentQueue.length) {
              get().preloadNext(nextIdx);
            }
          } else {
            console.error("No stream URL in response:", data.error || "Unknown error");
            set({ isLoading: false });
            // OTOMATIS SKIP KE LAGU BERIKUTNYA JIKA GAGAL
            get().nextTrack();
          }
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.log("Fetch aborted for track:", track.title);
          } else {
            console.error("Failed to get stream URL:", error);
            set({ isLoading: false });
            // OTOMATIS SKIP KE LAGU BERIKUTNYA JIKA GAGAL
            get().nextTrack();
          }
        }
      },

      preloadNext: async (nextIndex: number) => {
        const { queue } = get();
        if (nextIndex >= queue.length) return;
        
        const nextTrack = queue[nextIndex];
        if (nextTrack.streamUrl) return; // Sudah di-preload

        try {
          console.log("Preloading next stream for:", nextTrack.title);
          const res = await fetch(`http://localhost:8000/stream?url=${encodeURIComponent(nextTrack.url)}`);
          const data = await res.json();
          if (data.stream_url) {
            const updatedQueue = [...get().queue];
            // Pastikan track-nya masih sama (ID mencocokkan)
            const currentQueue = get().queue;
            if (currentQueue[nextIndex] && currentQueue[nextIndex].id === nextTrack.id) {
              const finalQueue = [...currentQueue];
              finalQueue[nextIndex] = { ...finalQueue[nextIndex], streamUrl: data.stream_url };
              set({ queue: finalQueue });
              console.log("Preload success for:", nextTrack.title);
            }
          }
        } catch (e) {
          console.error("Preload failed", e);
        }
      },

      nextTrack: async () => {
        const { currentTrack, playTrack, repeat, queue, currentIndex, addToQueue } = get();
        
        // Jika mode repeat "one", putar ulang lagu yang sama
        if (repeat === "one" && currentTrack) {
          playTrack(currentTrack);
          return;
        }

        // Cek apakah ada lagu berikutnya di antrean
        const hasNextInQueue = currentIndex < queue.length - 1;

        if (hasNextInQueue) {
          await playTrack(queue[currentIndex + 1]);
          return;
        }

        // Jika tidak ada lagu berikutnya di antrean:
        // 1. Jika repeat "all", kembali ke awal
        if (repeat === "all" && queue.length > 0) {
          await playTrack(queue[0]);
          return;
        }

        // 2. Jika repeat "none", aktifkan Radio Mode (rekomendasi)
        if (currentTrack) {
          try {
            console.log("Fetching Radio Mode recommendations for:", currentTrack.title);
            const res = await fetch(`http://localhost:8000/recommendations/${currentTrack.id}`);
            const recommendations = await res.json();
            
            if (Array.isArray(recommendations) && recommendations.length > 0) {
              // Ambil satu lagu acak dari rekomendasi agar tidak monoton
              const randomIndex = Math.floor(Math.random() * Math.min(recommendations.length, 5));
              const nextTrack = recommendations[randomIndex];
              
              console.log("Radio Mode found:", nextTrack.title);
              
              // Tambahkan ke antrean dan putar
              // Kita tidak mengganti antrean, tapi menambahkannya (seperti Spotify)
              const updatedQueue = [...queue, nextTrack];
              await playTrack(nextTrack, updatedQueue);
              return;
            }
          } catch (error) {
            console.error("Radio Mode error:", error);
          }
        }

        // Jika semua gagal, berhenti
        set({ isPlaying: false });
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
