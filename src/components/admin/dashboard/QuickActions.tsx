"use client"

import { useRouter } from "next/navigation"
import QuickActionCard from "../cards/QuickActionCard"

const actions = [
  { icon: "UtensilsCrossed", label: "Add Menu Item", description: "Create a new dish with pricing", href: "/admin/reservations" },
  { icon: "Image", label: "Upload Images", description: "Add gallery or dish photos", href: "/admin/gallery" },
  { icon: "ListTree", label: "Manage Menu", description: "Organize menu items and categories", href: "/admin/menu" },
  { icon: "CalendarCheck", label: "Manage Reservations", description: "View and manage bookings", href: "/admin/reservations" },
  { icon: "Settings", label: "Open Settings", description: "Configure restaurant settings", href: "/admin/settings" },
]

export default function QuickActions() {
  const router = useRouter()

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#F5F0EB] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <QuickActionCard key={action.label} {...action} index={index} onClick={() => router.push(action.href)} />
        ))}
      </div>
    </div>
  )
}
