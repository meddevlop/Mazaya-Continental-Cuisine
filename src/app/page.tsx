"use client"

import { useState, useEffect } from "react"
import Hero from "@/components/home/Hero"
import FeaturedDishes from "@/components/home/FeaturedDishes"
import { menuCategories } from "@/data/menu"
import AboutSection from "@/components/home/AboutSection"
import OurStorySection from "@/components/home/OurStorySection"
import SignUpCTA from "@/components/home/SignUpCTA"
import ReservationCTA from "@/components/home/ReservationCTA"

interface DishData {
  name: string
  description: string
}

interface HomeData {
  name: string
  nameAr: string
  tagline: string
  description: string
  featuredDishes: DishData[]
  dishImages: (string | undefined)[]
  aboutImage: string
  storyImage: string
  heroImage: string
  instagram: string
  phone: string
  rating: number
}

const fallback: HomeData = {
  name: "Mazaya Continental Cuisine",
  nameAr: "مزايا كونتيننتال",
  tagline: "Continental Dining Experience in Dubai",
  description: "",
  featuredDishes: [],
  dishImages: [],
  aboutImage: "",
  storyImage: "",
  heroImage: "",
  instagram: "mazaya.cuisine",
  phone: "",
  rating: 4.9,
}

export default function HomePage() {
  const [data, setData] = useState<HomeData>(fallback)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const ts = Date.now()
        const [settingsRes, menuRes] = await Promise.all([
          fetch(`/api/settings?t=${ts}`),
          fetch(`/api/menu?t=${ts}`),
        ])

        const settings = settingsRes.ok ? await settingsRes.json() : {}
        const menuItems = menuRes.ok ? await menuRes.json() : []

        if (cancelled) return
        setData({
          name: settings.restaurant_name || fallback.name,
          nameAr: settings.restaurant_name_ar || fallback.nameAr,
          tagline: settings.tagline || fallback.tagline,
          description: settings.description || "",
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
          dishImages: [
            settings.featured_dish_1_image,
            settings.featured_dish_2_image,
            settings.featured_dish_3_image,
            settings.featured_dish_4_image,
          ],
          aboutImage: settings.about_image || "",
          storyImage: settings.story_image || "",
          heroImage: settings.hero_image || "",
          instagram: settings.instagram?.replace(/https:\/\/instagram\.com\//, "").replace(/^@/, "") || fallback.instagram,
          phone: settings.phone || "",
          rating: settings.rating ?? fallback.rating,
        })
      } catch {
        if (!cancelled) setData(fallback)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <Hero
        name={data.name}
        nameAr={data.nameAr}
        tagline={data.tagline}
        rating={data.rating}
        heroImage={data.heroImage}
      />
      <FeaturedDishes dishes={data.featuredDishes} dishImages={data.dishImages} />
      <AboutSection image={data.aboutImage} description={data.description} />
      <OurStorySection image={data.storyImage} />
      <SignUpCTA />
      <ReservationCTA phone={data.phone} />
    </>
  )
}
