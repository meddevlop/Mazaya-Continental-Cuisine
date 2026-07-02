"use client"

import { ButtonHTMLAttributes, forwardRef, useState, useRef } from "react"
import { motion } from "framer-motion"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  as?: "button" | "a"
  href?: string
}

const variants = {
  primary:
    "bg-gradient-to-r from-[#C8A45C] to-[#D4B87A] text-[#111111] hover:from-[#B8933D] hover:to-[#C8A45C] shadow-[0_4px_20px_rgba(200,164,92,0.3)] hover:shadow-[0_6px_30px_rgba(200,164,92,0.4)]",
  secondary:
    "bg-[#111111] text-[#F5F0EB] hover:bg-[#1A1A1A] border border-[#C8A45C]/30 hover:border-[#C8A45C]/60",
  outline:
    "border border-[#F5F0EB]/30 text-[#F5F0EB] hover:bg-white/10 hover:border-[#F5F0EB]/60 backdrop-blur-sm",
  ghost: "text-[#D4C9C0] hover:text-[#C8A45C] hover:bg-white/5",
}

const sizes = {
  sm: "px-5 py-2 text-xs tracking-widest",
  md: "px-7 py-3 text-sm tracking-wider",
  lg: "px-10 py-4 text-sm tracking-wider",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
    const btnRef = useRef<HTMLButtonElement>(null)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = btnRef.current?.getBoundingClientRect()
      if (rect) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = Date.now()
        setRipples((prev) => [...prev, { x, y, id }])
        setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 1000)
      }
      onClick?.(e)
    }

    return (
      <button
        ref={(el) => {
          if (typeof ref === "function") ref(el)
          else if (ref) ref.current = el
          ;(btnRef as any).current = el
        }}
        className={`relative overflow-hidden inline-flex items-center justify-center font-semibold transition-all duration-500 cursor-pointer uppercase ${variants[variant]} ${sizes[size]} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full bg-white/30 animate-[ripple_1s_ease-out] pointer-events-none"
            style={{
              left: r.x - 10,
              top: r.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <motion.span
          className="absolute inset-0 bg-white/5"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button
