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
  fetchRadioRecommendations: (trackId: string) => Promise<void>;
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

const normalizeTitle = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // Remove (...)
    .replace(/\[.*?\]/g, "") // Remove [...]
    .replace(/official\s+(video|audio|lyric|music|mv|visualizer)/gi, "")
    .replace(/ft\.|feat\./gi, "")
    .replace(/[^a-z0-9\s]/g, "") // Keep spaces for word splitting
    .split(/\s+/)
    .filter(word => word.length > 1)
    .join(" ")
    .trim();
};

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      // ... (keep state as is)
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

          // Preload next 2 tracks aggressively
          get().preloadNext(index + 1);
          get().preloadNext(index + 2);
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
            if (isHLS(data.stream_url, data.protocol, data.ext)) {
              set({ isLoading: false });
              get().nextTrack();
              return;
            }

            // Update the track in queue with its streamUrl for future use
            const updatedQueue = [...get().queue];
            if (updatedQueue[index] && updatedQueue[index].id === track.id) {
              updatedQueue[index] = { ...updatedQueue[index], streamUrl: data.stream_url, ext: data.ext, protocol: data.protocol };
            }

            set({ streamUrl: data.stream_url, isPlaying: true, isLoading: false, queue: updatedQueue });

            // Preload next 2 tracks aggressively
            get().preloadNext(index + 1);
            get().preloadNext(index + 2);
            
            // Proactively check if we need to fetch radio recommendations
            if (index >= updatedQueue.length - 2) {
              get().fetchRadioRecommendations(track.id);
            }
          } else {
            set({ isLoading: false });
            get().nextTrack();
          }
        } catch (error: unknown) {
          if (error instanceof Error && error.name !== "AbortError") {
            set({ isLoading: false });
            get().nextTrack();
          }
        }
      },

      fetchRadioRecommendations: async (trackId: string) => {
        const { queue, currentTrack } = get();
        try {
          console.log("Proactive Radio Mode: fetching recommendations...");
          const res = await fetch(`http://localhost:8000/recommendations/${trackId}`);
          const recommendations = await res.json();

          if (Array.isArray(recommendations) && recommendations.length > 0) {
            // Stronger filtering: avoid same ID AND similar titles
            const existingNormalizedTitles = [
              ...queue.map(t => normalizeTitle(t.title)),
              currentTrack ? normalizeTitle(currentTrack.title) : ""
            ].filter(Boolean);

            const newTracks = recommendations.filter(rec => {
              const isSameId = queue.some(q => q.id === rec.id);
              if (isSameId) return false;

              const normalizedRecTitle = normalizeTitle(rec.title);
              // Check if this recommendation's title matches or is very similar to anything already played/queued
              const isDuplicateTitle = existingNormalizedTitles.some(existingTitle => {
                if (existingTitle === normalizedRecTitle) return true;
                // If one title is contained within another (e.g. "Song Name" vs "Song Name Cover")
                if (normalizedRecTitle.includes(existingTitle) || existingTitle.includes(normalizedRecTitle)) {
                   // Only block if the overlap is significant (not just common words)
                   const words1 = normalizedRecTitle.split(" ");
                   const words2 = existingTitle.split(" ");
                   const commonWords = words1.filter(w => words2.includes(w));
                   return commonWords.length >= Math.min(words1.length, words2.length, 2);
                }
                return false;
              });

              return !isDuplicateTitle;
            }).slice(0, 5);

            if (newTracks.length > 0) {
              set({ queue: [...queue, ...newTracks] });
              console.log("Proactive Radio Mode: added", newTracks.length, "tracks to queue");
              const nextIdx = queue.length;
              get().preloadNext(nextIdx);
            }
          }
        } catch (error) {
          console.error("Proactive Radio error:", error);
        }
      },

      preloadNext: async (nextIndex: number) => {
        const { queue } = get();
        if (nextIndex < 0 || nextIndex >= queue.length) return;

        const nextTrack = queue[nextIndex];
        if (nextTrack.streamUrl) return;

        try {
          console.log("Preloading:", nextTrack.title);
          const res = await fetch(
            `http://localhost:8000/stream?url=${encodeURIComponent(nextTrack.url)}`
          );
          const data = await res.json();

          if (data.stream_url && !isHLS(data.stream_url, data.protocol, data.ext)) {
            const currentQueue = get().queue;
            if (currentQueue[nextIndex] && currentQueue[nextIndex].id === nextTrack.id) {
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

        if (currentIndex < queue.length - 1) {
          await playTrack(queue[currentIndex + 1]);
          return;
        }

        if (repeat === "all" && queue.length > 0) {
          await playTrack(queue[0]);
          return;
        }

        // Final fallback if proactive fetch failed or was too slow
        if (currentTrack) {
          set({ isLoading: true, isPlaying: false, streamUrl: null });
          await get().fetchRadioRecommendations(currentTrack.id);
          const updatedQueue = get().queue;
          if (currentIndex < updatedQueue.length - 1) {
            await playTrack(updatedQueue[currentIndex + 1]);
            return;
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