"use client"

import { dashboardStats } from "@/data/admin/stats"
import StatCard from "../cards/StatCard"

export default function StatCardsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {dashboardStats.map((stat, index) => (
        <StatCard key={stat.id} {...stat} index={index} />
      ))}
    </div>
  )
}
