"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { useSidebarStore } from "@/store/sidebarStore"
import { business } from "@/data/business"
import SearchBox from "./SearchBox"
import NotificationBell from "./NotificationBell"
import UserMenu from "./UserMenu"

export default function TopNavbar() {
  const { openMobile } = useSidebarStore()
  const [name, setName] = useState(business.name)

  useEffect(() => {
    fetch("/admin/api/settings").then(r => r.json()).then(data => {
      if (data.restaurant_name) setName(data.restaurant_name)
    }).catch(() => {})
  }, [])

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={openMobile}
            className="lg:hidden p-2 rounded-lg text-[#6B5E56] hover:text-[#F5F0EB] hover:bg-white/5 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-sm font-semibold text-[#F5F0EB] hidden md:block">
            {name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <SearchBox />
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
