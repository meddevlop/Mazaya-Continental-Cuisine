"use client"

import { motion } from "framer-motion"
import { Clock, MessageSquare, Image, UtensilsCrossed, LogIn, CalendarCheck } from "lucide-react"
import { recentActivities } from "@/data/admin/activities"
import { formatTimeAgo } from "@/lib/adminUtils"

const activityIcons = {
  reservation: CalendarCheck,
  message: MessageSquare,
  image: Image,
  menu: UtensilsCrossed,
  login: LogIn,
}

const activityColors = {
  reservation: "text-green-400 bg-green-400/10",
  message: "text-[#C8A45C] bg-[#C8A45C]/10",
  image: "text-blue-400 bg-blue-400/10",
  menu: "text-purple-400 bg-purple-400/10",
  login: "text-orange-400 bg-orange-400/10",
}

export default function RecentActivity() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] p-5 mb-8">
      <h3 className="text-sm font-semibold text-[#F5F0EB] mb-4">Recent Activity</h3>
      <div className="space-y-1">
        {recentActivities.map((activity, i) => {
          const Icon = activityIcons[activity.type]
          const color = activityColors[activity.type]

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#F5F0EB]">{activity.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-[#6B5E56]">{activity.user}</span>
                  <span className="text-[#6B5E56]">•</span>
                  <span className="text-[10px] text-[#6B5E56] flex items-center gap-1">
                    <Clock size={10} /> {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
