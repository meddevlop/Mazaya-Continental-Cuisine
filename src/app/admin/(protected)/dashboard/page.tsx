"use client"

import { useState, useEffect, useCallback } from "react"
import StatCardsGrid from "@/components/admin/dashboard/StatCardsGrid"
import PageHeader from "@/components/admin/ui/PageHeader"

interface DashboardStats {
  todayReservations: number
  pendingReservations: number
  totalMenuItems: number
  totalGallery: number
  unreadMessages: number
  totalReservations: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/admin/api/dashboard")
      if (res.ok) setStats(await res.json())
    } catch {}
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your restaurant" />
      <StatCardsGrid stats={stats} />
    </>
  )
}
