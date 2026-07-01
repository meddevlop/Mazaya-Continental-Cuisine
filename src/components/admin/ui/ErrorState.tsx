"use client"

import { AlertTriangle, RotateCcw } from "lucide-react"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-[#F5F0EB] mb-1">{title}</h3>
      <p className="text-sm text-[#6B5E56] text-center max-w-xs mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8A45C]/10 text-[#C8A45C] hover:bg-[#C8A45C]/20 transition-colors text-sm font-medium"
        >
          <RotateCcw size={14} />
          Try Again
        </button>
      )}
    </div>
  )
}
