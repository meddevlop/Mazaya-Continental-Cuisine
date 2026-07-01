interface BadgeProps {
  children: React.ReactNode
  variant?: "gold" | "green" | "red" | "blue" | "yellow" | "default"
  size?: "sm" | "xs"
}

const variants = {
  gold: "bg-[#C8A45C]/20 text-[#C8A45C]",
  green: "bg-green-500/20 text-green-400",
  red: "bg-red-500/20 text-red-400",
  blue: "bg-blue-500/20 text-blue-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  default: "bg-white/10 text-[#D4C9C0]",
}

export default function Badge({ children, variant = "default", size = "xs" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center ${size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"} rounded-full font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
