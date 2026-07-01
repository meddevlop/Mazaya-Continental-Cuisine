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

export default function FeaturedDishes({ dishes }: FeaturedDishesProps) {
  const items = dishes.length > 0 ? dishes : [
    { name: "Featured Dish", description: "Coming soon", image: "" },
    { name: "Featured Dish", description: "Coming soon", image: "" },
    { name: "Featured Dish", description: "Coming soon", image: "" },
    { name: "Featured Dish", description: "Coming soon", image: "" },
  ]

  return (
    <section className="py-20 md:py-28 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Featured Dishes"
          titleAr="أطباق مميزة"
          subtitle="Our signature creations crafted with the finest ingredients"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((dish, index) => (
            <AnimatedSection key={dish.name + index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#E8E0D8]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#D4C9C0] text-sm">
                    {dish.image ? (
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E8E0D8]" />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                    <h3 className="text-[#F5F0EB] font-serif text-lg font-bold">{dish.name}</h3>
                    <p className="text-[#D4C9C0] text-sm mt-1">{dish.description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}