"use client"

import { useState, useRef, useEffect } from "react"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

const presetColors = [
  "#C8A45C", "#E8B830", "#D4A574", "#B8860B",
  "#FF6B6B", "#E74C3C", "#FF8C42", "#F39C12",
  "#2ECC71", "#27AE60", "#1ABC9C", "#16A085",
  "#3498DB", "#2980B9", "#9B59B6", "#8E44AD",
  "#34495E", "#2C3E50", "#95A5A6", "#7F8C8D",
]

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-xs text-[#D4C9C0] mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
      >
        <div className="w-6 h-6 rounded-md border border-white/10" style={{ backgroundColor: value }} />
        <span className="text-xs text-[#D4C9C0] font-mono">{value}</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 p-3 rounded-xl bg-[#111] border border-white/[0.06] shadow-2xl z-20">
          <div className="grid grid-cols-10 gap-1.5 mb-3">
            {presetColors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => { onChange(color); setOpen(false) }}
                className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 ${
                  value === color ? "border-white scale-110" : "border-white/10"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#6B5E56]">Custom:</span>
            <input
              type="color"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>
        </div>
      )}
    </div>
  )
}
