"use client"

import { motion } from "framer-motion"
import * as Icons from "lucide-react"

interface QuickActionCardProps {
  icon: string
  label: string
  description: string
  onClick?: () => void
  index: number
}

export default function QuickActionCard({ icon, label, description, onClick, index }: QuickActionCardProps) {
  const Icon = (Icons as any)[icon] || Icons.Circle

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] hover:border-[#C8A45C]/20 hover:shadow-[0_0_20px_rgba(200,164,92,0.05)] transition-all duration-300 text-left w-full group"
    >
      <div className="w-10 h-10 rounded-lg bg-[#C8A45C]/10 flex items-center justify-center group-hover:bg-[#C8A45C]/20 transition-colors flex-shrink-0">
        <Icon size={20} className="text-[#C8A45C]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#F5F0EB]">{label}</p>
        <p className="text-xs text-[#6B5E56] truncate">{description}</p>
      </div>
    </motion.button>
  )
}
