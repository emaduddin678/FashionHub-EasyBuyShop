"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/storefront/ProductCard"
import { PRODUCTS, type Product } from "@/lib/data/products"

const STORAGE_KEY = "fh_recently_viewed"
const MAX_ITEMS = 6

export function RecentlyViewedPDP({ currentProductId }: { currentProductId: number }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    try {
      const existing: number[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
      const updated = [
        currentProductId,
        ...existing.filter((id) => id !== currentProductId),
      ].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

      const others = updated
        .filter((id) => id !== currentProductId)
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined)

      setProducts(others)
    } catch {
      // localStorage not available
    }
  }, [currentProductId])

  if (products.length === 0) return null

  return (
    <section
      className="w-full py-12"
      style={{
        background: "var(--color-brand-ivory)",
        borderTop: "1px solid var(--color-border-light)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="font-heading font-light text-brand-charcoal mb-6"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.15 }}
        >
          Recently Viewed
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
          {products.map((p) => (
            <div key={p.id} className="snap-start flex-shrink-0 w-[220px] sm:w-[240px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
