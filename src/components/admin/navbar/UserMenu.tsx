"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, clearUser } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/admin/api/auth", { method: "DELETE" })
    clearUser()
    router.push("/admin/login")
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#C8A45C]/20 border border-[#C8A45C]/30 flex items-center justify-center">
          <span className="text-[#C8A45C] text-sm font-semibold">
            {user?.name?.charAt(0) || "A"}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-[#C8A45C] leading-tight">{user?.name || "Admin"}</p>
          <p className="text-[10px] text-[#6B5E56] capitalize">{user?.role || "admin"}</p>
        </div>
        <ChevronDown size={14} className="text-[#6B5E56] hidden md:block" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
