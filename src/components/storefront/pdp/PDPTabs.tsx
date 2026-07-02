"use client"

import { useState, useEffect } from "react"
import { BRANDS } from "@/lib/data/products"
import type { Product } from "@/lib/data/products"
import { fetchProductReviews, type BackendReview } from "@/lib/api/products"

// ── Care icons ─────────────────────────────────────────────────────────────────

function WashIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h18M5 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2M5 7l2 13h10l2-13" />
      <path d="M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
    </svg>
  )
}

function DryIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function IronIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18h18" />
      <path d="M5 18V9a2 2 0 0 1 2-2h10l2 11" />
      <path d="M10 7V5" />
      <path d="M14 7V5" />
    </svg>
  )
}

// ── Review section ─────────────────────────────────────────────────────────────

const REVIEWS = [
  {
    id: 1,
    name: "Rahima K.",
    initial: "R",
    verified: true,
    rating: 5,
    date: "12 Jun 2026",
    comment:
      "Absolutely love this piece! The quality is outstanding and the fit is perfect. I've been wearing it regularly for a month and it still looks brand new. Highly recommend to anyone looking for quality South Asian fashion.",
  },
  {
    id: 2,
    name: "Fatima S.",
    initial: "F",
    verified: true,
    rating: 4,
    date: "3 May 2026",
    comment:
      "Great product overall. The material feels premium and the sizing is accurate. Delivery was fast too. Would have given 5 stars but wish there were more colour options.",
  },
  {
    id: 3,
    name: "Arif H.",
    initial: "A",
    verified: false,
    rating: 4,
    date: "28 Apr 2026",
    comment:
      "Good value for money. Looks exactly like the pictures and the colour is true to what's shown online. Will definitely buy again from FashionHub.",
  },
]

const RATING_DIST = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 20 },
  { stars: 3, pct: 8 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 1 },
]

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < rating ? "var(--color-brand-rose)" : "var(--color-border)"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

interface DisplayReview {
  id: string
  name: string
  initial: string
  verified: boolean
  rating: number
  date: string
  comment: string
}

function fromMock(): DisplayReview[] {
  return REVIEWS.map((r) => ({
    id: String(r.id),
    name: r.name,
    initial: r.initial,
    verified: r.verified,
    rating: r.rating,
    date: r.date,
    comment: r.comment,
  }))
}

function fromBackend(reviews: BackendReview[]): DisplayReview[] {
  return reviews.map((r) => ({
    id: r._id,
    name: r.userName,
    initial: (r.userName?.[0] ?? "?").toUpperCase(),
    verified: r.isVerifiedPurchase,
    rating: r.rating,
    date: new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    comment: r.comment,
  }))
}

// A real Mongo _id — only backend-sourced products have one, so this is what
// decides whether the panel fetches live reviews or falls back to demo data.
function ReviewsPanel({ productId, rating, reviewCount }: { productId?: string; rating: number; reviewCount: number }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(Boolean(productId))
  const [liveReviews, setLiveReviews] = useState<DisplayReview[] | null>(null)
  const [liveRating, setLiveRating] = useState(rating)
  const [liveCount, setLiveCount] = useState(reviewCount)
  const [liveDist, setLiveDist] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    if (!productId) return
    let cancelled = false
    setLoading(true)
    fetchProductReviews(productId, { page: 1, limit: 10 })
      .then((data) => {
        if (cancelled) return
        setLiveReviews(fromBackend(data.reviews))
        setLiveRating(data.averageRating || rating)
        setLiveCount(data.total)
        setLiveDist(data.ratingDistribution)
      })
      .catch(() => { if (!cancelled) setLiveReviews([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const isLive = productId !== undefined
  const displayRating = isLive ? liveRating : rating
  const displayCount = isLive ? liveCount : reviewCount
  const distRows = isLive && liveDist
    ? [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        pct: liveCount > 0 ? Math.round(((liveDist[String(stars)] ?? 0) / liveCount) * 100) : 0,
      }))
    : RATING_DIST
  const cards = isLive ? (liveReviews ?? []) : fromMock()

  if (isLive && loading) {
    return (
      <div className="max-w-3xl animate-pulse">
        <div className="flex gap-8 pb-8 mb-8" style={{ borderBottom: "1px solid var(--color-border-light)" }}>
          <div className="w-[120px] h-24 rounded-xl" style={{ background: "var(--color-brand-beige)" }} />
          <div className="flex-1 h-24 rounded-xl" style={{ background: "var(--color-brand-beige)" }} />
        </div>
        {[0, 1].map((i) => (
          <div key={i} className="h-24 rounded-xl mb-4" style={{ background: "var(--color-brand-beige)" }} />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      {/* Summary */}
      <div
        className="flex flex-col sm:flex-row gap-8 pb-8 mb-8"
        style={{ borderBottom: "1px solid var(--color-border-light)" }}
      >
        {/* Score */}
        <div className="flex flex-col items-center justify-center gap-1.5 min-w-[120px]">
          <span
            className="font-heading font-light text-brand-charcoal"
            style={{ fontSize: "4rem", lineHeight: 1 }}
          >
            {displayRating.toFixed(1)}
          </span>
          <StarRow rating={Math.round(displayRating)} />
          <p className="font-sans text-brand-charcoal/45" style={{ fontSize: "12px" }}>
            {displayCount} reviews
          </p>
        </div>

        {/* Bar chart */}
        <div className="flex-1 flex flex-col gap-2.5">
          {distRows.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-3">
              <span
                className="font-sans text-brand-charcoal/55 text-right"
                style={{ width: "20px", fontSize: "12px" }}
              >
                {stars}★
              </span>
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: "6px", background: "var(--color-border-light)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: "var(--color-brand-rose)" }}
                />
              </div>
              <span
                className="font-sans text-brand-charcoal/45"
                style={{ width: "32px", fontSize: "12px" }}
              >
                {pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      {cards.length === 0 ? (
        <p className="font-sans text-brand-charcoal/45 mb-8" style={{ fontSize: "14px" }}>
          No reviews yet — be the first to share your thoughts.
        </p>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {cards.map((r) => (
            <div
              key={r.id}
              className="rounded-xl p-5"
              style={{
                background: "var(--color-brand-beige)",
                border: "1px solid var(--color-border-light)",
              }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center font-sans font-semibold text-brand-ivory flex-shrink-0"
                  style={{ background: "var(--color-brand-mauve)", fontSize: "14px" }}
                >
                  {r.initial}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-semibold text-brand-charcoal" style={{ fontSize: "13px" }}>
                        {r.name}
                      </span>
                      {r.verified && (
                        <span
                          className="font-sans font-semibold rounded-full px-2 py-0.5"
                          style={{
                            fontSize: "10px",
                            background: "rgba(74,124,89,0.12)",
                            color: "#4a7c59",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="font-sans text-brand-charcoal/40" style={{ fontSize: "12px" }}>
                      {r.date}
                    </span>
                  </div>
                  <StarRow rating={r.rating} />
                  <p
                    className="font-sans text-brand-charcoal/70 leading-relaxed mt-2"
                    style={{ fontSize: "14px" }}
                  >
                    {r.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write a review CTA */}
      {submitted ? (
        <p className="font-sans font-semibold text-brand-rose" style={{ fontSize: "14px" }}>
          ✓ Thank you for your review!
        </p>
      ) : isLive ? (
        <a
          href="/account/login"
          className="inline-block font-sans font-semibold rounded-full px-8 py-3 transition-colors"
          style={{
            fontSize: "14px",
            background: "transparent",
            border: "1.5px solid var(--color-brand-rose)",
            color: "var(--color-brand-rose)",
          }}
        >
          Sign In to Write a Review
        </a>
      ) : (
        <button
          onClick={() => setSubmitted(true)}
          className="font-sans font-semibold rounded-full px-8 py-3 transition-colors"
          style={{
            fontSize: "14px",
            background: "transparent",
            border: "1.5px solid var(--color-brand-rose)",
            color: "var(--color-brand-rose)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = "var(--color-brand-rose)"
            el.style.color = "var(--color-brand-ivory)"
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = "transparent"
            el.style.color = "var(--color-brand-rose)"
          }}
        >
          Write a Review
        </button>
      )}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

type TabId = "description" | "details" | "reviews"

const TABS: { id: TabId; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "details",     label: "Details" },
  { id: "reviews",     label: "Reviews" },
]

export function PDPTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<TabId>("description")
  const productId = product._id

  const origin = BRANDS.find((b) => b.name === product.brand)?.origin
  const originLabel = origin === "PK" ? "Pakistan" : "Bangladesh"

  return (
    <div
      id="reviews"
      className="w-full"
      style={{ background: "var(--color-brand-ivory)", borderTop: "1px solid var(--color-border-light)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Tab headers */}
        <div
          className="flex gap-0 overflow-x-auto mb-10"
          style={{ borderBottom: "1px solid var(--color-border-light)" }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 px-6 py-3 font-sans font-medium -mb-px transition-colors"
                style={{
                  fontSize: "14px",
                  color: active ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)",
                  opacity: active ? 1 : 0.5,
                  borderBottom: active
                    ? "2px solid var(--color-brand-rose)"
                    : "2px solid transparent",
                }}
              >
                {tab.id === "reviews" ? `Reviews (${product.reviewCount})` : tab.label}
              </button>
            )
          })}
        </div>

        {/* Description */}
        {activeTab === "description" && (
          <div className="max-w-3xl">
            <p
              className="font-sans text-brand-charcoal/70 leading-relaxed mb-8"
              style={{ fontSize: "15px" }}
            >
              {product.description}
            </p>

            {/* Care icons */}
            <div
              className="flex items-center gap-6 py-5 px-6 rounded-xl flex-wrap"
              style={{
                background: "var(--color-brand-beige)",
                border: "1px solid var(--color-border-light)",
              }}
            >
              <span className="font-sans font-semibold text-brand-charcoal/50 uppercase tracking-widest" style={{ fontSize: "10px" }}>
                Care
              </span>
              {[
                { Icon: WashIcon, label: "Hand Wash" },
                { Icon: DryIcon, label: "Lay Flat Dry" },
                { Icon: IronIcon, label: "Iron Low Heat" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-brand-charcoal/60">
                  <Icon />
                  <span className="font-sans" style={{ fontSize: "11px" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        {activeTab === "details" && (
          <div className="max-w-2xl">
            <table className="w-full rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border-light)" }}>
              <tbody>
                {[
                  ["SKU",              product.sku],
                  ["Brand",           product.brand],
                  ["Category",        product.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())],
                  ["Fabric",          product.fabric],
                  ["Available Sizes", product.sizes.join(" · ")],
                  ["Colors",          product.colors.map((c) => c.name).join(" · ")],
                  ["Origin",          originLabel],
                ].map(([k, v], i) => (
                  <tr
                    key={k}
                    style={{ background: i % 2 === 0 ? "var(--color-brand-beige)" : "var(--color-brand-ivory)" }}
                  >
                    <td
                      className="px-5 py-3 font-sans font-semibold text-brand-charcoal/55"
                      style={{ fontSize: "13px", width: "160px" }}
                    >
                      {k}
                    </td>
                    <td className="px-5 py-3 font-sans text-brand-charcoal" style={{ fontSize: "13px" }}>
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <ReviewsPanel productId={productId} rating={product.rating} reviewCount={product.reviewCount} />
        )}
      </div>
    </div>
  )
}
