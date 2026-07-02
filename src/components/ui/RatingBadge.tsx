interface RatingBadgeProps {
  rating: number
  reviews?: number
}

export default function RatingBadge({ rating, reviews }: RatingBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2.5 bg-black/50 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/10">
      <span className="text-[#C8A45C] text-lg">★</span>
      <span className="font-bold text-lg">{rating}</span>
      {reviews && (
        <>
          <span className="text-white/30">•</span>
          <span className="text-sm text-white/70 tracking-wide">{reviews}+ reviews</span>
        </>
      )}
    </div>
  )
}
