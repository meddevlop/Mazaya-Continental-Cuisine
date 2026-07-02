"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/ui/AnimatedSection"

interface DishData {
  name: string
  description: string
  image: string
}

interface FeaturedDishesProps {
  dishes: DishData[]
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
}

export default function FeaturedDishes({ dishes }: FeaturedDishesProps) {
  const items = dishes.length > 0 ? dishes : [
    { name: "Featured Dish", description: "Coming soon", image: "" },
    { name: "Featured Dish", description: "Coming soon", image: "" },
    { name: "Featured Dish", description: "Coming soon", image: "" },
    { name: "Featured Dish", description: "Coming soon", image: "" },
  ]

  return (
    <section className="py-24 md:py-32 bg-[#FAFAF8] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent pointer-events-none" />
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
                <div className="relative aspect-[4/5] overflow-hidden bg-[#E8E0D8]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                  <div className="absolute inset-0">
                    {dish.image ? (
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#E8E0D8] to-[#D4C9C0]" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                  <div className="absolute bottom-0 left-0 right-0 z-30 p-6 md:p-7">
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
