"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { NavItem } from "@/types/admin"

interface SidebarItemProps {
  item: NavItem
  collapsed: boolean
}

export default function SidebarItem({ item, collapsed }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === item.href
  const Icon = (Icons as any)[item.icon] || Icons.Circle

  if (item.disabled) {
    return (
      <div className={`relative group ${collapsed ? "flex justify-center" : ""}`}>
        <div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-not-allowed
            text-[#6B5E56] transition-colors duration-200 ${collapsed ? "justify-center w-10 h-10" : ""}`}
        >
          <Icon size={20} />
          {!collapsed && (
            <>
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#6B5E56] font-medium">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
        {collapsed && (
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#1A1A1A] border border-white/10 rounded text-xs text-[#F5F0EB] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {item.label} <span className="text-[#6B5E56]">({item.badge})</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <Link href={item.href} className={`relative group ${collapsed ? "flex justify-center" : "block"}`}>
      <motion.div
        whileHover={{ x: 2 }}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
          ${isActive
            ? "bg-[#C8A45C]/10 text-[#C8A45C] border border-[#C8A45C]/20"
            : "text-[#D4C9C0] hover:text-[#F5F0EB] hover:bg-white/5"
          }
          ${collapsed ? "justify-center w-10 h-10" : ""}`}
      >
        <Icon size={20} />
        {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
      </motion.div>
      {isActive && !collapsed && (
        <motion.div
          layoutId="activeNav"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#C8A45C] rounded-full"
        />
      )}
      {collapsed && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#1A1A1A] border border-white/10 rounded text-xs text-[#F5F0EB] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          {item.label}
        </div>
      )}
    </Link>
  )
}
