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
  likedTracks: Track[];
  queue: Track[];
  currentIndex: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  isLoading: boolean;

  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  stopMusic: () => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  playTrack: (track: Track, newQueue?: Track[]) => Promise<void>;
  fetchRadioRecommendations: (trackId: string) => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => void;
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
      likedTracks: [],
      queue: [],
      currentIndex: -1,
      volume: 0.7,
      shuffle: false,
      repeat: "none",
      isLoading: false,

      stopMusic: () => {
        set({ currentTrack: null, isPlaying: false, isLoading: false });
      },

      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setVolume: (volume) => {
        const safe = typeof volume === 'number' && !isNaN(volume) ? Math.max(0, Math.min(1, volume)) : 0.7;
        set({ volume: safe });
      },
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
        const { queue } = get();
        let currentQueue = newQueue || queue;

        let index = currentQueue.findIndex((t) => t.id === track.id);
        if (index === -1) {
          currentQueue = [...currentQueue, track];
          index = currentQueue.length - 1;
        }

        set({
          currentTrack: { ...track },
          isPlaying: true,
          queue: currentQueue,
          currentIndex: index,
          isLoading: true,
        });

        if (index >= currentQueue.length - 2) {
          get().fetchRadioRecommendations(track.id);
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
                if (queueIds.has(rec.id)) return false;

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
            } else {
              console.log("[Radio] All recommendations filtered out.");
            }
          }
        } catch (error) {
          console.error("[Radio] Error:", error);
        }
      },

      nextTrack: async () => {
        const { currentTrack, playTrack, repeat, queue, currentIndex, fetchRadioRecommendations } = get();

        if (currentIndex < queue.length - 1) {
          await playTrack(queue[currentIndex + 1]);
          return;
        }

        if (repeat === "all" && queue.length > 0) {
          await playTrack(queue[0]);
          return;
        }

        if (currentTrack) {
          set({ isLoading: true });
          console.log("[Radio] Queue finished, fetching new recommendations...");
          await fetchRadioRecommendations(currentTrack.id);

          const updatedQueue = get().queue;
          if (currentIndex < updatedQueue.length - 1) {
            await playTrack(updatedQueue[currentIndex + 1]);
            return;
          } else {
            console.log("[Radio] Still empty after recs. Trying genre search fallback...");
            try {
              const searchArtist = currentTrack.artist || "";
              const titleWords = cleanTitle(currentTrack.title)
                .split(" ")
                .filter((w) => w.length > 3)
                .slice(0, 3)
                .join(" ");

              const queryStr = searchArtist 
                ? `${searchArtist} similar songs music`
                : `${titleWords} similar songs music`;

              const genreQuery = encodeURIComponent(queryStr);
              const res = await fetch(`${BACKEND_URL}/search?q=${genreQuery}`);
              const searchResults = await res.json();

              if (Array.isArray(searchResults) && searchResults.length > 0) {
                const existingIds = new Set(updatedQueue.map((t) => t.id));

                const fallbackTrack =
                  searchResults.find(
                    (t) =>
                      !existingIds.has(t.id) &&
                      !areDuplicateTitles(currentTrack.title, t.title)
                  ) || searchResults.find((t) => !existingIds.has(t.id) && t.id !== currentTrack.id) || searchResults[0];

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
