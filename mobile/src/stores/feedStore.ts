import { create } from 'zustand';

type FeedMode = 'list' | 'masonry';

interface FeedState {
  mode: FeedMode;
  toggleMode: () => void;
  setMode: (m: FeedMode) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  mode: 'list',
  toggleMode: () => set((s) => ({ mode: s.mode === 'list' ? 'masonry' : 'list' })),
  setMode: (mode) => set({ mode }),
}));
