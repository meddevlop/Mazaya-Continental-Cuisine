export type AdminRole = "admin" | "manager" | "editor"

export interface AdminUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: AdminRole
}

export interface SessionPayload {
  userId: string
  role: AdminRole
  issuedAt: number
  expiresAt: number
}

export interface DashboardStat {
  id: string
  label: string
  value: string | number
  growth: string
  trend: "up" | "down" | "neutral"
  icon: string
}

export interface Activity {
  id: string
  type: "reservation" | "message" | "image" | "menu" | "login"
  description: string
  timestamp: string
  user: string
}

export interface ChartData {
  label: string
  value: number
}

export interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "reservation" | "message" | "system"
}

export interface NavItem {
  label: string
  href: string
  icon: string
  disabled?: boolean
  badge?: string
  requiredRole?: AdminRole
}
