"use client"

import { useState, useEffect, FormEvent } from "react"
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
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C8A45C] text-sm uppercase tracking-[0.3em] mb-2">{settings.nameAr}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5F0EB]">
            Reserve a Table
          </h1>
          <p className="text-[#D4C9C0] mt-4 max-w-2xl mx-auto">
            Book your dining experience at {settings.name}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-white border border-[#E8E0D8] p-8 md:p-12">
              <div className="text-center mb-10">
                <Calendar size={36} className="text-[#C8A45C] mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2C2420]">
                  Book Your Experience
                </h2>
                <p className="text-[#6B5E56] mt-2">
                  Fill in your details and we will confirm your reservation
                </p>
              </div>

              {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-[#C8A45C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-[#C8A45C]" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-[#2C2420] mb-2">
                        Reservation Submitted!
                      </h3>
                      <p className="text-[#6B5E56] mb-6">
                        Thank you for your reservation request. We will confirm your booking shortly via phone.
                      </p>
                  <Button variant="primary" onClick={() => setSubmitted(false)}>
                    Make Another Reservation
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2420] mb-2 flex items-center gap-2">
                        <User size={14} /> Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8E0D8] bg-[#FAFAF8] text-[#2C2420] focus:outline-none focus:border-[#C8A45C] transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2420] mb-2 flex items-center gap-2">
                        <Phone size={14} /> Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8E0D8] bg-[#FAFAF8] text-[#2C2420] focus:outline-none focus:border-[#C8A45C] transition-colors"
                        placeholder="+971 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2420] mb-2 flex items-center gap-2">
                        <Users size={14} /> Number of Guests
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8E0D8] bg-[#FAFAF8] text-[#2C2420] focus:outline-none focus:border-[#C8A45C] transition-colors"
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
                      <label className="block text-sm font-semibold text-[#2C2420] mb-2 flex items-center gap-2">
                        <Calendar size={14} /> Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8E0D8] bg-[#FAFAF8] text-[#2C2420] focus:outline-none focus:border-[#C8A45C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2420] mb-2 flex items-center gap-2">
                        <Clock size={14} /> Time
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8E0D8] bg-[#FAFAF8] text-[#2C2420] focus:outline-none focus:border-[#C8A45C] transition-colors"
                      >
                        <option value="">Select time</option>
                        {["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"].map((t) => (
                          <option key={t} value={t}>
                            {parseInt(t) > 12 ? `${parseInt(t) - 12}:00 PM` : `${t}:00 AM`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#2C2420] mb-2 flex items-center gap-2">
                        <MessageSquare size={14} /> Special Requests (Optional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8E0D8] bg-[#FAFAF8] text-[#2C2420] focus:outline-none focus:border-[#C8A45C] transition-colors resize-none"
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
