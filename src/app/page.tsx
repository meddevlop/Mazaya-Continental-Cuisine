"use client"

import { useState, useEffect } from "react"
import Hero from "@/components/home/Hero"
import FeaturedDishes from "@/components/home/FeaturedDishes"
import { menuCategories } from "@/data/menu"
import AboutSection from "@/components/home/AboutSection"
import GalleryPreview from "@/components/home/GalleryPreview"
import SignUpCTA from "@/components/home/SignUpCTA"
import ReservationCTA from "@/components/home/ReservationCTA"
import LoadingSkeleton from "@/components/admin/ui/LoadingSkeleton"

interface DishData {
  name: string
  description: string
}

interface HomeData {
  heroImage: string
  logo: string
  name: string
  nameAr: string
  tagline: string
  description: string
  storyImage: string
  featuredImage: string
  featuredDishes: DishData[]
  galleryImages: { url: string; alt: string }[]
  instagram: string
  phone: string
  rating: number
}

const fallback: HomeData = {
  heroImage: "",
  logo: "",
  name: "Mazaya Continental Cuisine",
  nameAr: "مزايا كونتيننتال",
  tagline: "Continental Dining Experience in Dubai",
  description: "",
  storyImage: "",
  featuredImage: "",
  featuredDishes: [],
  galleryImages: [],
  instagram: "mazaya.cuisine",
  phone: "",
  rating: 4.9,
}

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [settingsRes, menuRes, galleryRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/menu"),
          fetch(`/api/gallery?t=${Date.now()}`),
        ])

        const settings = settingsRes.ok ? await settingsRes.json() : {}
        const menuItems = menuRes.ok ? await menuRes.json() : []
        const galleryItems = galleryRes.ok ? await galleryRes.json() : []

        if (cancelled) return
        setData({
          heroImage: settings.hero_image || "",
          logo: settings.logo || "",
          name: settings.restaurant_name || fallback.name,
          nameAr: settings.restaurant_name_ar || fallback.nameAr,
          tagline: settings.tagline || fallback.tagline,
          description: settings.description || "",
          storyImage: settings.story_image || "",
          featuredImage: settings.featured_dish_image || "",
          featuredDishes: (menuItems as any[]).some((item: any) => item.is_featured)
            ? (menuItems as any[])
                .filter((item: any) => item.is_featured)
                .slice(0, 4)
                .map((item: any) => ({
                  name: item.name,
                  description: item.description || "",
                }))
            : menuCategories.flatMap(c => c.items).slice(0, 4).map(i => ({
                name: i.name,
                description: i.description || "",
              })),
          galleryImages: (galleryItems as any[])
            .filter((item: any) => item.is_active !== false)
            .slice(0, 6)
            .map((item: any) => ({ url: item.url, alt: item.alt || "" })),
          instagram: settings.instagram?.replace(/https:\/\/instagram\.com\//, "").replace(/^@/, "") || fallback.instagram,
          phone: settings.phone || "",
          rating: settings.rating ?? fallback.rating,
        })
      } catch {
        if (!cancelled) setData(fallback)
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadingSkeleton className="h-screen" />
  if (!data) return null

  return (
    <>
      <Hero
        heroImage={data.heroImage}
        logo={data.logo}
        name={data.name}
        nameAr={data.nameAr}
        tagline={data.tagline}
        rating={data.rating}
      />
      <FeaturedDishes dishes={data.featuredDishes} featuredImage={data.featuredImage} />
      <AboutSection image={data.storyImage} description={data.description} />
      <GalleryPreview images={data.galleryImages} />
      <SignUpCTA />
      <ReservationCTA heroImage={data.heroImage} phone={data.phone} />
    </>
  )
}