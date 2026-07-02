"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import MobileStickyBar from "@/components/layout/MobileStickyBar"

export default function ConditionalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  if (isAdmin) return <>{children}</>
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MobileStickyBar />
    </>
  )
}