"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { ProductCard } from "@/components/storefront/ProductCard"
import { PRODUCTS } from "@/lib/data/products"

// Products for each chapter strip — reuse real product objects by id
function byIds(ids: number[]) {
  return ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS
}

const CHAPTERS = [
  {
    id: "everyday-kurta",
    title: "The Everyday Kurta",
    sub: "Chapter 1",
    story:
      "The kurta is Bangladesh's most democratic garment. It moves from morning commute to afternoon meeting to evening dinner without asking anything of you — just the right fit, the right fabric, and the right confidence.",
    cta: { label: "Shop Kurtas", href: "/kurta" },
    imgBg: "EAD5C8",
    imgFg: "2D2D2D",
    imgLabel: "Everyday+Kurta",
    imgAspect: "3/4",
    layout: "image-left",
    productIds: [1, 3, 5, 6],
  },
  {
    id: "lawn-season",
    title: "Lawn Season",
    sub: "Chapter 2",
    story:
      "When the heat arrives — and in Bangladesh it always arrives — fine lawn becomes the only rational choice. Pakistani lawn houses like Sapphire and Sana Safinaz have spent decades perfecting this fabric for exactly this climate.",
    cta: { label: "Shop Lawn Suits", href: "/lawn-suit" },
    imgBg: "D8E8D5",
    imgFg: "2D2D2D",
    imgLabel: "Lawn+Season",
    imgAspect: "3/4",
    layout: "image-right",
    productIds: [7, 9, 10, 11],
  },
  {
    id: "festive-evenings",
    title: "Festive Evenings",
    sub: "Chapter 3",
    story:
      "Eid, weddings, and celebrations call for something that earns a second glance. Embroidered chiffon, zari borders, and carefully considered drape — clothes that understand the occasion.",
    cta: { label: "Shop Festive", href: "/dress" },
    imgBg: "2D1B20",
    imgFg: "E8A4B0",
    imgLabel: "Festive+Evenings",
    imgAspect: "16/7",
    layout: "full-width",
    productIds: [4, 9, 12, 18],
  },
  {
    id: "street-contemporary",
    title: "Street & Contemporary",
    sub: "Chapter 4",
    story:
      "Contemporary Bangladeshi style doesn't choose between local and global — it takes the best of both. Wide-leg linen trousers with a handloom kurta. A satin slip dress with a block-print dupatta.",
    cta: { label: "Shop Contemporary", href: "/kurta" },
    imgBg: "E8DDD5",
    imgFg: "2D2D2D",
    imgLabel: "Street+Style",
    imgAspect: "1/1",
    layout: "mosaic",
    productIds: [6, 16, 20, 22],
    mosaicImages: [
      { bg: "D5C8E8", fg: "2D2D2D", label: "Urban+Kurta" },
      { bg: "C8D5E8", fg: "2D2D2D", label: "Denim+Vibes" },
    ],
  },
] as const

export default function LookbookPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      {/* Full-width hero */}
      <div
        className="relative overflow-hidden flex items-end"
        style={{ height: "60vh", minHeight: 400 }}
      >
        <img
          src={`https://placehold.co/1400x800/2D2D2D/E8A4B0?text=FashionHub+Volume+I`}
          alt="Lookbook hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
          }}
        />
        <div className="relative z-10 px-8 sm:px-14 pb-10 sm:pb-14">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.2em" }}
          >
            The FashionHub Lookbook
          </p>
          <h1
            className="font-heading text-white"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Volume I &mdash; Timeless
          </h1>
        </div>
      </div>

      {/* Chapters */}
      <div className="max-w-5xl mx-auto px-5">
        {CHAPTERS.map((chapter) => (
          <section
            key={chapter.id}
            id={chapter.id}
            className="py-16"
            style={{ borderBottom: "1px solid var(--color-border-light)" }}
          >
            {/* Chapter heading — always full width */}
            <div className="mb-8">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-brand-rose)", letterSpacing: "0.18em" }}
              >
                {chapter.sub}
              </p>
              <h2
                className="font-heading"
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  color: "var(--color-brand-charcoal)",
                  letterSpacing: "-0.01em",
                }}
              >
                {chapter.title}
              </h2>
            </div>

            {/* Layout variants */}
            {chapter.layout === "image-left" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={`https://placehold.co/560x750/${chapter.imgBg}/${chapter.imgFg}?text=${chapter.imgLabel}`}
                    alt={chapter.title}
                    className="w-full object-cover transition-transform duration-700 hover:scale-103"
                    style={{ aspectRatio: chapter.imgAspect as string }}
                  />
                </div>
                <div>
                  <p
                    className="text-base leading-relaxed mb-6"
                    style={{ color: "var(--color-brand-charcoal)", opacity: 0.7, maxWidth: 420 }}
                  >
                    {chapter.story}
                  </p>
                  <Link
                    href={chapter.cta.href}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ border: "1.5px solid var(--color-brand-rose)", color: "var(--color-brand-rose)" }}
                  >
                    {chapter.cta.label} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {chapter.layout === "image-right" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
                <div className="order-2 md:order-1">
                  <p
                    className="text-base leading-relaxed mb-6"
                    style={{ color: "var(--color-brand-charcoal)", opacity: 0.7, maxWidth: 420 }}
                  >
                    {chapter.story}
                  </p>
                  <Link
                    href={chapter.cta.href}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ border: "1.5px solid var(--color-brand-rose)", color: "var(--color-brand-rose)" }}
                  >
                    {chapter.cta.label} <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="order-1 md:order-2 overflow-hidden rounded-2xl">
                  <img
                    src={`https://placehold.co/560x750/${chapter.imgBg}/${chapter.imgFg}?text=${chapter.imgLabel}`}
                    alt={chapter.title}
                    className="w-full object-cover transition-transform duration-700 hover:scale-103"
                    style={{ aspectRatio: chapter.imgAspect as string }}
                  />
                </div>
              </div>
            )}

            {chapter.layout === "full-width" && (
              <div className="mb-10">
                <div
                  className="relative overflow-hidden rounded-2xl flex items-end"
                  style={{ minHeight: 340 }}
                >
                  <img
                    src={`https://placehold.co/1100x500/${chapter.imgBg}/${chapter.imgFg}?text=${chapter.imgLabel}`}
                    alt={chapter.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                    }}
                  />
                  <div className="relative z-10 p-8 sm:p-12">
                    <p
                      className="text-base leading-relaxed mb-5 max-w-lg"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {chapter.story}
                    </p>
                    <Link
                      href={chapter.cta.href}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ background: "var(--color-brand-rose)", color: "#fff" }}
                    >
                      {chapter.cta.label} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {chapter.layout === "mosaic" && (
              <div className="mb-10">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {(chapter as typeof CHAPTERS[3]).mosaicImages.map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl">
                      <img
                        src={`https://placehold.co/540x540/${img.bg}/${img.fg}?text=${img.label}`}
                        alt={img.label.replace(/\+/g, " ")}
                        className="w-full object-cover transition-transform duration-700 hover:scale-103"
                        style={{ aspectRatio: "1/1" }}
                      />
                    </div>
                  ))}
                </div>
                <p
                  className="text-base leading-relaxed mb-6 max-w-lg"
                  style={{ color: "var(--color-brand-charcoal)", opacity: 0.7 }}
                >
                  {chapter.story}
                </p>
                <Link
                  href={chapter.cta.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ border: "1.5px solid var(--color-brand-rose)", color: "var(--color-brand-rose)" }}
                >
                  {chapter.cta.label} <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Product strip */}
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--color-brand-charcoal)", opacity: 0.4, letterSpacing: "0.15em" }}
              >
                Featured in this chapter
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {byIds(chapter.productIds as unknown as number[]).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Instagram strip */}
      <div
        className="py-14"
        style={{ background: "var(--color-brand-beige)", borderTop: "1px solid var(--color-border-light)" }}
      >
        <div className="max-w-5xl mx-auto px-5 text-center">
          <h2
            className="font-heading mb-2"
            style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)", color: "var(--color-brand-charcoal)" }}
          >
            #FashionHub on Instagram
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--color-brand-charcoal)", opacity: 0.55 }}>
            Tag us for a chance to be featured &nbsp;·&nbsp; @fashionhubbd
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              ["EAD5C8", "2D2D2D"], ["D8E8D5", "2D2D2D"], ["D5C8E8", "2D2D2D"],
              ["E8D5D8", "2D2D2D"], ["C8E8E5", "2D2D2D"], ["E8E5C8", "2D2D2D"],
            ].map(([bg, fg], i) => (
              <div key={i} className="overflow-hidden rounded-xl">
                <img
                  src={`https://placehold.co/200x200/${bg}/${fg}?text=📸`}
                  alt={`Community look ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
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
