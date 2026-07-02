"use client"

import { motion } from "framer-motion"

interface SectionTitleProps {
  title: string
  titleAr?: string
  subtitle?: string
  light?: boolean
  center?: boolean
}

export default function SectionTitle({ title, titleAr, subtitle, light = false, center = true }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      className={`mb-16 md:mb-20 ${center ? "text-center" : ""}`}
    >
      {titleAr && (
        <p className="font-arabic text-[#C8A45C] text-lg md:text-xl mb-2 tracking-wide">{titleAr}</p>
      )}
      <h2
        className={`font-serif font-bold leading-tight ${
          center ? "mx-auto" : ""
        } ${
          light
            ? "text-[#F5F0EB]"
            : "text-[#111111]"
        } text-4xl md:text-5xl lg:text-6xl`}
      >
        {title}
      </h2>
      <div className={`w-20 h-[2px] mt-6 ${center ? "mx-auto" : ""} bg-gradient-to-r from-[#C8A45C] to-[#D4B87A]`} />
      {subtitle && (
        <p
          className={`mt-6 text-base md:text-lg max-w-2xl leading-relaxed ${
            center ? "mx-auto" : ""
          } ${light ? "text-[#9B8B80]" : "text-[#6B5E56]"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
