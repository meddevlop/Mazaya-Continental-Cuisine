"use client"

import { motion } from "framer-motion"
import { MenuCategory as MenuCategoryType } from "@/types"
import MenuItem from "./MenuItem"

interface MenuCategoryProps {
  category: MenuCategoryType
}

export default function MenuCategory({ category }: MenuCategoryProps) {
  return (
    <section id={category.id} className="mb-20 scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      >
        <div className="flex items-center gap-5 mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">
            {category.name}
          </h2>
          <span className="text-[#C8A45C] font-arabic text-lg mt-1">{category.nameAr}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#C8A45C]/40 to-transparent" />
        </div>
        <div className="space-y-1">
          {category.items.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <MenuItem item={item} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
