import { NavItem } from "@/types/admin"

export const sidebarNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Menu", href: "/admin/menu", icon: "UtensilsCrossed" },
  { label: "Categories", href: "/admin/categories", icon: "FolderTree" },
  { label: "Gallery", href: "/admin/gallery", icon: "Image" },
  { label: "Reservations", href: "/admin/reservations", icon: "CalendarCheck" },
  { label: "Messages", href: "/admin/messages", icon: "MessageSquare" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Media", href: "/admin/media", icon: "FolderOpen" },
  { label: "Notifications", href: "/admin/notifications", icon: "Bell" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
]
