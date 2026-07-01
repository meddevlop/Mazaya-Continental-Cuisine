"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { notificationsData } from "@/data/admin/charts"

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const unread = notificationsData.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-[#6B5E56] hover:text-[#F5F0EB] hover:bg-white/5 transition-colors"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8A45C] text-[#1A1A1A] text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 top-full mt-2 w-80 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-[#F5F0EB]">Notifications</h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notificationsData.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer ${
                      !notif.read ? "bg-[#C8A45C]/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notif.type === "reservation" ? "bg-green-400" :
                        notif.type === "message" ? "bg-[#C8A45C]" : "bg-blue-400"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#F5F0EB]">{notif.title}</p>
                        <p className="text-xs text-[#6B5E56] truncate">{notif.description}</p>
                        <p className="text-[10px] text-[#6B5E56] mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
