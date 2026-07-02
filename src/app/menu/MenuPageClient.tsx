"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { menuCategories as hardcodedCategories } from "@/data/menu"
import MenuNavigation from "@/components/menu/MenuNavigation"
import MenuCategory from "@/components/menu/MenuCategory"
import AnimatedSection from "@/components/ui/AnimatedSection"
import { business } from "@/data/business"
import LoadingSkeleton from "@/components/admin/ui/LoadingSkeleton"
import type { MenuCategory as MenuCategoryType } from "@/types"

export default function MenuPageClient() {
  const [categories, setCategories] = useState<MenuCategoryType[]>(hardcodedCategories)
  const [loading, setLoading] = useState(true)
  const [nameAr, setNameAr] = useState(business.nameAr)

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data.restaurant_name_ar) setNameAr(data.restaurant_name_ar)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, menuRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/menu"),
        ])
        if (!catRes.ok || !menuRes.ok) throw new Error()
        const cats = await catRes.json()
        const items = await menuRes.json()
        if (cats.length > 0 && items.length > 0) {
          const grouped: MenuCategoryType[] = cats.map((c: any) => ({
            id: c.id,
            name: c.name,
            nameAr: c.name_ar || "",
            items: items
              .filter((i: any) => i.category_id === c.id)
              .sort((a: any, b: any) => a.sort_order - b.sort_order)
              .map((i: any) => ({
                name: i.name,
                nameAr: i.name_ar || undefined,
                description: i.description || undefined,
                price: i.price,
                isBestSeller: i.is_popular || false,
              })),
          })).filter((c: MenuCategoryType) => c.items.length > 0)
          if (grouped.length > 0) setCategories(grouped)
        }
      } catch { /* fallback to hardcoded */ }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="bg-[#FAFAF8] min-h-screen">
        <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-[#111111]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSkeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-[#111111] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#111111]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A45C]/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            className="text-[#C8A45C] text-xs uppercase tracking-[0.35em] mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {nameAr}
          </motion.p>
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F5F0EB] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Our Menu
          </motion.h1>
          <motion.p
            className="text-[#9B8B80] mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            A curated selection of Continental and Middle Eastern dishes, crafted with the finest ingredients
          </motion.p>
        </div>
      </section>

      <MenuNavigation categories={categories} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.map((category) => (
          <MenuCategory key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
