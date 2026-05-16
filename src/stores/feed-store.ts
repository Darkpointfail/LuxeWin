import { create } from "zustand";
import { persist } from "zustand/middleware";

type PendingScroll = { index: number; id: number };

type FeedState = {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  detailLotId: string | null;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  selectedQty: number;
  setSelectedQty: (n: number) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  purchaseActions: number;
  registerPurchase: () => void;
  likedLotIds: string[];
  toggleLikeLot: (lotId: string) => void;
  /** Synchronisé avec le conteneur scroll du feed (recherche → clip). */
  pendingScroll: PendingScroll | null;
  requestScrollToSlide: (index: number) => void;
  clearPendingScroll: () => void;
};

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      activeIndex: 0,
      setActiveIndex: (i) => set({ activeIndex: i }),
      detailLotId: null,
      openDetail: (id) => set({ detailLotId: id }),
      closeDetail: () => set({ detailLotId: null }),
      selectedQty: 1,
      setSelectedQty: (n) => set({ selectedQty: n }),
      soundEnabled: false,
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
      purchaseActions: 0,
      registerPurchase: () =>
        set((s) => ({ purchaseActions: s.purchaseActions + 1 })),
      likedLotIds: [],
      toggleLikeLot: (lotId) =>
        set((s) => ({
          likedLotIds: s.likedLotIds.includes(lotId)
            ? s.likedLotIds.filter((id) => id !== lotId)
            : [...s.likedLotIds, lotId],
        })),
      pendingScroll: null,
      requestScrollToSlide: (index) =>
        set((s) => ({
          pendingScroll: {
            index,
            id: (s.pendingScroll?.id ?? 0) + 1,
          },
        })),
      clearPendingScroll: () => set({ pendingScroll: null }),
    }),
    {
      name: "gaviom-feed",
      partialize: (s) => ({
        soundEnabled: s.soundEnabled,
        likedLotIds: s.likedLotIds,
      }),
    }
  )
);
