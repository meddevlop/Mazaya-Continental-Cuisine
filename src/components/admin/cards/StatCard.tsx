"use client"

import { motion } from "framer-motion"
import * as Icons from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  growth: string
  trend: "up" | "down" | "neutral"
  icon: string
  index: number
}

export default function StatCard({ label, value, growth, trend, icon, index }: StatCardProps) {
  const Icon = (Icons as any)[icon] || Icons.Circle
  const isUp = trend === "up"
  const isNeutral = trend === "neutral"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-5 hover:border-[#C8A45C]/20 hover:shadow-[0_0_30px_rgba(200,164,92,0.06)] transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#6B5E56] uppercase tracking-wider">{label}</p>
          <p className="text-2xl md:text-3xl font-bold text-[#F5F0EB]">{value}</p>
          <div className="flex items-center gap-1">
            {!isNeutral && (
              <>
                <span className={`text-xs font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
                  {growth}
                </span>
                <span className="text-[10px] text-[#6B5E56]">vs last month</span>
              </>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#C8A45C]/10 flex items-center justify-center group-hover:bg-[#C8A45C]/20 transition-colors">
          <Icon size={20} className="text-[#C8A45C]" />
        </div>
      </div>
    </motion.div>
  )
}
