import type { Metadata, Viewport } from "next"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import MobileStickyBar from "@/components/layout/MobileStickyBar"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Mazaya Continental Cuisine",
  description: "Continental Dining Experience in Dubai. Premium mixed grills, kibbeh, mansaf, and signature dishes.",
  image: "https://mazayacuisine.com/images/hero.jpg",
  url: "https://mazayacuisine.com",
  telephone: "+97145911911",
  servesCuisine: "Continental",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "500",
  },
  openingHours: ["Su-We 11:00-00:00", "Th-Sa 11:00-01:00"],
}

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://mazayacuisine.com"),
  title: {
    default: "Mazaya Continental Cuisine | Premium Dining in Dubai",
    template: "%s | Mazaya Continental Cuisine",
  },
  description:
    "Experience the finest Continental dining in Dubai. Premium mixed grills, authentic kibbeh, aromatic mansaf, and signature dishes crafted with passion.",
  keywords: [
    "Mazaya Continental Cuisine",
    "مزايا كونتيننتال",
    "Dubai restaurant",
    "مطعم دبي",
    "Continental food Dubai",
    "mixed grills",
    "kibbeh",
    "mansaf",
    "best restaurant Dubai",
  ],
  openGraph: {
    title: "Mazaya Continental Cuisine | Premium Dining in Dubai",
    description: "Experience the finest Continental dining in Dubai.",
    url: "https://mazayacuisine.com",
    siteName: "Mazaya Continental Cuisine",
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Mazaya Continental Cuisine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mazaya Continental Cuisine | Premium Dining in Dubai",
    description: "Experience the finest Continental dining in Dubai.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://mazayacuisine.com",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <MobileStickyBar />
      </body>
    </html>
  )
}
