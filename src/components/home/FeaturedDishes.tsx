"use client"

import { motion } from "framer-motion"
import SectionTitle from "@/components/ui/SectionTitle"

interface DishData {
  name: string
  description: string
}

interface FeaturedDishesProps {
  dishes: DishData[]
  dishImages?: (string | undefined)[]
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
}

export default function FeaturedDishes({ dishes, dishImages }: FeaturedDishesProps) {
  const items = dishes.length > 0 ? dishes : [
    { name: "Featured Dish", description: "Coming soon" },
    { name: "Featured Dish", description: "Coming soon" },
    { name: "Featured Dish", description: "Coming soon" },
    { name: "Featured Dish", description: "Coming soon" },
  ]

  return (
    <section className="py-24 md:py-32 bg-[#FAFAF8] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Featured Dishes"
          titleAr="أطباق مميزة"
          subtitle="Our signature creations crafted with the finest ingredients"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((dish, index) => (
            <motion.div
              key={dish.name + index}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.div
                whileHover={{ y: -12 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/[0.06]">
                  {dishImages?.[index] ? (
                    <img
                      src={dishImages[index]!}
                      alt={dish.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                    <h3 className="text-[#F5F0EB] font-serif text-xl md:text-2xl font-bold mb-1">{dish.name}</h3>
                    <div className="w-8 h-0.5 bg-[#C8A45C] mb-2" />
                    <p className="text-[#D4C9C0]/80 text-sm leading-relaxed">{dish.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
