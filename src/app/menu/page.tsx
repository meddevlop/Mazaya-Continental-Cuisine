import type { Metadata } from "next"
import MenuPageClient from "./MenuPageClient"

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore our extensive menu featuring Mixed Grills, Soups, Appetizers, Pasta, Sandwiches, Salads, Kibbeh, Beverages, Platters, and Daily Dishes.",
}

export default function MenuPage() {
  return <MenuPageClient />
}
