"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Truck, Package, RotateCcw, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addToCart } from "@/lib/store/cartSlice"
import { toggleWishlist } from "@/lib/store/wishlistSlice"
import type { ClothingSize, Product, ProductColor } from "@/lib/data/products"

const ALL_SIZES: ClothingSize[] = ["XS", "S", "M", "L", "XL", "XXL"]

function starsFill(rating: number) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return { full, half, empty: 5 - full - (half ? 1 : 0) }
}

function Stars({ rating }: { rating: number }) {
  const { full, half, empty } = starsFill(rating)
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-brand-rose)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {half && (
        <svg key="h" width="14" height="14" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="var(--color-brand-rose)" />
              <stop offset="50%" stopColor="var(--color-border)" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half-grad)" />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-border)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

// ── Size Guide Modal ───────────────────────────────────────────────────────────

const SIZE_GUIDE = [
  { size: "XS", bust: 32, waist: 24, hip: 34 },
  { size: "S",  bust: 34, waist: 26, hip: 36 },
  { size: "M",  bust: 36, waist: 28, hip: 38 },
  { size: "L",  bust: 38, waist: 30, hip: 40 },
  { size: "XL", bust: 40, waist: 32, hip: 42 },
  { size: "XXL",bust: 42, waist: 34, hip: 44 },
]

function SizeGuideModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center"
      style={{ background: "rgba(28,28,28,0.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ background: "var(--color-brand-ivory)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--color-border-light)" }}
        >
          <span className="font-heading font-light text-brand-charcoal" style={{ fontSize: "1.25rem" }}>
            Size Guide
          </span>
          <button onClick={onClose} aria-label="Close" className="text-brand-charcoal/50 hover:text-brand-charcoal transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-center" style={{ fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--color-brand-charcoal)", color: "var(--color-brand-ivory)" }}>
                {["Size", "Bust (in)", "Waist (in)", "Hip (in)"].map((h) => (
                  <th key={h} className="px-4 py-2.5 font-semibold" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row, i) => (
                <tr key={row.size} style={{ background: i % 2 === 0 ? "var(--color-brand-ivory)" : "var(--color-brand-beige)" }}>
                  <td className="px-4 py-2.5 font-semibold text-brand-charcoal">{row.size}</td>
                  <td className="px-4 py-2.5 text-brand-charcoal/60">{row.bust}</td>
                  <td className="px-4 py-2.5 text-brand-charcoal/60">{row.waist}</td>
                  <td className="px-4 py-2.5 text-brand-charcoal/60">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="font-sans italic text-brand-charcoal/45 mt-3" style={{ fontSize: "12px" }}>
            Measure over light clothing. When between sizes, size up for a relaxed fit.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Cart toast ─────────────────────────────────────────────────────────────────

function CartToast({ productName, size, qty, onDismiss }: { productName: string; size: ClothingSize; qty: number; onDismiss: () => void }) {
  const router = useRouter()
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      className="fixed top-4 right-4 z-[300] rounded-2xl shadow-2xl p-4 w-72"
      style={{
        background: "var(--color-brand-ivory)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-card-hover)",
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(192,97,122,0.12)" }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--color-brand-rose)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-brand-charcoal truncate" style={{ fontSize: "13px" }}>
            {productName}
          </p>
          <p className="font-sans text-brand-charcoal/55" style={{ fontSize: "12px" }}>
            Size {size} · Qty {qty}
          </p>
          <button
            onClick={() => router.push("/cart")}
            className="font-sans font-semibold text-brand-rose hover:text-brand-mauve transition-colors mt-1.5"
            style={{ fontSize: "12px" }}
          >
            View Cart →
          </button>
        </div>
        <button onClick={onDismiss} className="text-brand-charcoal/30 hover:text-brand-charcoal transition-colors" aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

interface ProductInfoProps {
  product: Product
  categoryLabel: string
}

export function ProductInfo({ product, categoryLabel }: ProductInfoProps) {
  const dispatch = useAppDispatch()
  const sizeRef = useRef<HTMLDivElement>(null)

  const [selectedSize, setSelectedSize] = useState<ClothingSize | null>(null)
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0])
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [copied, setCopied] = useState(false)

  const isWishlisted = useAppSelector((s) =>
    s.wishlist.items.some((i) => i.id === product.id),
  )

  const savings = product.originalPrice ? product.originalPrice - product.price : 0

  const dispatchCart = useCallback(() => {
    if (!selectedSize) return
    for (let i = 0; i < qty; i++) {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: `৳${product.price.toLocaleString()}`,
        size: selectedSize,
        selectedColor,
        imgBg: "F5EFE6",
        imgFg: "2D2D2D",
        imgText: product.name.split(" ")[0] || "Item",
      }))
    }
  }, [dispatch, product, selectedSize, selectedColor, qty])

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setSizeError(false)
    dispatchCart()
    setShowToast(true)
  }

  const handleWishlist = () => {
    dispatch(toggleWishlist({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice ?? product.price,
      image: "",
      sizes: product.sizes,
      unavailableSizes: [],
      rating: product.rating,
      reviewCount: product.reviewCount,
      badge: product.badge,
      addedAt: new Date().toISOString(),
      imgBg: "F5EFE6",
      imgFg: "2D2D2D",
      imgText: product.name.split(" ")[0] || "Item",
    }))
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-5">

        {/* Brand */}
        <Link
          href={`/brands/${product.brand.toLowerCase().replace(/ /g, "-")}`}
          className="font-sans font-semibold uppercase tracking-widest text-brand-charcoal/55 hover:text-brand-rose transition-colors"
          style={{ fontSize: "12px" }}
        >
          {product.brand}
        </Link>

        {/* Product name */}
        <h1
          className="font-heading font-light text-brand-charcoal"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", lineHeight: 1.2 }}
        >
          {product.name}
        </h1>

        {/* Rating row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Stars rating={product.rating} />
          <span className="font-sans font-semibold text-brand-charcoal" style={{ fontSize: "13px" }}>
            {product.rating.toFixed(1)}
          </span>
          <a
            href="#reviews"
            className="font-sans text-brand-charcoal/50 hover:text-brand-rose transition-colors"
            style={{ fontSize: "13px" }}
          >
            {product.reviewCount} reviews
          </a>
          <span style={{ color: "var(--color-border)" }}>·</span>
          <span
            className="font-sans font-semibold rounded-full px-2.5 py-0.5"
            style={{
              fontSize: "11px",
              background: product.inStock ? "rgba(74,124,89,0.12)" : "rgba(192,97,122,0.12)",
              color: product.inStock ? "#4a7c59" : "var(--color-brand-rose)",
            }}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Price block */}
        <div
          className="flex items-baseline gap-3 flex-wrap py-3 px-4 rounded-xl"
          style={{ background: "var(--color-brand-beige)" }}
        >
          <span
            className="font-sans font-semibold text-brand-charcoal"
            style={{ fontSize: "1.5rem" }}
          >
            ৳{product.price.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span
                className="font-sans text-brand-charcoal/40 line-through"
                style={{ fontSize: "1rem" }}
              >
                ৳{product.originalPrice.toLocaleString()}
              </span>
              <span
                className="font-sans font-semibold rounded-full px-2.5 py-0.5 text-brand-ivory"
                style={{ fontSize: "11px", background: "var(--color-brand-rose)" }}
              >
                SAVE ৳{savings.toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* Fabric */}
        <p className="font-sans text-brand-charcoal/65" style={{ fontSize: "14px" }}>
          Fabric:{" "}
          <span className="font-medium text-brand-charcoal">{product.fabric}</span>
        </p>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--color-border-light)" }} />

        {/* Color selector */}
        <div>
          <p className="font-sans font-medium text-brand-charcoal mb-3" style={{ fontSize: "13px" }}>
            Color:{" "}
            <span className="font-semibold">{selectedColor.name}</span>
          </p>
          <div className="flex gap-2.5">
            {product.colors.map((c) => {
              const active = selectedColor.name === c.name
              const isLight = c.hex.toLowerCase().includes("f") && parseInt(c.hex.slice(1, 3), 16) > 220
              return (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  aria-label={c.name}
                  className="rounded-full transition-all hover:scale-110"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: c.hex,
                    border: active
                      ? "2.5px solid var(--color-brand-rose)"
                      : isLight
                      ? "1.5px solid var(--color-border)"
                      : "2.5px solid transparent",
                    boxShadow: active
                      ? "0 0 0 2px var(--color-brand-ivory), 0 0 0 4px var(--color-brand-rose)"
                      : "none",
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Size selector */}
        <div ref={sizeRef}>
          <div className="flex items-center justify-between mb-3">
            <p
              className="font-sans font-medium text-brand-charcoal"
              style={{
                fontSize: "13px",
                color: sizeError ? "var(--color-brand-rose)" : undefined,
              }}
            >
              Size
            </p>
            <button
              onClick={() => setShowSizeGuide(true)}
              className="font-sans font-medium text-brand-rose hover:text-brand-mauve transition-colors"
              style={{ fontSize: "13px" }}
            >
              Size Guide →
            </button>
          </div>
          {sizeError && (
            <p className="font-sans text-brand-rose mb-2" style={{ fontSize: "12px" }}>
              Please select a size to continue
            </p>
          )}
          <div
            className="flex flex-wrap gap-2 p-2 rounded-xl"
            style={{
              border: sizeError
                ? "2px solid var(--color-brand-rose)"
                : "1.5px solid var(--color-border-light)",
              background: sizeError ? "rgba(192,97,122,0.04)" : "transparent",
            }}
          >
            {ALL_SIZES.map((size) => {
              const available = product.sizes.includes(size)
              const selected = selectedSize === size
              return (
                <button
                  key={size}
                  disabled={!available}
                  onClick={() => {
                    if (!available) return
                    setSelectedSize(size)
                    setSizeError(false)
                  }}
                  className="rounded-full font-sans font-medium transition-all"
                  style={{
                    fontSize: "13px",
                    padding: "6px 14px",
                    background: selected
                      ? "var(--color-brand-rose)"
                      : available
                      ? "var(--color-brand-beige)"
                      : "transparent",
                    color: selected
                      ? "var(--color-brand-ivory)"
                      : available
                      ? "var(--color-brand-charcoal)"
                      : "var(--color-brand-charcoal)",
                    border: selected
                      ? "1.5px solid var(--color-brand-rose)"
                      : available
                      ? "1.5px solid var(--color-border)"
                      : "1.5px solid var(--color-border-light)",
                    opacity: available ? 1 : 0.35,
                    cursor: available ? "pointer" : "not-allowed",
                    textDecoration: available ? "none" : "line-through",
                  }}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <p className="font-sans font-medium text-brand-charcoal mb-3" style={{ fontSize: "13px" }}>
            Quantity
          </p>
          <div className="inline-flex items-center rounded-full overflow-hidden" style={{ border: "1.5px solid var(--color-border)" }}>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="w-10 h-10 flex items-center justify-center font-sans font-bold text-brand-charcoal hover:text-brand-rose transition-colors disabled:opacity-30"
              style={{ fontSize: "18px" }}
            >
              −
            </button>
            <span
              className="w-12 text-center font-sans font-semibold text-brand-charcoal select-none"
              style={{ fontSize: "14px" }}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              disabled={qty >= 10}
              className="w-10 h-10 flex items-center justify-center font-sans font-bold text-brand-charcoal hover:text-brand-rose transition-colors disabled:opacity-30"
              style={{ fontSize: "18px" }}
            >
              +
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-4 rounded-full font-sans font-semibold text-brand-ivory transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontSize: "15px",
              background: "var(--color-brand-rose)",
            }}
            onMouseEnter={(e) => { if (product.inStock) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-mauve)" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-rose)" }}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>

          <button
            onClick={handleWishlist}
            className="w-full py-3.5 rounded-full font-sans font-semibold flex items-center justify-center gap-2 transition-colors"
            style={{
              fontSize: "15px",
              background: isWishlisted ? "var(--color-brand-rose)" : "transparent",
              border: "1.5px solid var(--color-brand-rose)",
              color: isWishlisted ? "var(--color-brand-ivory)" : "var(--color-brand-rose)",
            }}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        {/* Delivery estimate */}
        <div
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{
            background: "var(--color-brand-beige)",
            border: "1px solid var(--color-border-light)",
          }}
        >
          {[
            {
              Icon: Truck,
              text: "Order before 3PM for same-day delivery in Dhaka Metro.",
            },
            {
              Icon: Package,
              text: "Standard delivery 2–3 days across Bangladesh.",
            },
            {
              Icon: RotateCcw,
              text: "7-day easy returns — no questions asked.",
            },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <Icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-brand-rose)" }} strokeWidth={1.75} />
              <p className="font-sans text-brand-charcoal/70" style={{ fontSize: "13px" }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Promo hint */}
        <p
          className="font-sans italic text-brand-charcoal/55"
          style={{ fontSize: "13px" }}
        >
          Use <strong className="not-italic font-semibold text-brand-charcoal">EID20</strong> for 20% off this item
        </p>

        {/* Share row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-sans text-brand-charcoal/45" style={{ fontSize: "12px" }}>
            Share:
          </span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-sans font-medium text-brand-charcoal/55 hover:text-brand-rose transition-colors"
            style={{ fontSize: "13px" }}
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            Facebook
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${product.name} — ৳${product.price.toLocaleString()} on FashionHub`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans font-medium text-brand-charcoal/55 hover:text-brand-rose transition-colors"
            style={{ fontSize: "13px" }}
          >
            WhatsApp
          </a>
          <button
            onClick={handleCopyLink}
            className="font-sans font-medium text-brand-charcoal/55 hover:text-brand-rose transition-colors"
            style={{ fontSize: "13px" }}
          >
            {copied ? "Copied ✓" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Size guide modal */}
      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}

      {/* Cart toast */}
      {showToast && selectedSize && (
        <CartToast
          productName={product.name}
          size={selectedSize}
          qty={qty}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </>
  )
}
