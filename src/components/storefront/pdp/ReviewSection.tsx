"use client"

const REVIEWS = [
  {
    id: 1,
    name: "Rahman K.",
    verified: true,
    rating: 5,
    date: "12 Jun 2026",
    text: "Absolutely love this kurta! The quality is outstanding and the fit is perfect. I've been wearing it regularly for a month and it still looks brand new.",
    helpful: { up: 24, down: 2 },
  },
  {
    id: 2,
    name: "Fatima S.",
    verified: true,
    rating: 4,
    date: "3 May 2026",
    text: "Great product overall. The material feels premium and the sizing is accurate. Delivery was fast. Would have given 5 stars but the insole could use more cushioning.",
    helpful: { up: 12, down: 1 },
  },
  {
    id: 3,
    name: "Arif H.",
    verified: false,
    rating: 4,
    date: "28 Apr 2026",
    text: "Good value for money. Looks exactly like the pictures. The color is true to what's shown online. Will definitely buy again from this brand.",
    helpful: { up: 8, down: 3 },
  },
]

const RATING_DIST = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 20 },
  { stars: 3, pct: 8 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 1 },
]

function Stars({ rating }: { rating: number }) {
  const r = Math.round(rating)
  return (
    <span className="text-amber-400 text-sm tracking-widest">
      {"★".repeat(r)}{"☆".repeat(5 - r)}
    </span>
  )
}

interface ReviewSectionProps {
  rating: number
  reviewCount: number
}

export function ReviewSection({ rating, reviewCount }: ReviewSectionProps) {
  return (
    <div>
      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-gray-100">
        <div className="flex flex-col items-center justify-center gap-1 min-w-[120px]">
          <div className="text-5xl font-extrabold text-brand-charcoal">{rating.toFixed(1)}</div>
          <Stars rating={rating} />
          <div className="text-sm text-gray-400">{reviewCount} reviews</div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {RATING_DIST.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-5 text-right">{stars}★</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-charcoal rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="flex flex-col gap-4 mb-6">
        {REVIEWS.map((review) => (
          <div key={review.id} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start justify-between mb-1 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-sm">{review.name}</span>
                {review.verified && (
                  <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Verified Purchase
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
            <Stars rating={review.rating} />
            <p className="text-sm text-gray-600 mt-2 mb-3 leading-relaxed">{review.text}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Was this helpful?</span>
              <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                👍 {review.helpful.up}
              </button>
              <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                👎 {review.helpful.down}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="px-6 py-2.5 border-2 border-brand-charcoal text-brand-charcoal rounded-xl font-semibold text-sm hover:bg-brand-charcoal hover:text-white transition-colors">
        Write a Review
      </button>
    </div>
  )
}
