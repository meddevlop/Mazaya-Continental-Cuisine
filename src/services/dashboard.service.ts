import { supabase } from "@/lib/supabase"

export interface DashboardStats {
  todayReservations: number
  pendingReservations: number
  totalMenuItems: number
  totalGallery: number
  unreadMessages: number
  totalReservations: number
}

export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: string | null }> {
  try {
    const today = new Date().toISOString().split("T")[0]

    const [reservationsRes, todayRes, pendingRes, menuRes, msgRes, galleryRes] = await Promise.all([
      supabase.from("reservations").select("*", { count: "exact", head: true }),
      supabase.from("reservations").select("*", { count: "exact", head: true }).eq("date", today),
      supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("menu_items").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
    ])

    return {
      data: {
        todayReservations: todayRes.count ?? 0,
        pendingReservations: pendingRes.count ?? 0,
        totalMenuItems: menuRes.count ?? 0,
        totalGallery: galleryRes.count ?? 0,
        unreadMessages: msgRes.count ?? 0,
        totalReservations: reservationsRes.count ?? 0,
      },
      error: null,
    }
  } catch (err) {
    return { data: null, error: (err as Error).message }
  }
}
