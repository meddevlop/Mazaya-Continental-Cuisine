"use client"

import { CalendarCheck, Clock, UtensilsCrossed, Image, MessageSquare, Users, DollarSign, Star } from "lucide-react"
import StatCard from "../cards/StatCard"

interface DashboardStats {
  todayReservations: number
  pendingReservations: number
  totalMenuItems: number
  totalGallery: number
  unreadMessages: number
  totalReservations: number
}

interface StatCardsGridProps {
  stats: DashboardStats | null
}

const statConfig = [
  { id: "today-reservations", label: "Today's Reservations", key: "todayReservations" as const, icon: "CalendarCheck" },
  { id: "pending-reservations", label: "Pending Reservations", key: "pendingReservations" as const, icon: "Clock" },
  { id: "menu-items", label: "Menu Items", key: "totalMenuItems" as const, icon: "UtensilsCrossed" },
  { id: "gallery-images", label: "Gallery Images", key: "totalGallery" as const, icon: "Image" },
  { id: "unread-messages", label: "Unread Messages", key: "unreadMessages" as const, icon: "MessageSquare" },
  { id: "total-reservations", label: "Total Reservations", key: "totalReservations" as const, icon: "Users" },
]

export default function StatCardsGrid({ stats }: StatCardsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {statConfig.map((stat, index) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stats?.[stat.key]?.toLocaleString() ?? "0"}
          growth="—"
          trend="neutral"
          icon={stat.icon}
          index={index}
        />
      ))}
    </div>
  )
}
