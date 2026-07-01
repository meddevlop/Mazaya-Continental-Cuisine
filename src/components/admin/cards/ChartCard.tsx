"use client"

import { motion } from "framer-motion"
import { ChartData } from "@/types/admin"

interface ChartCardProps {
  title: string
  data: ChartData[]
  color?: string
  index: number
}

export default function ChartCard({ title, data, color = "#C8A45C", index }: ChartCardProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-5"
    >
      <h3 className="text-sm font-semibold text-[#F5F0EB] mb-4">{title}</h3>
      <div className="flex items-end gap-1.5 h-36">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 0.6, delay: index * 0.1 + i * 0.03 }}
              className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
              style={{
                background: `linear-gradient(to top, ${color}, ${color}88)`,
                minHeight: "4px",
              }}
            />
            <span className="text-[10px] text-[#6B5E56]">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
