"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

export default function Pagination({ current, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] mt-4">
      <p className="text-xs text-[#6B5E56]">
        Showing {Math.min((current - 1) * pageSize + 1, total)}–{Math.min(current * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current <= 1}
          className="p-1.5 rounded-lg text-[#6B5E56] hover:text-[#F5F0EB] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - current) <= 1)
          .map((p, idx, arr) => (
            <span key={p} className="flex items-center">
              {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-[#6B5E56] text-xs">...</span>}
              <button
                onClick={() => onChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  p === current ? "bg-[#C8A45C] text-[#1A1A1A]" : "text-[#6B5E56] hover:text-[#F5F0EB] hover:bg-white/5"
                }`}
              >
                {p}
              </button>
            </span>
          ))}
        <button
          onClick={() => onChange(current + 1)}
          disabled={current >= totalPages}
          className="p-1.5 rounded-lg text-[#6B5E56] hover:text-[#F5F0EB] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
