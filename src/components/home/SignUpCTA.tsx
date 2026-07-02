"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { UserPlus } from "lucide-react"
import AnimatedSection from "@/components/ui/AnimatedSection"
import Button from "@/components/ui/Button"

export default function SignUpCTA() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8A45C]/[0.03] via-transparent to-transparent" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C8A45C]/[0.02] rounded-full blur-[120px]" />

      <AnimatedSection>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <UserPlus size={48} className="text-[#C8A45C] mx-auto" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5F0EB] mb-6 leading-tight">
            Join the Experience
          </h2>
          <p className="text-lg text-[#9B8B80] mb-10 max-w-xl mx-auto leading-relaxed">
            Create an account to save your favorite dishes, book reservations faster,
            and receive exclusive updates from Mazaya.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
