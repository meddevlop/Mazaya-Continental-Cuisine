"use client"

import { motion } from "framer-motion"
import { CalendarDays, Plus, Upload, UtensilsCrossed } from "lucide-react"
import PageHeader from "../ui/PageHeader"
import { formatDate } from "@/lib/adminUtils"

export default function WelcomeSection() {
  const today = formatDate(new Date())

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="Welcome back, Admin"
        description={today}
      />

      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { label: "Add Menu Item", icon: Plus, desc: "New dish" },
          { label: "New Reservation", icon: CalendarDays, desc: "Manual booking" },
          { label: "Upload Image", icon: Upload, desc: "Gallery" },
          { label: "Manage Menu", icon: UtensilsCrossed, desc: "Categories" },
        ].map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            whileHover={{ y: -2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8A45C]/10 border border-[#C8A45C]/20 text-[#C8A45C] hover:bg-[#C8A45C]/20 transition-all text-sm font-medium"
          >
            <action.icon size={16} />
            <span>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
