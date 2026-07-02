"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const slides = [
  {
    tag: "✨ Eid Special Collection",
    h1: "Dress for",
    h2: "the Occasion",
    sub: "Exclusive festive lawn suits and embroidered chiffon crafted for every celebration. Find your perfect outfit this Eid.",
    cta: "Shop Eid Collection",
    ctaHref: "/eid-special",
    bg: "from-[#3D1F2B] to-[#1a0d14]",
    imgBg: "E8A4B0",
    imgFg: "3D1F2B",
    imgText: "Eid+Collection",
  },
  {
    tag: "🆕 New Arrivals — Lawn & Kurta",
    h1: "Effortless",
    h2: "Elegance",
    sub: "Premium lawn suits and hand-crafted kurtas from Aarong, Yellow, and Khas. Style for the modern Bangladeshi woman.",
    cta: "Explore New Arrivals",
    ctaHref: "/new-arrivals",
    bg: "from-[#2D1F3D] to-[#1a0f24]",
    imgBg: "C9808F",
    imgFg: "ffffff",
    imgText: "New+Arrivals",
  },
  {
    tag: "🔥 Pakistani Lawn — Up to 40% Off",
    h1: "Sapphire &",
    h2: "Sana Safinaz",
    sub: "Up to 40% off on our finest Pakistani lawn collections. Gorgeous prints and embroidery at unbeatable prices.",
    cta: "Shop Pakistani Lawn",
    ctaHref: "/lawn-suit",
    bg: "from-[#1F2D3D] to-[#0d1a24]",
    imgBg: "F5EFE6",
    imgFg: "2D2D2D",
    imgText: "Pakistani+Lawn",
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  const goTo = (i: number) => setCurrent(i)

  const slide = slides[current]

  return (
    <div className={cn("bg-gradient-to-br transition-all duration-700", slide.bg)}>
      <div className="max-w-[1440px] mx-auto px-16 min-h-[580px] flex items-center relative">
        {/* Left: text */}
        <div className="flex-[0_0_52%] py-16 pr-14 relative z-10">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 bg-brand-gold/15 border border-brand-gold/35 rounded-full px-4 py-1.5 mb-7">
            <span className="text-[13px] font-bold text-brand-gold tracking-[0.4px]">
              {slide.tag}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[72px] font-extrabold text-white leading-[1.06] tracking-[-2.5px] m-0 animate-fade-up">
            {slide.h1}
          </h1>
          <h1 className="text-[72px] font-extrabold text-brand-gold leading-[1.06] tracking-[-2.5px] mb-7 animate-fade-up">
            {slide.h2}
          </h1>

          {/* Subtitle */}
          <p className="text-[17px] leading-[1.75] text-white/70 mb-11 max-w-[420px]">
            {slide.sub}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 mb-12">
            <Link
              href={slide.ctaHref}
              className="flex items-center gap-2.5 bg-brand-gold hover:bg-white text-white hover:text-brand-charcoal border-none rounded-[10px] px-9 py-4 text-base font-bold tracking-[0.3px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(212,160,23,0.35)]"
            >
              {slide.cta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/lookbook"
              className="flex items-center gap-2 bg-white/8 text-white/85 border border-white/18 rounded-[10px] px-7 py-[15px] text-[15px] font-semibold hover:bg-white/15 transition-all"
            >
              View Lookbook
            </Link>
          </div>

          {/* Slide dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2 rounded-full border-none cursor-pointer transition-all duration-300 outline-none p-0",
                  i === current ? "w-7 bg-brand-gold" : "w-2 bg-white/28 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right: outfit image */}
        <div className="flex-[0_0_48%] flex items-center justify-end pr-2">
          <img
            src={`https://placehold.co/500x400/${slide.imgBg}/${slide.imgFg}?text=${slide.imgText}`}
            alt="Hero Outfit"
            className="w-[500px] h-[400px] object-contain rounded-[20px] drop-shadow-[0_28px_48px_rgba(0,0,0,0.5)] transition-all duration-500"
          />
        </div>
      </div>
    </div>
  )
}
