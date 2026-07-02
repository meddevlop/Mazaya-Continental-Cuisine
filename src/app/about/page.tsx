"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import AnimatedSection from "@/components/ui/AnimatedSection"
import SectionTitle from "@/components/ui/SectionTitle"
import { business } from "@/data/business"
import { Award, ChefHat, Heart, Users, Quote } from "lucide-react"

interface Settings {
  name: string; nameAr: string
}

const values = [
  {
    icon: ChefHat,
    title: "Expert Chefs",
    description: "Our talented chefs bring years of experience and passion to every dish",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "We source only the finest Australian lamb and freshest ingredients",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every dish is crafted with care, tradition, and authentic flavors",
  },
  {
    icon: Users,
    title: "Family Experience",
    description: "A warm, welcoming atmosphere for families and friends to gather",
  },
]

export default function AboutPage() {
  const [settings, setSettings] = useState({ name: business.name, nameAr: business.nameAr })

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data.restaurant_name) setSettings({ name: data.restaurant_name, nameAr: data.restaurant_name_ar || business.nameAr })
    }).catch(() => {})
  }, [])

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
            {settings.nameAr}
          </motion.p>
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F5F0EB] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            About Us
          </motion.h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-24">
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E8E0D8] to-[#D4C9C0]">
                    <Image
                      src="/images/dishes/about.jpg"
                      alt="About Mazaya"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 border border-[#C8A45C]/10" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#C8A45C]/20 hidden lg:block" />
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.15}>
              <Quote size={36} className="text-[#C8A45C]/20 mb-2" />
              <SectionTitle title="Our Story" titleAr="قصتنا" center={false} />
              <div className="space-y-5 text-[#6B5E56] leading-relaxed">
                <p>
                  Welcome to <strong>{settings.name}</strong>, where the rich traditions of Middle Eastern
                  cuisine meet contemporary Continental elegance. Located in the vibrant heart of Dubai,
                  we have been delighting guests with our unique culinary vision.
                </p>
                <p>
                  Our journey began with a simple belief: great food brings people together. Every dish
                  on our menu tells a story of heritage, innovation, and an unwavering commitment to quality.
                  From our signature mixed grills to our aromatic mansaf and handmade kibbeh, we take pride
                  in delivering an authentic dining experience that honors tradition while embracing modernity.
                </p>
                <p>
                  At Mazaya, we believe that dining is an art form. Our elegant ambiance, attentive service,
                  and meticulously crafted menu create the perfect setting for every occasion.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1} direction="up">
                <motion.div
                  whileHover={{ y: -8 }}
                  className="text-center p-10 bg-white border border-[#E8E0D8]/60 hover:border-[#C8A45C]/20 hover:shadow-xl transition-all duration-500 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#C8A45C]/10 to-[#D4B87A]/5 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:from-[#C8A45C]/20 group-hover:to-[#D4B87A]/10 transition-all duration-500">
                    <value.icon size={30} className="text-[#C8A45C]" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#111111] mb-3">{value.title}</h3>
                  <p className="text-[#6B5E56] text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
