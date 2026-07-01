export default function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-full w-full rounded-xl bg-white/5 border border-white/5" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl bg-[#111] border border-white/5 p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-3 w-24 bg-white/10 rounded" />
          <div className="h-7 w-16 bg-white/10 rounded" />
          <div className="h-3 w-14 bg-white/5 rounded" />
        </div>
        <div className="h-10 w-10 rounded-lg bg-white/5" />
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl bg-[#111] border border-white/5 p-5 animate-pulse">
      <div className="h-4 w-32 bg-white/10 rounded mb-4" />
      <div className="h-48 w-full bg-white/5 rounded" />
    </div>
  )
}
