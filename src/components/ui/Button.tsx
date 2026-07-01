"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  as?: "button" | "a"
  href?: string
}

const variants = {
  primary: "bg-[#C8A45C] text-[#1A1A1A] hover:bg-[#B8933D]",
  secondary: "bg-[#1A1A1A] text-[#F5F0EB] hover:bg-[#2C2420] border border-[#C8A45C]",
  outline: "border-2 border-[#F5F0EB] text-[#F5F0EB] hover:bg-[#F5F0EB] hover:text-[#1A1A1A]",
  ghost: "text-[#F5F0EB] hover:text-[#C8A45C]",
}

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-semibold transition-all duration-300 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button
