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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Track fetch yang sedang berjalan agar bisa di-abort
let currentAbortController: AbortController | null = null;

const isHLS = (url: string | null | undefined, protocol?: string, ext?: string): boolean => {
  if (!url) return false;
  if (protocol && (protocol === "m3u8" || protocol === "m3u8_native")) return true;
  if (ext && ext === "m3u8") return true;
  if (url.includes(".m3u8") || url.includes("manifest.googlevideo.com")) return true;
  return false;
};

/**
 * Bersihkan judul dari suffix umum music video.
 */
const cleanTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/official\s+(video|audio|lyric|music|mv|visualizer)/gi, "")
    .replace(/ft\.|feat\./gi, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .join(" ")
    .trim();
};

/**
 * ✅ FIX: Cek apakah dua judul adalah lagu yang SAMA (cover, live version, dll).
 * Menggunakan word-overlap similarity dengan threshold 70%.
 *
 * Logika ini BERBEDA dari keyword matching lama:
 * - "Bukti KasihMu" vs "Bukti KasihMu (Cover)" → true (duplikat, skip)
 * - "Bukti KasihMu" vs "Kasih Setia-Mu" → false (lagu beda, genre sama, boleh masuk)
 * - "Blessed" vs "Blessed Be Your Name" → false (beda lagu)
 *
 * Threshold bisa diturunkan ke 0.6 kalau masih kebanyakan false positive.
 */
const areDuplicateTitles = (title1: string, title2: string, threshold = 0.7): boolean => {
  const words1 = new Set(cleanTitle(title1).split(" ").filter((w) => w.length > 0));
  const words2 = new Set(cleanTitle(title2).split(" ").filter((w) => w.length > 0));

  if (words1.size === 0 || words2.size === 0) return false;

  const overlap = [...words1].filter((w) => words2.has(w));
  const similarity = overlap.length / Math.min(words1.size, words2.size);

  if (similarity >= threshold) {
    console.log(
      `[DUP] "${title1}" ~ "${title2}" (similarity=${similarity.toFixed(2)})`
    );
    return true;
  }
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

        // Gunakan cache kalau ada
        const trackWithCache = currentQueue[index];
        if (
          trackWithCache.streamUrl &&
          !isHLS(trackWithCache.streamUrl, trackWithCache.protocol, trackWithCache.ext)
        ) {
          console.log("Using cached stream for:", track.title);
          set({
            currentTrack: trackWithCache,
            isPlaying: true,
            streamUrl: trackWithCache.streamUrl,
            queue: currentQueue,
            currentIndex: index,
            isLoading: false,
          });

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
            `${BACKEND_URL}/stream?url=${encodeURIComponent(track.url)}`,
            { signal }
          );
          const data = await res.json();

          if (data.stream_url) {
            if (isHLS(data.stream_url, data.protocol, data.ext)) {
              set({ isLoading: false });
              get().nextTrack();
              return;
            }

            const updatedQueue = [...get().queue];
            if (updatedQueue[index] && updatedQueue[index].id === track.id) {
              updatedQueue[index] = {
                ...updatedQueue[index],
                streamUrl: data.stream_url,
                ext: data.ext,
                protocol: data.protocol,
              };
            }

            set({ streamUrl: data.stream_url, isPlaying: true, isLoading: false, queue: updatedQueue });

            get().preloadNext(index + 1);
            get().preloadNext(index + 2);

            // Proactively fetch radio recs kalau queue mau habis
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
          console.log("[Radio] Fetching recommendations for:", currentTrack?.title);
          const res = await fetch(`${BACKEND_URL}/recommendations/${trackId}`);
          const recommendations = await res.json();

          if (Array.isArray(recommendations) && recommendations.length > 0) {
            const queueIds = new Set(queue.map((t) => t.id));

            const newTracks = recommendations
              .filter((rec) => {
                // 1. Skip kalau sudah ada di queue
                if (queueIds.has(rec.id)) return false;

                // ✅ FIX: Cek title similarity, BUKAN keyword overlap
                // Ini supaya lagu rohani lain tetap bisa masuk,
                // tapi cover/versi lain dari lagu yang sama difilter
                if (currentTrack && areDuplicateTitles(currentTrack.title, rec.title)) {
                  console.log(`[Radio] Skipping duplicate: "${rec.title}"`);
                  return false;
                }

                return true;
              })
              .slice(0, 5);

            if (newTracks.length > 0) {
              set({ queue: [...queue, ...newTracks] });
              console.log("[Radio] Added", newTracks.length, "tracks to queue:", newTracks.map(t => t.title));
              const nextIdx = queue.length;
              get().preloadNext(nextIdx);
            } else {
              console.log("[Radio] All recommendations filtered out.");
            }
          }
        } catch (error) {
          console.error("[Radio] Error:", error);
        }
      },

      preloadNext: async (nextIndex: number) => {
        const { queue } = get();
        if (nextIndex < 0 || nextIndex >= queue.length) return;

        const nextTrack = queue[nextIndex];
        if (nextTrack.streamUrl) return;

        try {
          console.log("[Preload] Preloading:", nextTrack.title);
          const res = await fetch(
            `${BACKEND_URL}/stream?url=${encodeURIComponent(nextTrack.url)}`
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
              console.log("[Preload] Success:", nextTrack.title);
            }
          }
        } catch (e) {
          console.error("[Preload] Failed:", e);
        }
      },

      nextTrack: async () => {
        const { currentTrack, playTrack, repeat, queue, currentIndex } = get();

        if (repeat === "one" && currentTrack) {
          playTrack(currentTrack);
          return;
        }

        // 1. Ada lagu berikutnya di queue
        if (currentIndex < queue.length - 1) {
          await playTrack(queue[currentIndex + 1]);
          return;
        }

        // 2. Repeat all → kembali ke awal
        if (repeat === "all" && queue.length > 0) {
          await playTrack(queue[0]);
          return;
        }

        // 3. Radio Mode: queue habis → fetch rekomendasi baru
        if (currentTrack) {
          set({ isLoading: true });
          console.log("[Radio] Queue finished, fetching new recommendations...");
          await get().fetchRadioRecommendations(currentTrack.id);

          const updatedQueue = get().queue;
          if (currentIndex < updatedQueue.length - 1) {
            await playTrack(updatedQueue[currentIndex + 1]);
            return;
          } else {
            // Fallback: search lagu berbeda berdasarkan judul current track
            console.log("[Radio] Still empty after recs. Trying genre search fallback...");
            try {
              // Ambil bagian judul yang bermakna (hindari kata umum)
              const titleWords = cleanTitle(currentTrack.title)
                .split(" ")
                .filter((w) => w.length > 3)
                .slice(0, 3)
                .join(" ");

              const genreQuery = encodeURIComponent(`${titleWords} similar songs music`);
              const res = await fetch(`${BACKEND_URL}/search?q=${genreQuery}`);
              const searchResults = await res.json();

              if (Array.isArray(searchResults) && searchResults.length > 0) {
                const existingIds = new Set(updatedQueue.map((t) => t.id));

                // Cari lagu yang beda judul dan belum di queue
                const fallbackTrack =
                  searchResults.find(
                    (t) =>
                      !existingIds.has(t.id) &&
                      !areDuplicateTitles(currentTrack.title, t.title)
                  ) || searchResults.find((t) => !existingIds.has(t.id)) || searchResults[0];

                if (fallbackTrack) {
                  console.log("[Radio] Genre fallback playing:", fallbackTrack.title);
                  await playTrack(fallbackTrack, [...updatedQueue, fallbackTrack]);
                  return;
                }
              }
            } catch (e) {
              console.error("[Radio] Genre fallback failed:", e);
            }
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