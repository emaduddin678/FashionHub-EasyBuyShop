"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addToCart } from "@/lib/store/cartSlice"
import { toggleWishlistItem } from "@/lib/store/wishlistSlice"
import type { ClothingSize, Product } from "@/lib/data/products"

interface ProductCardProps {
  product: Product
  rank?: number
  /** @deprecated — visual priceColor theming removed; kept for back-compat */
  priceColor?: "gold" | "red"
  /** @deprecated — quick-view modal wiring removed; kept for back-compat */
  onQuickView?: (product: Product) => void
  ctaLabel?: string
}

const BADGE_STYLES: Record<string, { bg: string; label: string }> = {
  new:      { bg: "var(--color-badge-new)",      label: "NEW" },
  sale:     { bg: "var(--color-badge-sale)",     label: "SALE" },
  featured: { bg: "var(--color-badge-featured)", label: "FEATURED" },
}

function Stars({ rating }: { rating: number }) {
  const r = Math.round(rating)
  return (
    <span className="text-brand-rose tracking-widest" style={{ fontSize: "12px" }}>
      {"★".repeat(r)}{"☆".repeat(5 - r)}
    </span>
  )
}

export function ProductCard({ product, rank, onQuickView: _onQuickView, priceColor: _priceColor, ctaLabel: _ctaLabel }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const [selectedSize, setSelectedSize] = useState<ClothingSize | null>(null)
  const [added, setAdded] = useState(false)

  // Real backend products carry their Mongo _id — prefer it so cart/wishlist
  // entries stay stable and can be persisted server-side (mock products fall
  // back to the synthetic numeric id).
  const productKey = product._id ?? product.id

  const isWishlisted = useAppSelector((s) =>
    s.wishlist.items.some((i) => String(i.id) === String(productKey)),
  )

  const firstWord = encodeURIComponent(product.name.split(" ")[0] || "Item")
  const imgUrl = `https://placehold.co/480x640/F5EFE6/2D2D2D?text=${firstWord}`
  const productHref = `/product/${productKey}`

  const handleAddToCart = (size?: ClothingSize) => {
    const sz = size ?? selectedSize ?? product.sizes[0]
    if (!sz) return
    dispatch(
      addToCart({
        id: productKey,
        name: product.name,
        price: `৳${product.price.toLocaleString()}`,
        size: sz,
        selectedColor: product.colors[0] ?? null,
        imgBg: "F5EFE6",
        imgFg: "2D2D2D",
        imgText: product.name.split(" ")[0] || "Item",
      }),
    )
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setSelectedSize(null)
    }, 1500)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(
      toggleWishlistItem({
        id: productKey,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice ?? product.price,
        image: imgUrl,
        sizes: product.sizes,
        unavailableSizes: [],
        rating: product.rating,
        reviewCount: product.reviewCount,
        badge: product.badge,
        addedAt: new Date().toISOString(),
        imgBg: "F5EFE6",
        imgFg: "2D2D2D",
        imgText: product.name.split(" ")[0] || "Item",
      }),
    )
  }

  const badge = product.badge ? BADGE_STYLES[product.badge] : null
  const savings =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0

  return (
    <div
      className="group flex flex-col bg-white hover:-translate-y-1 transition-all duration-300"
      style={{
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-card)",
      }}
      onMouseEnter={() => {}} /* hover state managed via group */
    >
      {/* ── Image wrapper ── */}
      <Link
        href={productHref}
        className="relative block overflow-hidden flex-shrink-0"
        style={{ aspectRatio: "3 / 4", borderRadius: "var(--radius-card) var(--radius-card) 0 0" }}
      >
        <Image
          src={imgUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />

        {/* Ghosted rank number (Best Sellers only) */}
        {rank !== undefined && (
          <span
            className="absolute bottom-2 right-3 font-heading text-brand-ivory/20 leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
            aria-hidden="true"
          >
            {String(rank).padStart(2, "0")}
          </span>
        )}

        {/* Badge — top-left */}
        {badge && (
          <span
            className="absolute top-3 left-3 z-10 font-sans font-bold text-brand-ivory px-2.5 py-1 rounded uppercase tracking-wider"
            style={{ fontSize: "10px", background: badge.bg }}
          >
            {badge.label}
          </span>
        )}

        {/* Wishlist — top-right */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-sm transition-all hover:scale-110"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            fill={isWishlisted ? "#E8A4B0" : "none"}
            stroke={isWishlisted ? "#E8A4B0" : "#2D2D2D"}
            strokeWidth={2}
          />
        </button>

        {/* Quick-add — slides up on hover */}
        <div
          className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3"
          style={{ background: "rgba(45,45,45,0.82)" }}
          onClick={(e) => e.preventDefault()}
        >
          <p className="font-sans text-brand-ivory/60 uppercase tracking-widest mb-2" style={{ fontSize: "9px" }}>
            Select Size
          </p>
          <div className="flex items-center gap-1.5">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(sz) }}
                className={cn(
                  "h-7 px-2 rounded text-xs font-semibold transition-all",
                  selectedSize === sz
                    ? "bg-brand-ivory text-brand-charcoal scale-105"
                    : "bg-white/10 text-white/70 hover:bg-white/25",
                )}
              >
                {sz}
              </button>
            ))}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (selectedSize) handleAddToCart(selectedSize) }}
              className={cn(
                "flex-1 h-7 rounded text-xs font-bold transition-all",
                added
                  ? "bg-green-500 text-white"
                  : selectedSize
                  ? "bg-brand-rose text-white hover:bg-brand-mauve"
                  : "bg-white/10 text-white/30 cursor-not-allowed",
              )}
            >
              {added ? "✓ Added!" : selectedSize ? "Add to Cart" : "Pick Size"}
            </button>
          </div>
        </div>
      </Link>

      {/* ── Card body ── */}
      <Link href={productHref} className="flex flex-col gap-1 p-4 pt-3">
        {/* Brand */}
        <p
          className="font-sans uppercase tracking-widest text-brand-charcoal/60"
          style={{ fontSize: "11px" }}
        >
          {product.brand}
        </p>

        {/* Name */}
        <p
          className="font-sans text-brand-charcoal leading-snug line-clamp-2"
          style={{ fontSize: "14px" }}
        >
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <Stars rating={product.rating} />
          <span className="font-sans text-brand-charcoal/50" style={{ fontSize: "11px" }}>
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-sans font-semibold text-brand-charcoal" style={{ fontSize: "16px" }}>
            ৳{product.price.toLocaleString()}
          </span>
          {savings > 0 && (
            <>
              <span className="font-sans text-brand-charcoal/40 line-through" style={{ fontSize: "13px" }}>
                ৳{product.originalPrice!.toLocaleString()}
              </span>
              <span
                className="font-sans font-semibold text-brand-rose rounded-full px-2 py-0.5"
                style={{ fontSize: "11px", background: "rgba(232,164,176,0.12)" }}
              >
                ৳{savings.toLocaleString()} OFF
              </span>
            </>
          )}
        </div>
      </Link>
    </div>
  )
}
