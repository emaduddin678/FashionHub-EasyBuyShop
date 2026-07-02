"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import type { Product } from "@/lib/data/products"

const BADGE_STYLES: Record<string, { bg: string; label: string }> = {
  new:      { bg: "var(--color-brand-charcoal)", label: "New" },
  sale:     { bg: "var(--color-brand-rose)",     label: "Sale" },
  featured: { bg: "var(--color-brand-mauve)",    label: "Featured" },
}

// Real backend products carry actual Cloudinary photos in `product.images`.
// Only fall back to generated placeholder tiles when a product has none
// (mock/demo products, or a real product with no photos uploaded yet).
function getSlides(product: Product): string[] {
  const real = product.images.filter((src) => src && !src.includes("/images/products/placeholder"))
  if (real.length > 0) return real

  const base = encodeURIComponent(product.name)
  const brand = encodeURIComponent(product.brand)
  return [
    `https://placehold.co/800x1067/F5EFE6/2D2D2D?text=${base}`,
    `https://placehold.co/800x1067/EDE0D4/2D2D2D?text=${brand}`,
    `https://placehold.co/800x1067/DDD0C4/2D2D2D?text=Detail`,
    `https://placehold.co/800x1067/F5EFE6/2D2D2D?text=Back`,
    `https://placehold.co/800x1067/EDE0D4/2D2D2D?text=Close-up`,
  ]
}

export function ImageGallery({ product }: { product: Product }) {
  const slides = getSlides(product)
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const badge = product.badge ? BADGE_STYLES[product.badge] : null

  const closeLightbox = useCallback(() => setLightbox(false), [])

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image — 3:4 aspect */}
        <div
          className="relative w-full overflow-hidden rounded-2xl cursor-zoom-in group"
          style={{ aspectRatio: "3/4", background: "var(--color-brand-beige)" }}
          onClick={() => setLightbox(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slides[active]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge */}
          {badge && (
            <span
              className="absolute top-4 left-4 font-sans font-semibold text-brand-ivory uppercase tracking-widest z-10 px-3 py-1 rounded-full"
              style={{ fontSize: "10px", background: badge.bg }}
            >
              {badge.label}
            </span>
          )}

          {/* Zoom hint */}
          <div
            className="absolute bottom-4 right-4 font-sans font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              fontSize: "11px",
              background: "rgba(253,250,246,0.85)",
              color: "var(--color-brand-charcoal)",
              backdropFilter: "blur(4px)",
            }}
          >
            Click to enlarge
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {slides.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className="flex-shrink-0 rounded-xl overflow-hidden transition-all"
              style={{
                width: "72px",
                height: "96px",
                border: active === i
                  ? "2px solid var(--color-brand-rose)"
                  : "2px solid var(--color-border-light)",
                opacity: active === i ? 1 : 0.65,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Product view ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox overlay */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ background: "rgba(28,28,28,0.92)" }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-brand-ivory transition-colors"
            style={{ background: "rgba(253,250,246,0.12)" }}
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>

          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            style={{ aspectRatio: "3/4", width: "min(560px, 90vw)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slides[active]}
              alt={product.name}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          {/* Lightbox thumbs */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i) }}
                className="rounded-full transition-all"
                style={{
                  width: active === i ? "24px" : "8px",
                  height: "8px",
                  background: active === i
                    ? "var(--color-brand-rose)"
                    : "rgba(253,250,246,0.35)",
                }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
