"use client"

import Link from "next/link"
import Image from "next/image"
import { BRANDS } from "@/lib/data/products"

const ORIGIN_PILL: Record<"BD" | "PK", { label: string; style: string }> = {
  BD: { label: "Desi Pick",      style: "bg-[#7B9E87]/15 text-[#4a7c59]" },
  PK: { label: "Pakistani Lawn", style: "bg-brand-rose/12 text-brand-mauve" },
}

// Show the first 5 brands only on the homepage strip
const FEATURED_BRANDS = BRANDS.slice(0, 5)

export function BrandStrip() {
  return (
    <section
      className="w-full py-14"
      style={{ background: "var(--color-brand-beige)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-10">
          <p
            className="font-sans uppercase tracking-widest text-brand-charcoal/50 mb-2"
            style={{ fontSize: "11px" }}
          >
            EXCLUSIVE LABELS
          </p>
          <h2
            className="font-heading font-light text-brand-charcoal"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.375rem)", lineHeight: 1.15 }}
          >
            Browse by Brands
          </h2>
        </div>

        {/* Grid — 2 cols mobile, 5 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-5">
          {FEATURED_BRANDS.map((brand) => {
            const pill = ORIGIN_PILL[brand.origin]
            return (
              <Link
                key={brand.id}
                href={`/brands/${brand.id}`}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                style={{
                  boxShadow: "var(--shadow-card)",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"
                }}
              >
                {/* Logo */}
                <div className="relative w-full aspect-square flex items-center justify-center p-4">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 18vw"
                    className="object-contain p-4"
                  />
                </div>

                {/* Brand name */}
                <p
                  className="font-sans font-semibold text-brand-charcoal text-center"
                  style={{ fontSize: "14px" }}
                >
                  {brand.name}
                </p>

                {/* Origin pill */}
                <span
                  className={`font-sans font-medium rounded-full px-2.5 py-0.5 ${pill.style}`}
                  style={{ fontSize: "10px" }}
                >
                  {pill.label}
                </span>

                {/* Product count */}
                <p
                  className="font-sans text-brand-charcoal/50"
                  style={{ fontSize: "12px" }}
                >
                  {brand.productCount} pieces
                </p>
              </Link>
            )
          })}
        </div>

        {/* Show All link */}
        <div className="flex justify-center mt-8">
          <Link
            href="/brands"
            className="font-sans font-semibold text-sm px-8 py-3 rounded-full border border-brand-charcoal text-brand-charcoal hover:bg-brand-rose hover:border-brand-rose hover:text-brand-ivory transition-colors duration-200"
          >
            Show All Brands
          </Link>
        </div>

      </div>
    </section>
  )
}
