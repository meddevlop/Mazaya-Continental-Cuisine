export interface MenuItem {
  name: string
  nameAr?: string
  price: number
  description?: string
  sizes?: { label: string; price: number }[]
  isBestSeller?: boolean
  image?: string
}

export interface MenuCategory {
  id: string
  name: string
  nameAr: string
  items: MenuItem[]
}

export interface GalleryImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface BusinessInfo {
  name: string
  nameAr: string
  tagline: string
  taglineAr: string
  phone: string
  whatsapp: string
  email: string
  address: string
  addressAr: string
  instagram: string
  rating: number
  hours: { day: string; time: string }[]
}
