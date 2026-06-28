"use client"

import Link from "next/link"
import { ProductCard } from "@/components/storefront/ProductCard"
import type { Product, ProductCategory } from "@/lib/data/products"

interface RelatedProductsProps {
  relatedProducts: Product[]
  category: ProductCategory
}

export function RelatedProducts({ relatedProducts, category }: RelatedProductsProps) {
  if (relatedProducts.length === 0) return null

  return (
    <section
      className="w-full"
      style={{
        background: "var(--color-brand-beige)",
        paddingTop: "var(--space-section)",
        paddingBottom: "var(--space-section)",
        borderTop: "1px solid var(--color-border-light)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <h2
            className="font-heading font-light text-brand-charcoal"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2rem)", lineHeight: 1.15 }}
          >
            You May Also Like
          </h2>
          <Link
            href={`/${category}`}
            className="font-sans font-semibold text-brand-rose hover:text-brand-mauve transition-colors border-b border-brand-rose hover:border-brand-mauve"
            style={{ fontSize: "14px" }}
          >
            View All →
          </Link>
        </div>

        {/* 4-col grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
