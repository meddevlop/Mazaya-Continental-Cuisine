import { Activity } from "@/types/admin"

export const recentActivities: Activity[] = [
  {
    id: "act-1",
    type: "reservation",
    description: "New reservation for 4 guests at 8:00 PM",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    user: "System",
  },
  {
    id: "act-2",
    type: "message",
    description: "New inquiry from Instagram about catering",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    user: "Sarah M.",
  },
  {
    id: "act-3",
    type: "image",
    description: "New gallery image uploaded: Mixed Grill Platter",
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    user: "Admin",
  },
  {
    id: "act-4",
    type: "menu",
    description: "Menu item 'Lamb Chops' price updated",
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    user: "Admin",
  },
  {
    id: "act-5",
    type: "reservation",
    description: "Reservation #1042 confirmed for 6 guests",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    user: "System",
  },
  {
    id: "act-6",
    type: "login",
    description: "Admin login from Dubai, UAE",
    timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
    user: "Ahmed A.",
  },
]
