"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addToCart } from "@/lib/store/cartSlice"
import { toggleWishlist } from "@/lib/store/wishlistSlice"
import { Heart } from "lucide-react"
import type { ClothingSize, Product } from "@/lib/data/products"

// ── Countdown ─────────────────────────────────────────────────────────────────

function nextSundayEndBD(): Date {
  // BD = UTC+6
  const now = new Date()
  const bdOffsetMs = 6 * 60 * 60 * 1000
  const bdNow = new Date(now.getTime() + bdOffsetMs)
  // days until next Sunday (0 = Sunday)
  const dayOfWeek = bdNow.getUTCDay()
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek
  const endBD = new Date(bdNow)
  endBD.setUTCDate(bdNow.getUTCDate() + daysUntilSunday)
  endBD.setUTCHours(23, 59, 59, 0)
  // convert back to UTC wall-clock
  return new Date(endBD.getTime() - bdOffsetMs)
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="font-sans font-bold tabular-nums text-brand-ivory leading-none"
        style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
      >
        {pad(value)}
      </span>
      <span
        className="font-sans uppercase tracking-widest text-brand-charcoal/60 mt-1"
        style={{ fontSize: "10px" }}
      >
        {label}
      </span>
    </div>
  )
}

function Colon() {
  return (
    <span className="font-sans font-bold text-brand-ivory/30 self-start pt-1" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
      :
    </span>
  )
}

// ── Dark-mode product card (Flash Sale only) ──────────────────────────────────

function SaleCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const [selectedSize, setSelectedSize] = useState<ClothingSize | null>(null)
  const [added, setAdded] = useState(false)

  const isWishlisted = useAppSelector((s) =>
    s.wishlist.items.some((i) => i.id === product.id),
  )

  const firstWord = encodeURIComponent(product.name.split(" ")[0] || "Item")
  const imgUrl = `https://placehold.co/480x640/1E1E1E/E8A4B0?text=${firstWord}`
  const productHref = `/product/${product.id}`

  const savings =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0
  const discountPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((savings / product.originalPrice) * 100)
      : 0

  const handleAddToCart = (sz: ClothingSize) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: `৳${product.price.toLocaleString()}`,
        size: sz,
        selectedColor: product.colors[0] ?? null,
        imgBg: "1E1E1E",
        imgFg: "E8A4B0",
        imgText: product.name.split(" ")[0] || "Item",
      }),
    )
    setAdded(true)
    setTimeout(() => { setAdded(false); setSelectedSize(null) }, 1500)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    dispatch(toggleWishlist({
      id: product.id, name: product.name, brand: product.brand,
      category: product.category, price: product.price,
      originalPrice: product.originalPrice ?? product.price,
      image: imgUrl, sizes: product.sizes, unavailableSizes: [],
      rating: product.rating, reviewCount: product.reviewCount,
      badge: product.badge, addedAt: new Date().toISOString(),
      imgBg: "1E1E1E", imgFg: "E8A4B0",
      imgText: product.name.split(" ")[0] || "Item",
    }))
  }

  return (
    <div
      className="group flex flex-col flex-shrink-0 w-[200px] md:w-auto transition-all duration-300 hover:-translate-y-1"
      style={{ background: "#1E1E1E", borderRadius: "var(--radius-card)", boxShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
    >
      {/* Image */}
      <Link
        href={productHref}
        className="relative block overflow-hidden flex-shrink-0"
        style={{ aspectRatio: "3 / 4", borderRadius: "var(--radius-card) var(--radius-card) 0 0" }}
      >
        <Image
          src={imgUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 200px, 25vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount badge */}
        {discountPct > 0 && (
          <span
            className="absolute top-3 left-3 z-10 font-sans font-bold text-brand-ivory px-2.5 py-1 rounded uppercase tracking-wider"
            style={{ fontSize: "10px", background: "var(--color-badge-sale)" }}
          >
            -{discountPct}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"
        >
          <Heart
            className="w-4 h-4"
            fill={isWishlisted ? "#E8A4B0" : "none"}
            stroke={isWishlisted ? "#E8A4B0" : "#FDFAF6"}
            strokeWidth={2}
          />
        </button>

        {/* Quick-add overlay */}
        <div
          className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3"
          style={{ background: "rgba(30,30,30,0.92)" }}
          onClick={(e) => e.preventDefault()}
        >
          <p className="font-sans text-brand-ivory/50 uppercase tracking-widest mb-1.5" style={{ fontSize: "9px" }}>
            Select Size
          </p>
          <div className="flex items-center gap-1">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(sz) }}
                className={cn(
                  "h-7 px-1.5 rounded text-xs font-semibold transition-all",
                  selectedSize === sz
                    ? "bg-brand-rose text-white scale-105"
                    : "bg-white/10 text-white/60 hover:bg-white/20",
                )}
              >
                {sz}
              </button>
            ))}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (selectedSize) handleAddToCart(selectedSize) }}
              className={cn(
                "flex-1 h-7 rounded text-xs font-bold transition-all",
                added ? "bg-green-500 text-white"
                  : selectedSize ? "bg-brand-rose text-white hover:bg-brand-mauve"
                  : "bg-white/10 text-white/30 cursor-not-allowed",
              )}
            >
              {added ? "✓ Added!" : selectedSize ? "Add →" : "Pick"}
            </button>
          </div>
        </div>
      </Link>

      {/* Body */}
      <Link href={productHref} className="flex flex-col gap-1 p-3">
        <p className="font-sans uppercase tracking-widest" style={{ fontSize: "10px", color: "rgba(253,250,246,0.45)" }}>
          {product.brand}
        </p>
        <p className="font-sans text-brand-ivory leading-snug line-clamp-2" style={{ fontSize: "13px" }}>
          {product.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="font-sans font-semibold text-brand-rose" style={{ fontSize: "15px" }}>
            ৳{product.price.toLocaleString()}
          </span>
          {savings > 0 && (
            <span className="font-sans line-through" style={{ fontSize: "12px", color: "rgba(253,250,246,0.35)" }}>
              ৳{product.originalPrice!.toLocaleString()}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}

// ── Main exported component ───────────────────────────────────────────────────

interface FlashSaleProps {
  products: Product[]
}

export function FlashSale({ products }: FlashSaleProps) {
  const endTime = useCallback(nextSundayEndBD, [])()

  const calcTimeLeft = () => {
    const rem = Math.max(0, endTime.getTime() - Date.now())
    return {
      h: Math.floor(rem / 3_600_000),
      m: Math.floor((rem % 3_600_000) / 60_000),
      s: Math.floor((rem % 60_000) / 1_000),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft)

  useEffect(() => {
    const iv = setInterval(() => {
      const next = calcTimeLeft()
      setTimeLeft(next)
      if (next.h === 0 && next.m === 0 && next.s === 0) clearInterval(iv)
    }, 1000)
    return () => clearInterval(iv)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saleProducts = products.filter((p) => p.badge === "sale").slice(0, 6)

  return (
    <section
      className="w-full py-16"
      style={{ background: "linear-gradient(135deg, var(--color-brand-charcoal) 0%, #1a1a1a 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-6 md:w-[38%] flex-shrink-0">
            <div>
              <p
                className="font-sans uppercase tracking-widest text-brand-rose mb-2"
                style={{ fontSize: "11px" }}
              >
                LIMITED TIME
              </p>
              <h2
                className="font-heading font-light text-brand-ivory leading-none mb-2"
                style={{ fontSize: "clamp(2.75rem, 5vw, 3.25rem)" }}
              >
                Flash Sale
              </h2>
              <p className="font-sans text-brand-ivory/70" style={{ fontSize: "15px" }}>
                Up to 40% off — today only.
              </p>
            </div>

            {/* Countdown */}
            <div className="flex items-end gap-3">
              <CountdownUnit value={timeLeft.h} label="Hours" />
              <Colon />
              <CountdownUnit value={timeLeft.m} label="Mins" />
              <Colon />
              <CountdownUnit value={timeLeft.s} label="Secs" />
            </div>

            <Link
              href="/sale"
              className="font-sans font-semibold text-sm self-start px-8 py-3 rounded-full bg-brand-rose text-brand-ivory hover:bg-brand-mauve transition-colors duration-200"
            >
              Shop Sale
            </Link>
          </div>

          {/* ── Right column — horizontal scroll ── */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
              {saleProducts.map((product) => (
                <div key={product.id} className="snap-start flex-shrink-0 md:flex-shrink md:w-auto w-[200px]">
                  <SaleCard product={product} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
