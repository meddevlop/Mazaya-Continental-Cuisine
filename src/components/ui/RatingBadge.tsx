interface RatingBadgeProps {
  rating: number
  reviews?: number
}

export default function RatingBadge({ rating, reviews }: RatingBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full">
      <span className="text-[#C8A45C] text-lg">★</span>
      <span className="font-bold text-lg">{rating}</span>
      {reviews && (
        <>
          <span className="text-white/60">•</span>
          <span className="text-sm text-white/80">{reviews}+ reviews</span>
        </>
      )}
    </div>
  )
}
