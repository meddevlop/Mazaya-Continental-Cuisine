"use client"

import { useEffect } from "react"
import Sidebar from "@/components/admin/sidebar/Sidebar"
import TopNavbar from "@/components/admin/navbar/TopNavbar"
import { motion } from "framer-motion"
import { useSidebarStore } from "@/store/sidebarStore"
import { useAuthStore } from "@/store/authStore"
import { ToastProvider } from "@/components/admin/ui"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isCollapsed } = useSidebarStore()
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <TopNavbar />
        <ToastProvider>
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6 lg:p-8 pb-24"
          >
            {children}
          </motion.main>
        </ToastProvider>
      </div>
    </div>
  )
}
