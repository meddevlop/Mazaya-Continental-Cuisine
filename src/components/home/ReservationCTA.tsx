"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import AnimatedSection from "@/components/ui/AnimatedSection"
import Button from "@/components/ui/Button"

interface ReservationCTAProps {
  phone: string
}

export default function ReservationCTA({ phone }: ReservationCTAProps) {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#111111] to-[#0D0D0D]" />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C8A45C]/[0.03] to-transparent" />

      <AnimatedSection>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Calendar size={48} className="text-[#C8A45C] mx-auto" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5F0EB] mb-6 leading-tight">
            Reserve Your Table
          </h2>
          <p className="text-lg text-[#9B8B80] mb-10 max-w-xl mx-auto leading-relaxed">
            Experience the finest Continental dining. Book your table today and let us
            create an unforgettable evening for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/reservations">
              <Button variant="primary" size="lg">
                Make a Reservation
              </Button>
            </Link>
            {phone && (
              <a href={`tel:${phone}`}>
                <Button variant="outline" size="lg">
                  Call {phone}
                </Button>
              </a>
            )}
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
