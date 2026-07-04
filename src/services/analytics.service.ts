import { supabase } from "@/lib/supabase"

export interface AnalyticsOverview {
  total_reservations: number
  total_guests: number
  total_revenue: number
  average_rating: number
  monthly_growth: number
  popular_dishes: { name: string; count: number }[]
  reservations_by_day: { date: string; count: number }[]
  revenue_by_month: { month: string; amount: number }[]
  visitors_by_source: { source: string; count: number }[]
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export async function getAnalyticsOverview(): Promise<{ data: AnalyticsOverview | null; error: string | null }> {
  try {
    const [
      totalRes,
      totalGuests,
      menuItems,
      dailyRes,
    ] = await Promise.all([
      supabase.from("reservations").select("*", { count: "exact", head: true }),
      supabase.from("reservations").select("guests"),
      supabase.from("menu_items").select("name, is_popular, order_index").eq("is_popular", true).order("order_index").limit(5),
      supabase.from("reservations").select("date, guests").gte("date", new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0]),
    ])

    const totalReservations = totalRes.count ?? 0
    const totalGuestsSum = (totalGuests.data || []).reduce((sum: number, r: any) => sum + (r.guests || 0), 0)

    const reservationsByDay: Record<string, number> = {}
    ;(dailyRes.data || []).forEach((r: any) => {
      const d = r.date?.slice(0, 10)
      if (d) reservationsByDay[d] = (reservationsByDay[d] || 0) + 1
    })

    const last14 = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0]
      return { date: d, count: reservationsByDay[d] || 0 }
    })

    const popularDishes = (menuItems.data || []).map((item: any) => ({
      name: item.name,
      count: item.order_index || 0,
    }))

    const revenueByMonth = MONTHS.map((month, i) => ({
      month,
      amount: 0,
    }))

    return {
      data: {
        total_reservations: totalReservations,
        total_guests: totalGuestsSum,
        total_revenue: 0,
        average_rating: 0,
        monthly_growth: 0,
        popular_dishes: popularDishes,
        reservations_by_day: last14,
        revenue_by_month: revenueByMonth,
        visitors_by_source: [],
      },
      error: null,
    }
  } catch (err) {
    return { data: null, error: (err as Error).message }
  }
}
