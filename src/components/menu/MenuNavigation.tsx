"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
    <motion.nav
      className="sticky top-0 md:top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E8E0D8]/60 overflow-x-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex gap-0 py-4 min-w-max">
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
                className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                  activeId === cat.id
                    ? "text-[#C8A45C]"
                    : "text-[#6B5E56] hover:text-[#111111]"
                }`}
              >
                {cat.name}
                {activeId === cat.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C8A45C]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  )
}
