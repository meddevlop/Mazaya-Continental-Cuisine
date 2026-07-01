import { create } from "zustand"

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  isMobileOpen: boolean
  toggle: () => void
  toggleCollapse: () => void
  openMobile: () => void
  closeMobile: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isCollapsed: false,
  isMobileOpen: false,

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  openMobile: () => set({ isMobileOpen: true }),
  closeMobile: () => set({ isMobileOpen: false }),
}))
