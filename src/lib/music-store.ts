import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  streamUrl?: string;
  ext?: string;
  protocol?: string;
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
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  stopMusic: () => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  playTrack: (track: Track, newQueue?: Track[]) => Promise<void>;
  preloadNext: (nextIndex: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => void;
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
}

// Track fetch yang sedang berjalan agar bisa di-abort
let currentAbortController: AbortController | null = null;

const isHLS = (url: string | null | undefined, protocol?: string, ext?: string): boolean => {
  if (!url) return false;
  if (protocol && (protocol === "m3u8" || protocol === "m3u8_native")) return true;
  if (ext && ext === "m3u8") return true;
  if (url.includes(".m3u8") || url.includes("manifest.googlevideo.com")) return true;
  return false;
};

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
      toggleRepeat: () =>
        set((state) => {
          const modes: RepeatMode[] = ["none", "all", "one"];
          const idx = modes.indexOf(state.repeat);
          return { repeat: modes[(idx + 1) % modes.length] };
        }),

      setQueue: (tracks) => set({ queue: tracks }),
      addToQueue: (track) =>
        set((state) => ({ queue: [...state.queue, track] })),

      playTrack: async (track, newQueue) => {
        // Batalkan fetch sebelumnya
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

        // Cek cache (preloaded)
        const trackWithCache = currentQueue[index];
        if (trackWithCache.streamUrl && !isHLS(trackWithCache.streamUrl, trackWithCache.protocol, trackWithCache.ext)) {
          console.log("Using cached stream for:", track.title);
          set({
            currentTrack: trackWithCache,
            isPlaying: true,
            streamUrl: trackWithCache.streamUrl,
            queue: currentQueue,
            currentIndex: index,
            isLoading: false,
          });

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
          isLoading: true,
        });

        try {
          const res = await fetch(
            `http://localhost:8000/stream?url=${encodeURIComponent(track.url)}`,
            { signal }
          );
          const data = await res.json();

          if (data.stream_url) {
            // Deteksi HLS — skip ke lagu berikutnya kalau format tidak didukung browser
            if (isHLS(data.stream_url, data.protocol, data.ext)) {
              console.warn(
                `HLS/live stream detected for "${track.title}", skipping...`
              );
              set({ isLoading: false });
              get().nextTrack();
              return;
            }

            set({ streamUrl: data.stream_url, isPlaying: true, isLoading: false });

            // Preload lagu selanjutnya
            const nextIdx = index + 1;
            if (nextIdx < currentQueue.length) {
              get().preloadNext(nextIdx);
            }
          } else {
            console.error("No stream URL:", data.error || "Unknown error");
            set({ isLoading: false });
            get().nextTrack();
          }
        } catch (error: any) {
          if (error.name === "AbortError") {
            console.log("Fetch aborted for:", track.title);
          } else {
            console.error("Failed to get stream URL:", error);
            set({ isLoading: false });
            get().nextTrack();
          }
        }
      },

      preloadNext: async (nextIndex: number) => {
        const { queue } = get();
        if (nextIndex >= queue.length) return;

        const nextTrack = queue[nextIndex];
        // Skip preload kalau sudah ada cache atau sudah diketahui HLS
        if (nextTrack.streamUrl) return;

        try {
          console.log("Preloading next:", nextTrack.title);
          const res = await fetch(
            `http://localhost:8000/stream?url=${encodeURIComponent(nextTrack.url)}`
          );
          const data = await res.json();

          if (data.stream_url && !isHLS(data.stream_url, data.protocol, data.ext)) {
            const currentQueue = get().queue;
            // Pastikan track masih sama (belum diganti user)
            if (
              currentQueue[nextIndex] &&
              currentQueue[nextIndex].id === nextTrack.id
            ) {
              const finalQueue = [...currentQueue];
              finalQueue[nextIndex] = {
                ...finalQueue[nextIndex],
                streamUrl: data.stream_url,
                ext: data.ext,
                protocol: data.protocol,
              };
              set({ queue: finalQueue });
              console.log("Preload success:", nextTrack.title);
            }
          } else if (isHLS(data.stream_url, data.protocol, data.ext)) {
            // Tandai sebagai HLS agar saat giliran diplay langsung di-skip
            console.warn("Preload: HLS detected for", nextTrack.title, "— will skip when played");
          }
        } catch (e) {
          console.error("Preload failed:", e);
        }
      },

      nextTrack: async () => {
        const { currentTrack, playTrack, repeat, queue, currentIndex } = get();

        if (repeat === "one" && currentTrack) {
          playTrack(currentTrack);
          return;
        }

        const hasNextInQueue = currentIndex < queue.length - 1;

        if (hasNextInQueue) {
          await playTrack(queue[currentIndex + 1]);
          return;
        }

        if (repeat === "all" && queue.length > 0) {
          await playTrack(queue[0]);
          return;
        }

        // Radio Mode — ambil rekomendasi kalau queue habis
        if (currentTrack) {
          // Set loading state immediately so UI reacts
          set({ isLoading: true, isPlaying: false, streamUrl: null });
          
          try {
            console.log("Radio Mode: fetching recommendations for", currentTrack.title);
            const res = await fetch(
              `http://localhost:8000/recommendations/${currentTrack.id}`
            );
            const recommendations = await res.json();

            if (Array.isArray(recommendations) && recommendations.length > 0) {
              const randomIdx = Math.floor(
                Math.random() * Math.min(recommendations.length, 5)
              );
              const nextTrack = recommendations[randomIdx];
              console.log("Radio Mode found:", nextTrack.title);

              const updatedQueue = [...queue, nextTrack];
              await playTrack(nextTrack, updatedQueue);
              return;
            }
          } catch (error) {
            console.error("Radio Mode error:", error);
          }
        }

        set({ isPlaying: false, isLoading: false });
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
        set({
          likedTracks: isAlreadyLiked
            ? likedTracks.filter((t) => t.id !== track.id)
            : [...likedTracks, track],
        });
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
        repeat: state.repeat,
      }),
    }
  )
);