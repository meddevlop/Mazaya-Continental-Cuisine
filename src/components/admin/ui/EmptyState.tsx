import { PackageOpen } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        {icon || <PackageOpen size={28} className="text-[#6B5E56]" />}
      </div>
      <h3 className="text-lg font-semibold text-[#F5F0EB] mb-1">{title}</h3>
      <p className="text-sm text-[#6B5E56] text-center max-w-xs mb-4">{description}</p>
      {action}
    </div>
  )
}
