"use client"

import { useState } from "react"
import Link from "next/link"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { BRANDS } from "@/lib/data/products"
import { ArrowRight, ShieldCheck, RotateCcw, Tag, Award } from "lucide-react"

type Filter = "All" | "BD Labels" | "Pakistani Lawn"

const BRAND_DESCRIPTIONS: Record<string, string> = {
  Aarong: "Bangladesh's iconic fair-trade label. Handloom, block print, and artisan craft since 1978.",
  Yellow: "Contemporary Bangladeshi fashion. Modern silhouettes, accessible prices, trend-led collections.",
  Khas: "Handloom cotton and linen by local weavers. Minimal, natural, and sustainably made.",
  Sapphire: "Pakistan's leading summer lawn house. Digital prints and embroidered formals, season after season.",
  "Sana Safinaz": "Premium Pakistani fashion. Luxury chiffon, zari embellishment, and festive-occasion formals.",
  Johra: "Accessories and dupatta specialist. Chikankari, silk, and statement pieces for finishing looks.",
  "Gul Ahmed": "Pakistan's heritage lawn brand since 1953. Signature prints and the iconic Ideas sub-line.",
  Libas: "Contemporary Pakistani fusion wear. Embroidered maxi dresses and layered chiffon styles.",
}

const whyUs = [
  { icon: ShieldCheck, label: "100% Authentic",   sub: "Sourced direct from brand distributors" },
  { icon: Award,       label: "Brand Guarantee",  sub: "Official warranty on every piece" },
  { icon: RotateCcw,  label: "Free Returns",      sub: "7-day hassle-free return policy" },
  { icon: Tag,        label: "Best Prices",       sub: "Competitive pricing guaranteed" },
]

export default function BrandsPage() {
  const [filter, setFilter] = useState<Filter>("All")

  const visible = BRANDS.filter((b) => {
    if (filter === "BD Labels")     return b.origin === "BD"
    if (filter === "Pakistani Lawn") return b.origin === "PK"
    return true
  })

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      {/* Hero */}
      <div
        className="py-20 text-center px-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--color-brand-beige) 0%, var(--color-brand-rose) 100%)" }}
      >
        {/* Subtle geometric bg marks */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 40%)",
          }}
        />
        <div className="relative z-10">
          <h1
            className="font-heading text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 3.25rem)", letterSpacing: "-0.01em", lineHeight: 1.1 }}
          >
            Discover Our Brands
          </h1>
          <p
            className="mt-4 mx-auto max-w-xl"
            style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}
          >
            From Dhaka&apos;s favourite local labels to Pakistan&apos;s most iconic lawns.
          </p>
          <p
            className="mt-2"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}
          >
            {BRANDS.length} brands &nbsp;·&nbsp; 500+ styles &nbsp;·&nbsp; 100% authentic
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="sticky top-0 z-20 py-3 px-5"
        style={{
          background: "var(--color-brand-ivory)",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          {(["All", "BD Labels", "Pakistani Lawn"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: filter === f ? "var(--color-brand-rose)" : "transparent",
                color: filter === f ? "#fff" : "var(--color-brand-charcoal)",
                border: filter === f ? "1.5px solid var(--color-brand-rose)" : "1.5px solid var(--color-border)",
                opacity: filter === f ? 1 : 0.7,
              }}
            >
              {f}
              <span
                className="ml-1.5 text-xs"
                style={{ opacity: 0.65 }}
              >
                {f === "All"
                  ? BRANDS.length
                  : f === "BD Labels"
                  ? BRANDS.filter((b) => b.origin === "BD").length
                  : BRANDS.filter((b) => b.origin === "PK").length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand grid */}
      <div className="max-w-5xl mx-auto px-5 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {visible.map((brand) => {
            const isBD = brand.origin === "BD"
            return (
              <div
                key={brand.id}
                className="flex flex-col rounded-xl p-7 transition-all"
                style={{
                  background: "var(--color-brand-beige)",
                  border: "1.5px solid var(--color-border-light)",
                  boxShadow: "var(--shadow-card)",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card-hover)"
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-brand-rose)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)"
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border-light)"
                }}
              >
                {/* Logo placeholder */}
                <div
                  className="flex items-center justify-center rounded-lg mb-5"
                  style={{
                    height: 80,
                    background: "#fff",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <span
                    className="font-heading"
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                      color: "var(--color-brand-charcoal)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {brand.name}
                  </span>
                </div>

                {/* Origin badge */}
                <span
                  className="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                  style={{
                    background: isBD ? "rgba(90,138,106,0.12)" : "rgba(200,140,150,0.15)",
                    color: isBD ? "#5a8a6a" : "var(--color-brand-rose)",
                  }}
                >
                  {isBD ? "BD Label" : "Pakistani Lawn"}
                </span>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "var(--color-brand-charcoal)", opacity: 0.7 }}
                >
                  {BRAND_DESCRIPTIONS[brand.name]}
                </p>

                {/* Product count */}
                <p
                  className="text-xs mt-3 mb-4"
                  style={{ color: "var(--color-brand-charcoal)", opacity: 0.45 }}
                >
                  {brand.productCount} styles available
                </p>

                {/* CTA */}
                <Link
                  href={`/brands/${brand.id}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    border: "1.5px solid var(--color-brand-rose)",
                    color: "var(--color-brand-rose)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = "var(--color-brand-rose)"
                    el.style.color = "#fff"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = "transparent"
                    el.style.color = "var(--color-brand-rose)"
                  }}
                >
                  Shop {brand.name}
                  <ArrowRight size={14} />
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Why FashionHub */}
      <div
        className="py-14"
        style={{ background: "var(--color-brand-beige)", borderTop: "1px solid var(--color-border-light)" }}
      >
        <div className="max-w-5xl mx-auto px-5">
          <h2
            className="font-heading text-center mb-10"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--color-brand-charcoal)" }}
          >
            Why buy from FashionHub?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {whyUs.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center p-5 rounded-xl"
                style={{ background: "#fff", border: "1px solid var(--color-border)" }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
                  style={{ background: "var(--color-brand-rose)" }}
                >
                  <Icon size={18} color="#fff" />
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--color-brand-charcoal)" }}>
                  {label}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-brand-charcoal)", opacity: 0.55 }}>
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
