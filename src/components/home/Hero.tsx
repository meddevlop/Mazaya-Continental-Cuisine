"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Button from "@/components/ui/Button"
import RatingBadge from "@/components/ui/RatingBadge"

interface HeroProps {
  heroImage: string
  logo: string
  name: string
  nameAr: string
  tagline: string
  rating: number
}

export default function Hero({ heroImage, logo, name, nameAr, tagline, rating }: HeroProps) {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {heroImage ? (
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {logo && (
            <img
              src={logo}
              alt={name}
              className="h-20 md:h-28 mx-auto mb-6"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
            />
          )}

          <p className="text-[#C8A45C] text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-medium">
            {nameAr}
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F5F0EB] mb-4 leading-tight">
            {name}
          </h1>

          {tagline && (
            <p className="text-lg md:text-xl text-[#D4C9C0] mb-8 max-w-2xl mx-auto font-light">
              {tagline}
            </p>
          )}

          <div className="flex justify-center mb-8">
            <RatingBadge rating={rating} reviews={500} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/menu">
              <Button variant="primary" size="lg">
                Explore Our Menu
              </Button>
            </Link>
            <Link href="/reservations">
              <Button variant="outline" size="lg">
                Reserve a Table
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#C8A45C] rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}