"use client"

import { Search } from "lucide-react"
import { useState } from "react"

export default function SearchBox() {
  const [focused, setFocused] = useState(false)

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        focused
          ? "bg-white/10 border border-[#C8A45C]/30 shadow-[0_0_15px_rgba(200,164,92,0.08)]"
          : "bg-white/5 border border-transparent"
      }`}
    >
      <Search size={16} className="text-[#6B5E56]" />
      <input
        type="text"
        placeholder="Search..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="bg-transparent text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] outline-none w-36 md:w-48"
      />
    </div>
  )
}
