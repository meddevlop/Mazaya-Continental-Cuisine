"use client"

import { motion } from "framer-motion"
import { MenuCategory as MenuCategoryType } from "@/types"
import MenuItem from "./MenuItem"

interface MenuCategoryProps {
  category: MenuCategoryType
}

export default function MenuCategory({ category }: MenuCategoryProps) {
  return (
    <section id={category.id} className="mb-16 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2C2420]">
            {category.name}
          </h2>
          <span className="text-[#C8A45C] font-arabic text-lg">{category.nameAr}</span>
          <div className="flex-1 h-px bg-[#C8A45C]/30" />
        </div>
        <div>
          {category.items.map((item) => (
            <MenuItem key={item.name} item={item} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
