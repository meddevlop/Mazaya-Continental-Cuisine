"use client"

import { useState, useEffect } from "react"

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyle] = useState("")

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (!data.primary_color) return
      const vars = `
:root {
  --color-primary: ${data.primary_color || "#C8A45C"};
  --color-secondary: ${data.secondary_color || "#B8933D"};
  --color-accent: ${data.accent_color || "#D4C9C0"};
  --color-dark: ${data.dark_mode !== false ? "#0A0A0A" : "#FAFAF8"};
  --font-heading: '${data.font_heading || "Playfair Display"}', serif;
  --font-body: '${data.font_body || "Inter"}', sans-serif;
}
`
      setStyle(vars)
    }).catch(() => {})
  }, [])

  return (
    <>
      {style && <style dangerouslySetInnerHTML={{ __html: style }} />}
      {children}
    </>
  )
}
