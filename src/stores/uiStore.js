import { create } from "zustand";

/**
 * UI store — ephemeral client state not related to server data.
 * NOT persisted to localStorage.
 */
export const useUiStore = create((set) => ({
  /** @type {boolean} */
  sidebarOpen: true,

  /** Toggle sidebar open/closed */
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  /** @param {boolean} open */
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
