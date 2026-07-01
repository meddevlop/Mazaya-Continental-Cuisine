"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, CalendarCheck, DollarSign, Star, ArrowUp, ArrowDown } from "lucide-react"
import PageHeader from "@/components/admin/ui/PageHeader"
import LoadingSkeleton from "@/components/admin/ui/LoadingSkeleton"
import ErrorState from "@/components/admin/ui/ErrorState"

interface AnalyticsOverview {
  total_reservations: number; total_guests: number; total_revenue: number; average_rating: number
  monthly_growth: number; popular_dishes: { name: string; count: number }[]
  reservations_by_day: { date: string; count: number }[]
  revenue_by_month: { month: string; amount: number }[]
  visitors_by_source: { source: string; count: number }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null)
  const [loading, setLoading] = useState(true); const [error, setError] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    try { const res = await fetch("/admin/api/analytics"); if (!res.ok) throw new Error(); setData(await res.json()) }
    catch { setError("Failed to load analytics") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (error) return <ErrorState message={error} onRetry={fetchData} />
  if (loading || !data) return <LoadingSkeleton className="h-96" />

  const maxRev = Math.max(...data.revenue_by_month.map(r => r.amount))
  const maxRes = Math.max(...data.reservations_by_day.map(r => r.count))
  const maxSource = Math.max(...data.visitors_by_source.map(s => s.count))

  return (
    <>
      <PageHeader title="Analytics" description="Business performance overview" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<CalendarCheck size={20} />} label="Total Reservations" value={data.total_reservations.toLocaleString()} growth="+12.5%" positive />
        <StatCard icon={<Users size={20} />} label="Total Guests" value={data.total_guests.toLocaleString()} growth="+8.3%" positive />
        <StatCard icon={<DollarSign size={20} />} label="Total Revenue" value={`EGP ${data.total_revenue.toLocaleString()}`} growth="+15.2%" positive />
        <StatCard icon={<Star size={20} />} label="Avg Rating" value={data.average_rating.toString()} growth="4.9 ★" positive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-[#F5F0EB]">Revenue (Monthly)</h3>
            <span className="text-[10px] text-[#6B5E56]">Last 12 months</span>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {data.revenue_by_month.map((r, i) => (
              <div key={r.month} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(r.amount / maxRev) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="w-full rounded-t-sm bg-gradient-to-t from-[#C8A45C] to-[#C8A45C]/60 hover:to-[#C8A45C] transition-colors cursor-pointer"
                  style={{ height: `${(r.amount / maxRev) * 100}%` }}
                />
                <span className="text-[8px] text-[#6B5E56]">{r.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-[#F5F0EB]">Popular Dishes</h3>
            <span className="text-[10px] text-[#6B5E56]">Top 5</span>
          </div>
          <div className="space-y-3">
            {data.popular_dishes.map((dish, i) => {
              const pct = (dish.count / data.popular_dishes[0].count) * 100
              return (
                <div key={dish.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[#D4C9C0]">{i + 1}. {dish.name}</span>
                    <span className="text-[#C8A45C] font-medium">{dish.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-full rounded-full bg-gradient-to-r from-[#C8A45C] to-[#D4A574]" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-[#F5F0EB]">Daily Reservations (14 days)</h3>
          </div>
          <div className="flex items-end gap-1 h-32">
            {data.reservations_by_day.map((d, i) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(d.count / maxRes) * 100}%` }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                  className="w-full rounded-t-sm bg-gradient-to-t from-[#3498DB] to-[#3498DB]/50"
                  style={{ height: `${(d.count / maxRes) * 100}%` }}
                />
                <span className="text-[6px] text-[#6B5E56]">{new Date(d.date).getDate()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-[#F5F0EB]">Visitor Sources</h3>
          </div>
          <div className="space-y-3">
            {data.visitors_by_source.map(source => {
              const pct = (source.count / maxSource) * 100
              return (
                <div key={source.source}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[#D4C9C0]">{source.source}</span>
                    <span className="text-[#C8A45C] font-medium">{source.count}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60]" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#F5F0EB]">Monthly Overview</h3>
          <span className="flex items-center gap-1 text-xs text-green-400"><ArrowUp size={12} /> {data.monthly_growth}% growth</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.revenue_by_month.slice(-4).map(r => (
            <div key={r.month} className="p-3 rounded-lg bg-white/[0.03]">
              <p className="text-[10px] text-[#6B5E56]">{r.month}</p>
              <p className="text-sm font-semibold text-[#F5F0EB]">EGP {r.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function StatCard({ icon, label, value, growth, positive }: { icon: React.ReactNode; label: string; value: string; growth: string; positive: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#C8A45C]/10 flex items-center justify-center text-[#C8A45C]">{icon}</div>
        <span className={`flex items-center gap-0.5 text-[10px] font-medium ${positive ? "text-green-400" : "text-red-400"}`}>{positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}{growth}</span>
      </div>
      <p className="text-xs text-[#6B5E56] mb-0.5">{label}</p>
      <p className="text-lg font-bold text-[#F5F0EB]">{value}</p>
    </motion.div>
  )
}
