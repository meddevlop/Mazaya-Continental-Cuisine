"use client"

import { useState, useEffect, FormEvent } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, User, Phone, MessageSquare, Loader2, CheckCircle } from "lucide-react"
import AnimatedSection from "@/components/ui/AnimatedSection"
import Button from "@/components/ui/Button"
import { business } from "@/data/business"

export default function ReservationsPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "2",
    date: "",
    time: "",
    notes: "",
  })
  const [settings, setSettings] = useState({ name: business.name, nameAr: business.nameAr, phone: business.phone })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data.restaurant_name) setSettings({ name: data.restaurant_name, nameAr: data.restaurant_name_ar || business.nameAr, phone: data.phone || business.phone })
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: formData.name,
          guest_phone: formData.phone,
          guests: parseInt(formData.guests),
          date: formData.date,
          time: formData.time,
          special_requests: formData.notes,
          source: "website",
        }),
      })

      if (!res.ok) throw new Error("Failed to submit")

      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again or call us.")
    } finally {
      setLoading(false)
    }
  }

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
            Reserve a Table
          </motion.h1>
          <motion.p
            className="text-[#9B8B80] mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Book your dining experience at {settings.name}
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-white border border-[#E8E0D8]/60 p-10 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A45C]/30 to-transparent" />
              <div className="text-center mb-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6"
                >
                  <Calendar size={40} className="text-[#C8A45C] mx-auto" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">
                  Book Your Experience
                </h2>
                <p className="text-[#6B5E56] mt-2">
                  Fill in your details and we will confirm your reservation
                </p>
              </div>

              {submitted ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-gradient-to-br from-[#C8A45C]/10 to-[#D4B87A]/5 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle size={40} className="text-[#C8A45C]" />
                  </motion.div>
                  <h3 className="text-3xl font-serif font-bold text-[#111111] mb-3">
                    Reservation Submitted!
                  </h3>
                  <p className="text-[#6B5E56] mb-8 max-w-md mx-auto">
                    Thank you for your reservation request. We will confirm your booking shortly via phone.
                  </p>
                  <Button variant="primary" onClick={() => setSubmitted(false)}>
                    Make Another Reservation
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wider flex items-center gap-2">
                        <User size={14} /> Full Name
                      </label>
                      <input
                        type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-3.5 border border-[#E8E0D8]/60 bg-[#FAFAF8] text-[#111111] focus:outline-none focus:border-[#C8A45C] transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wider flex items-center gap-2">
                        <Phone size={14} /> Phone Number
                      </label>
                      <input
                        type="tel" required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-3.5 border border-[#E8E0D8]/60 bg-[#FAFAF8] text-[#111111] focus:outline-none focus:border-[#C8A45C] transition-colors"
                        placeholder="+971 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wider flex items-center gap-2">
                        <Users size={14} /> Number of Guests
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full px-5 py-3.5 border border-[#E8E0D8]/60 bg-[#FAFAF8] text-[#111111] focus:outline-none focus:border-[#C8A45C] transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                        <option value="10+">10+ Guests</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={14} /> Date
                      </label>
                      <input
                        type="date" required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-5 py-3.5 border border-[#E8E0D8]/60 bg-[#FAFAF8] text-[#111111] focus:outline-none focus:border-[#C8A45C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wider flex items-center gap-2">
                        <Clock size={14} /> Time
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-5 py-3.5 border border-[#E8E0D8]/60 bg-[#FAFAF8] text-[#111111] focus:outline-none focus:border-[#C8A45C] transition-colors"
                      >
                        <option value="">Select time</option>
                        {["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"].map((t) => (
                          <option key={t} value={t}>
                            {parseInt(t) > 12 ? `${parseInt(t) - 12}:00 PM` : `${t}:00 AM`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare size={14} /> Special Requests (Optional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-5 py-3.5 border border-[#E8E0D8]/60 bg-[#FAFAF8] text-[#111111] focus:outline-none focus:border-[#C8A45C] transition-colors resize-none"
                        rows={3}
                        placeholder="Allergies, celebrations, preferences..."
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 px-4 py-2">{error}</p>
                  )}

                  <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
                    {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                    {loading ? "Submitting..." : "Submit Reservation"}
                  </Button>

                  <p className="text-xs text-[#6B5E56] text-center mt-4">
                    We will confirm your reservation via phone. You can also call us at{" "}
                    <a href={`tel:${settings.phone}`} className="text-[#C8A45C] hover:underline">
                      {settings.phone}
                    </a>
                  </p>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
