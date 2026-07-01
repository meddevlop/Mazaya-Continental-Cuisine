"use client"

import ChartCard from "../cards/ChartCard"
import { reservationsChartData, visitorsChartData, weeklyActivityData, monthlyActivityData } from "@/data/admin/charts"

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <ChartCard title="Reservations (This Week)" data={reservationsChartData} color="#C8A45C" index={0} />
      <ChartCard title="Website Visitors" data={visitorsChartData} color="#22C55E" index={1} />
      <ChartCard title="Weekly Activity" data={weeklyActivityData} color="#3B82F6" index={2} />
      <ChartCard title="Monthly Activity" data={monthlyActivityData} color="#A855F7" index={3} />
    </div>
  )
}
