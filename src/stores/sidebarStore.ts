import { create } from "zustand";

type SidebarState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  autoOpenIfDesktop: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false, // Toujours fermé au démarrage
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  autoOpenIfDesktop: () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      set({ isOpen: true });
    } else {
      set({ isOpen: false });
    }
  },
}));