"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { ProductCard } from "@/components/storefront/ProductCard"
import { PRODUCTS, getFeatured, getByCategory } from "@/lib/data/products"

// Mock Eid date — adjust as needed
const EID_DATE = new Date("2025-03-30T06:00:00")

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(Math.max(0, target.getTime() - Date.now()))

  useEffect(() => {
    const id = setInterval(() => setDiff(Math.max(0, target.getTime() - Date.now())), 1000)
    return () => clearInterval(id)
  }, [target])

  const totalSecs = Math.floor(diff / 1000)
  const days  = Math.floor(totalSecs / 86400)
  const hours = Math.floor((totalSecs % 86400) / 3600)
  const mins  = Math.floor((totalSecs % 3600) / 60)
  const secs  = totalSecs % 60
  return { days, hours, mins, secs, ended: diff === 0 }
}

function CountBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <div
        className="w-14 h-14 flex items-center justify-center rounded-xl"
        style={{ background: "var(--color-brand-rose)" }}
      >
        <span className="font-heading text-white" style={{ fontSize: "1.75rem", lineHeight: 1 }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
        {label}
      </span>
    </div>
  )
}

const CATEGORY_TILES = [
  { label: "Lawn Suits",   href: "/category/lawn-suit",  bg: "2D1B20" },
  { label: "Chiffon",      href: "/category/lawn-suit",  bg: "3D2233" },
  { label: "Embroidered",  href: "/category/dress",      bg: "251B30" },
  { label: "Kurtas",       href: "/category/kurta",      bg: "1E2535" },
  { label: "Accessories",  href: "/category/accessory",  bg: "2A1E1E" },
]

// Featured or lawn-suit products for the seasonal grid
const SEASONAL_PRODUCTS = [
  ...getFeatured(),
  ...getByCategory("lawn-suit"),
].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i).slice(0, 8)

// CSS keyframes injected once
const STYLE = `
@keyframes fh-promo-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.75; }
}
@keyframes fh-marquee-eid {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`

export default function EidSpecialPage() {
  const { days, hours, mins, secs, ended } = useCountdown(EID_DATE)

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-charcoal)" }}>
      <style>{STYLE}</style>
      <AnnouncementBar />
      <Header />

      {/* Promo strip */}
      <div
        className="py-3 text-center text-sm font-semibold tracking-widest uppercase"
        style={{
          background: "var(--color-brand-rose)",
          color: "#fff",
          animation: "fh-promo-pulse 3s ease-in-out infinite",
          letterSpacing: "0.12em",
        }}
      >
        USE CODE EID20 FOR 20% OFF YOUR ENTIRE ORDER
      </div>

      {/* Hero */}
      <div
        className="relative pt-24 pb-20 px-5 text-center overflow-hidden"
        style={{
          background: "var(--color-brand-charcoal)",
        }}
      >
        {/* Geometric pattern overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(232,164,176,0.04) 0px, rgba(232,164,176,0.04) 1px, transparent 1px, transparent 40px),
              repeating-linear-gradient(-45deg, rgba(232,164,176,0.03) 0px, rgba(232,164,176,0.03) 1px, transparent 1px, transparent 40px)
            `,
          }}
        />
        {/* Gold/rose glows */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 40%, rgba(212,160,68,0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 60%, rgba(232,164,176,0.08) 0%, transparent 50%)",
          }}
        />

        {/* Decorative stars */}
        {["top-8 left-10", "top-12 right-16", "top-6 left-1/2", "bottom-12 left-20", "bottom-8 right-24"].map((pos, i) => (
          <span
            key={i}
            aria-hidden
            className={`absolute ${pos} select-none pointer-events-none`}
            style={{
              color: "var(--color-brand-rose)",
              opacity: 0.2 + i * 0.05,
              fontSize: [28, 20, 16, 24, 18][i],
            }}
          >
            ✦
          </span>
        ))}

        <div className="relative z-10">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: "var(--color-brand-rose)", letterSpacing: "0.2em" }}
          >
            ✦ &nbsp; Eid Special Collection &nbsp; ✦
          </p>

          <h1
            className="font-heading text-white"
            style={{
              fontSize: "clamp(2.75rem, 7vw, 4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Eid Collection &apos;25
          </h1>

          <p
            className="mt-4 mx-auto"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              color: "rgba(255,255,255,0.8)",
              maxWidth: 480,
              lineHeight: 1.6,
            }}
          >
            Dress for every celebration. New arrivals weekly.
          </p>

          {/* Countdown */}
          <div className="mt-8">
            {ended ? (
              <p className="text-sm" style={{ color: "var(--color-brand-rose)" }}>
                Eid Mubarak!
              </p>
            ) : (
              <>
                <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>
                  EID IN
                </p>
                <div className="flex items-start justify-center gap-3">
                  <CountBox value={days}  label="Days"  />
                  <span className="font-heading text-white/30 mt-3 text-2xl">:</span>
                  <CountBox value={hours} label="Hours" />
                  <span className="font-heading text-white/30 mt-3 text-2xl">:</span>
                  <CountBox value={mins}  label="Mins"  />
                  <span className="font-heading text-white/30 mt-3 text-2xl">:</span>
                  <CountBox value={secs}  label="Secs"  />
                </div>
              </>
            )}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/category/kurta"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: "var(--color-brand-rose)", color: "#fff" }}
            >
              Shop Women&apos;s <ArrowRight size={15} />
            </Link>
            <Link
              href="/category/dress"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:bg-white/10"
              style={{ border: "1.5px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.85)" }}
            >
              Shop Girls&apos; <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Category tiles */}
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-5">
          {CATEGORY_TILES.map(({ label, href, bg }) => (
            <Link
              key={label}
              href={href}
              className="flex-shrink-0 flex items-center justify-between rounded-xl px-4 py-3.5 group transition-all hover:scale-105"
              style={{
                background: `#${bg}`,
                border: "1px solid rgba(255,255,255,0.08)",
                minWidth: 140,
              }}
            >
              <span className="text-sm font-medium text-white">{label}</span>
              <ArrowRight size={14} color="rgba(255,255,255,0.4)" />
            </Link>
          ))}
        </div>
      </div>

      {/* Featured products */}
      <div className="max-w-5xl mx-auto px-5 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2
            className="font-heading text-white"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            Curated for the Season
          </h2>
          <Link
            href="/category/kurta"
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--color-brand-rose)" }}
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEASONAL_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="rounded-xl overflow-hidden"
              style={{ background: "#1E1E1E" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling offers marquee */}
      <div
        className="py-4 overflow-hidden"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "fh-marquee-eid 22s linear infinite" }}
        >
          {[...Array(2)].map((_, di) =>
            ["✦ Free gift wrapping on all Eid orders", "✦ Up to 40% off select styles", "✦ Free delivery on orders above ৳2,000", "✦ Use code EID20 for 20% off", "✦ Authentic Pakistani lawn — limited stock"].map(
              (text, i) => (
                <span
                  key={`${di}-${i}`}
                  className="text-sm font-medium mx-8"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {text}
                </span>
              )
            )
          )}
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
