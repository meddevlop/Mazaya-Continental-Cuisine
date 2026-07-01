"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import AnimatedSection from "@/components/ui/AnimatedSection"
import SectionTitle from "@/components/ui/SectionTitle"
import { business } from "@/data/business"
import { Award, ChefHat, Heart, Users } from "lucide-react"

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
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C8A45C] text-sm uppercase tracking-[0.3em] mb-2">{settings.nameAr}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5F0EB]">
            About Us
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <AnimatedSection>
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-[#E8E0D8] flex items-center justify-center text-[#D4C9C0] text-sm">
                  <Image
                    src="/images/dishes/about.jpg"
                    alt="About Mazaya"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <SectionTitle title="Our Story" titleAr="قصتنا" center={false} />
              <div className="space-y-4 text-[#6B5E56] leading-relaxed">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <div className="text-center p-8 bg-white border border-[#E8E0D8]">
                  <value.icon size={36} className="text-[#C8A45C] mx-auto mb-4" />
                  <h3 className="font-serif font-bold text-lg text-[#2C2420] mb-2">{value.title}</h3>
                  <p className="text-[#6B5E56] text-sm">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
