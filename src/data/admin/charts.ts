export const reservationsChartData = [
  { label: "Mon", value: 8 },
  { label: "Tue", value: 12 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 10 },
  { label: "Fri", value: 22 },
  { label: "Sat", value: 28 },
  { label: "Sun", value: 18 },
]

export const visitorsChartData = [
  { label: "Mon", value: 180 },
  { label: "Tue", value: 220 },
  { label: "Wed", value: 280 },
  { label: "Thu", value: 250 },
  { label: "Fri", value: 420 },
  { label: "Sat", value: 510 },
  { label: "Sun", value: 340 },
]

export const weeklyActivityData = [
  { label: "Week 1", value: 45 },
  { label: "Week 2", value: 52 },
  { label: "Week 3", value: 48 },
  { label: "Week 4", value: 68 },
]

export const monthlyActivityData = [
  { label: "Jan", value: 120 },
  { label: "Feb", value: 145 },
  { label: "Mar", value: 168 },
  { label: "Apr", value: 155 },
  { label: "May", value: 190 },
  { label: "Jun", value: 210 },
  { label: "Jul", value: 195 },
  { label: "Aug", value: 220 },
  { label: "Sep", value: 240 },
  { label: "Oct", value: 215 },
  { label: "Nov", value: 260 },
  { label: "Dec", value: 310 },
]

export const notificationsData = [
  {
    id: "notif-1",
    title: "New Reservation",
    description: "Table for 4 at 8:00 PM tonight",
    time: "2m ago",
    read: false,
    type: "reservation" as const,
  },
  {
    id: "notif-2",
    title: "New Message",
    description: "Catering inquiry from @sarah_m",
    time: "15m ago",
    read: false,
    type: "message" as const,
  },
  {
    id: "notif-3",
    title: "System Update",
    description: "Backup completed successfully",
    time: "1h ago",
    read: true,
    type: "system" as const,
  },
]
