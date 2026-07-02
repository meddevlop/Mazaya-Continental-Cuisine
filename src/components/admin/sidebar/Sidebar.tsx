"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, PanelRightClose, LogOut } from "lucide-react"
import { useSidebarStore } from "@/store/sidebarStore"
import { sidebarNavItems } from "@/data/admin/navigation"
import SidebarItem from "./SidebarItem"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const { isCollapsed, toggleCollapse, isMobileOpen, closeMobile } = useSidebarStore()
  const { clearUser } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/admin/api/auth", { method: "DELETE" })
    clearUser()
    router.push("/")
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/5">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#C8A45C] flex items-center justify-center text-[#1A1A1A] font-bold text-sm">
              M
            </div>
            <span className="text-[#F5F0EB] font-semibold text-sm">Admin</span>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-[#C8A45C] flex items-center justify-center text-[#1A1A1A] font-bold text-sm mx-auto">
            M
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {sidebarNavItems.map((item) => (
          <SidebarItem key={item.href} item={item} collapsed={isCollapsed} />
        ))}
      </nav>

      <div className="border-t border-white/5 p-2">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#6B5E56] hover:text-red-400 hover:bg-red-500/5 transition-colors w-full text-sm ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>

        <button
          onClick={toggleCollapse}
          className="hidden lg:flex items-center justify-center w-full mt-1 py-2 rounded-lg text-[#6B5E56] hover:text-[#F5F0EB] hover:bg-white/5 transition-colors"
        >
          <ChevronLeft size={16} className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-[#0A0A0A] border-r border-white/5 z-40 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 h-screen w-72 bg-[#0A0A0A] border-r border-white/5 z-50 lg:hidden"
            >
              <button onClick={closeMobile} className="absolute top-3 right-3 text-[#6B5E56] hover:text-[#F5F0EB] p-1">
                <PanelRightClose size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
