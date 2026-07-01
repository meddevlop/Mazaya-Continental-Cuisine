interface SectionTitleProps {
  title: string
  titleAr?: string
  subtitle?: string
  light?: boolean
  center?: boolean
}

export default function SectionTitle({ title, titleAr, subtitle, light = false, center = true }: SectionTitleProps) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      {titleAr && (
        <p className="font-arabic text-[#C8A45C] text-lg mb-1">{titleAr}</p>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-serif font-bold ${light ? "text-[#F5F0EB]" : "text-[#2C2420]"}`}>
        {title}
      </h2>
      <div className={`w-16 h-0.5 mt-4 mx-auto ${center ? "mx-auto" : ""} bg-[#C8A45C]`} />
      {subtitle && (
        <p className={`mt-4 text-base md:text-lg max-w-2xl ${center ? "mx-auto" : ""} ${light ? "text-[#D4C9C0]" : "text-[#6B5E56]"}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
