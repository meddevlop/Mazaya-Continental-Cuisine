"use client"

import { useState, useEffect } from "react"
import { MenuCategory } from "@/types"

interface MenuNavigationProps {
  categories: MenuCategory[]
}

export default function MenuNavigation({ categories }: MenuNavigationProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-30% 0px -70% 0px" }
    )

    categories.forEach((cat) => {
      const el = document.getElementById(cat.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [categories])

  return (
    <nav className="sticky top-20 z-30 bg-[#FAFAF8] border-b border-[#E8E0D8] overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex gap-0 py-3 min-w-max">
          {categories.map((cat) => (
            <li key={cat.id}>
              <a
                href={`#${cat.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(cat.id)
                  if (el) {
                    const offset = 100
                    const top = el.getBoundingClientRect().top + window.scrollY - offset
                    window.scrollTo({ top, behavior: "smooth" })
                  }
                }}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap border-b-2 ${
                  activeId === cat.id
                    ? "border-[#C8A45C] text-[#C8A45C]"
                    : "border-transparent text-[#6B5E56] hover:text-[#2C2420]"
                }`}
              >
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
