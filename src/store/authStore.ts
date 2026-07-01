import { create } from "zustand"

interface AuthState {
  user: { name: string; email: string; role: string } | null
  isLoading: boolean
  setUser: (user: AuthState["user"]) => void
  clearUser: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),

  clearUser: () => set({ user: null, isLoading: false }),

  checkAuth: async () => {
    try {
      const res = await fetch("/admin/api/auth")
      if (res.ok) {
        const data = await res.json()
        set({ user: data.user || { name: "Admin", email: "admin@mazayacuisine.com", role: "admin" }, isLoading: false })
      } else {
        set({ user: null, isLoading: false })
      }
    } catch {
      set({ user: null, isLoading: false })
    }
  },
}))
