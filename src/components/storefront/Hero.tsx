"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const SLIDES = [
  {
    tagline: "Be You, Beautifully.",
    sub: "Discover handpicked kurtas, lawn suits & sarees for every occasion.",
    cta1: { label: "Shop New Arrivals", href: "/new-arrivals" },
    cta2: { label: "Explore Lookbook", href: "/lookbook" },
    image: "/images/hero/hero-1.jpg",
  },
  {
    tagline: "Festive Season, Perfectly Dressed.",
    sub: "Curated Eid & party collections from Aarong, Sapphire, Sana Safinaz.",
    cta1: { label: "Shop Festive Edit", href: "/eid-special" },
    cta2: { label: "Browse Collections", href: "/categories" },
    image: "/images/hero/hero-2.jpg",
  },
  {
    tagline: "Pakistani Lawn, Delivered to Your Door.",
    sub: "Authentic Gul Ahmed, Sana Safinaz & Sapphire — now shipping across BD.",
    cta1: { label: "Shop Lawn Suits", href: "/category/lawn-suit" },
    cta2: { label: "See All Brands", href: "/brands" },
    image: "/images/hero/hero-3.jpg",
  },
] as const

const ANNOUNCEMENT =
  "FREE SHIPPING ON ORDERS OVER ৳2,000 · USE CODE EID20 FOR 20% OFF · CASH ON DELIVERY AVAILABLE"

export default function Hero() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback(
    (index: number) => {
      setVisible(false)
      setTimeout(() => {
        setActive(index)
        setVisible(true)
      }, 300)
    },
    []
  )

  const next = useCallback(() => goTo((active + 1) % SLIDES.length), [active, goTo])
  const prev = useCallback(() => goTo((active - 1 + SLIDES.length) % SLIDES.length), [active, goTo])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, 5000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active, paused, next])

  const slide = SLIDES[active]

  return (
    <section>
      {/* ── Carousel ─────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "100dvh", minHeight: "480px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 transition-opacity duration-[600ms] ease-in-out"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <Image
            src={slide.image}
            alt={slide.tagline}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Left-third overlay — desktop */}
        <div
          className="absolute inset-y-0 left-0 w-full md:w-[55%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(45,45,45,0.82) 0%, rgba(45,45,45,0.38) 75%, transparent 100%)",
          }}
        />

        {/* Bottom gradient — mobile */}
        <div
          className="md:hidden absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(45,45,45,0.88) 0%, rgba(45,45,45,0.38) 60%, transparent 100%)",
          }}
        />

        {/* Text block */}
        <div
          className="absolute inset-0 flex items-center"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 600ms ease-in-out" }}
        >
          <div className="w-full md:w-[52%] px-6 sm:px-10 md:px-16 lg:px-20 py-10 md:py-0 flex flex-col items-start justify-end md:justify-center">
            <p
              className="font-heading font-light leading-tight text-white mb-4"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}
            >
              {slide.tagline}
            </p>
            <p
              className="font-sans text-white/60 mb-8 max-w-sm"
              style={{ fontSize: "1rem", lineHeight: "1.6" }}
            >
              {slide.sub}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={slide.cta1.href}
                className="inline-block bg-brand-rose hover:bg-brand-mauve text-white font-sans font-semibold text-sm px-7 py-3 rounded-full transition-colors duration-200"
              >
                {slide.cta1.label}
              </Link>
              <Link
                href={slide.cta2.href}
                className="inline-block border border-brand-ivory/60 hover:border-brand-ivory text-brand-ivory font-sans font-semibold text-sm px-7 py-3 rounded-full transition-colors duration-200 hover:bg-white/10"
              >
                {slide.cta2.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-brand-charcoal/40 hover:bg-brand-charcoal/70 text-white transition-colors duration-200 z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-brand-charcoal/40 hover:bg-brand-charcoal/70 text-white transition-colors duration-200 z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                background: i === active ? "#E8A4B0" : "rgba(45,45,45,0.30)",
                transform: i === active ? "scale(1.25)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Announcement strip ────────────────────────────────── */}
      <div
        className="w-full overflow-hidden py-2.5"
        style={{ background: "var(--color-brand-charcoal)" }}
      >
        {/* Mobile — scrolling marquee */}
        <div className="md:hidden flex whitespace-nowrap">
          <span
            className="animate-marquee inline-block font-sans text-brand-ivory/90 uppercase tracking-widest"
            style={{ fontSize: "11px" }}
            aria-hidden="true"
          >
            {ANNOUNCEMENT}&nbsp;&nbsp;&nbsp;&nbsp;{ANNOUNCEMENT}&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>

        {/* Desktop — static centered */}
        <p
          className="hidden md:block text-center font-sans text-brand-ivory/90 uppercase tracking-widest select-none"
          style={{ fontSize: "13px" }}
        >
          {ANNOUNCEMENT}
        </p>
      </div>
    </section>
  )
}
