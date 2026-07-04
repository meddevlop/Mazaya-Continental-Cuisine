"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Bell, CalendarCheck, MessageSquare, Info, Star, CheckCheck, Loader2, ArrowRight } from "lucide-react"
import PageHeader from "@/components/admin/ui/PageHeader"
import EmptyState from "@/components/admin/ui/EmptyState"
import ErrorState from "@/components/admin/ui/ErrorState"
import { Badge } from "@/components/admin/ui"
import { useRouter } from "next/navigation"

interface Notification {
  id: string; type: "reservation" | "message" | "system" | "review"
  title: string; description: string; time: string; read: boolean
  actionable: boolean; actionLabel?: string; actionHref?: string
}

const typeIcons = {
  reservation: CalendarCheck, message: MessageSquare, system: Info, review: Star,
}

const typeColors = {
  reservation: "text-blue-400 bg-blue-500/10",
  message: "text-green-400 bg-green-500/10",
  system: "text-[#6B5E56] bg-white/5",
  review: "text-yellow-400 bg-yellow-500/10",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [markingAll, setMarkingAll] = useState(false)
  const router = useRouter()

  const fetchData = useCallback(async () => {
    try { const res = await fetch("/admin/api/notifications"); if (!res.ok) throw new Error(); setNotifications(await res.json()) }
    catch { setError("Failed to load") }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const markAllRead = async () => {
    setMarkingAll(true)
    try { await fetch("/admin/api/notifications", { method: "PATCH" }); fetchData() }
    finally { setMarkingAll(false) }
  }

  const markRead = async (id: string) => {
    await fetch(`/admin/api/notifications/${id}`, { method: "PATCH" })
    fetchData()
  }

  const filtered = filter === "unread" ? notifications.filter(n => !n.read) : notifications

  const formatTime = (t: string) => {
    const diff = Date.now() - new Date(t).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <>
      <PageHeader
        title="Notifications" description="Stay updated with activity"
        action={
          notifications.some(n => !n.read) ? (
            <button onClick={markAllRead} disabled={markingAll} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-[#D4C9C0] text-sm hover:bg-white/5 disabled:opacity-50">
              {markingAll ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />} Mark All Read
            </button>
          ) : undefined
        }
      />

      <div className="flex gap-2 mb-6">
        {(["all", "unread"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? "bg-[#C8A45C] text-[#1A1A1A]" : "bg-white/5 text-[#6B5E56] hover:bg-white/10"}`}>
            {f} {f === "unread" && `(${notifications.filter(n => !n.read).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Bell size={28} />} title="No notifications" description={filter === "unread" ? "All caught up!" : "No notifications yet"} />
      ) : (
        <div className="space-y-2">
          {filtered.map((n, i) => {
            const Icon = typeIcons[n.type]
            return (
              <motion.div
                key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => { if (!n.read) markRead(n.id) }}
                className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                  n.read ? "bg-gradient-to-br from-[#111] to-[#0D0D0D] border-white/[0.06]" : "bg-[#C8A45C]/[0.03] border-[#C8A45C]/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[n.type]}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className={`text-sm ${n.read ? "text-[#D4C9C0]" : "text-[#F5F0EB] font-semibold"}`}>{n.title}</h4>
                        <p className="text-xs text-[#6B5E56] mt-0.5">{n.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!n.read && <span className="w-2 h-2 rounded-full bg-[#C8A45C]" />}
                        <span className="text-[10px] text-[#6B5E56] whitespace-nowrap">{formatTime(n.time)}</span>
                      </div>
                    </div>
                    {n.actionable && n.actionHref && (
                      <button onClick={e => { e.stopPropagation(); router.push(n.actionHref!) }} className="flex items-center gap-1 text-xs text-[#C8A45C] hover:underline mt-2">
                        {n.actionLabel} <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </>
  )
}
