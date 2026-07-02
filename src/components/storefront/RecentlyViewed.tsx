"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./ProductCard"
import { PRODUCTS, getById } from "@/lib/data/products"
import { fetchProductById, normalizeProduct } from "@/lib/api/products"
import type { Product } from "@/lib/data/products"

const LS_KEY = "fh_recently_viewed"

const isBackendId = (id: string | number) => /^[0-9a-fA-F]{24}$/.test(String(id))

async function resolveProduct(id: string | number): Promise<Product | undefined> {
  if (isBackendId(id)) {
    const backendProduct = await fetchProductById(String(id))
    return backendProduct ? normalizeProduct(backendProduct) : undefined
  }
  return getById(id as number)
}

export function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const raw = localStorage.getItem(LS_KEY)
        if (!raw) return
        const ids: (string | number)[] = JSON.parse(raw)
        const resolved = await Promise.all(ids.map(resolveProduct))
        const found = resolved.filter((p): p is Product => p !== undefined)
        if (!cancelled) setProducts(found)
      } catch {
        // localStorage unavailable or malformed — stay empty
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  if (products.length < 3) return null

  return (
    <section
      className="w-full py-12"
      style={{ background: "var(--color-brand-ivory)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="font-heading font-light text-brand-charcoal mb-6"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2rem)", lineHeight: 1.15 }}
        >
          Recently Viewed
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
          {products.map((product) => (
            <div key={product._id ?? product.id} className="snap-start flex-shrink-0 w-[220px] sm:w-[240px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
