"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { ProductCard } from "@/components/storefront/ProductCard"
import { fetchBrandBySlug, type BackendBrand } from "@/lib/api/brands"
import { fetchProductsByBrandName, normalizeProduct } from "@/lib/api/products"
import type { Product } from "@/lib/data/products"

const BRAND_STORIES: Record<string, { tagline: string; paras: string[] }> = {
  Aarong: {
    tagline: "Celebrating Bangladeshi craft for over four decades.",
    paras: [
      "Aarong was founded in 1978 as a BRAC social enterprise with a simple but ambitious mission: to provide fair-trade livelihoods to artisans across Bangladesh. Today it is the country's most beloved fashion brand — and one that has never strayed from its founding purpose.",
      "Every Aarong piece tells a story. The handloom weavers of Tangail and Mirpur, the block-printing artisans of Rajshahi, the nakshi-kantha embroiderers of rural Bangladesh — their work lives in every garment. Buying Aarong is buying heritage.",
      "FashionHub is an authorised Aarong retail partner. Every piece in our Aarong collection is genuine, quality-guaranteed, and responsibly sourced. Our current range includes block-print cotton kurtas, handwoven Jamdani sarees, and embroidered silk accessories.",
    ],
  },
  Yellow: {
    tagline: "Contemporary Bangladeshi fashion for the modern woman.",
    paras: [
      "Yellow launched in the early 2000s with a clear brief: bring international fashion sensibilities to Bangladesh without losing touch with local taste. It succeeded, and in doing so created an entirely new category of modern Bangladeshi fashion.",
      "The Yellow aesthetic is clean, contemporary, and consistently wearable. A-line cuts, georgette festive lines, satin slip dresses, wide-leg linen trousers — the brand thinks in terms of complete wardrobes rather than individual pieces.",
      "On FashionHub, you'll find Yellow's seasonal kurta and dress collections alongside their accessories line. Yellow pieces ship fast — their popularity means stock moves quickly, so we recommend ordering as soon as you see something you like.",
    ],
  },
  Khas: {
    tagline: "Handloom cotton and linen by Bangladesh's local weavers.",
    paras: [
      "Khas was founded on a commitment to sustainable fashion long before sustainability became a trend. Their entire line is built around natural fabrics — handloom cotton, linen, and muslin — woven by artisan cooperatives across Bangladesh.",
      "The design philosophy is deliberately understated. Natural dye tones, minimal prints, and clean silhouettes that prioritise comfort without sacrificing style. Khas is the brand you reach for on a warm Dhaka morning when you want to feel composed without trying too hard.",
      "Our Khas range on FashionHub covers their kurta and pant lines — the ideal foundation pieces for building a versatile everyday wardrobe.",
    ],
  },
  Sapphire: {
    tagline: "Pakistan's most accessible luxury lawn house.",
    paras: [
      "Sapphire has, in under two decades, become one of the most recognised fashion names in South Asia. Founded in Lahore in 2014, the brand built its reputation on high-quality lawn fabric, considered colour work, and prints that walk the line between traditional and contemporary.",
      "Each season's lawn collection generates genuine anticipation — both in Pakistan and increasingly in Bangladesh, where Sapphire's aesthetic has found an enthusiastic audience. Their digital-print florals and geometric patterns have a sophistication that distinguishes them from lower-tier lawn producers.",
      "FashionHub stocks Sapphire's seasonal summer lawn and embroidered formals collections. All pieces are imported directly from authorised Pakistani distributors and are fully authentic.",
    ],
  },
  "Sana Safinaz": {
    tagline: "Premium Pakistani fashion for the woman who refuses to compromise.",
    paras: [
      "Sana Safinaz is arguably Pakistan's most prestigious ready-to-wear fashion house. Founded by designers Sana Hashwani and Safinaz Muneer in Karachi, the brand has defined luxury South Asian fashion for three decades.",
      "Their embroidered chiffon suits are in a category of their own — painstakingly finished with zardozi, mirror work, and silk threadwork that can represent hundreds of hours of craft. The Luxury Lawn festive edits, meanwhile, are among the most sought-after seasonal releases in the region.",
      "At FashionHub, Sana Safinaz pieces represent our premium tier. These are investment purchases — garments you wear to the most important occasions and keep for years. Every piece is sourced direct from authorised Pakistani partners.",
    ],
  },
  Johra: {
    tagline: "Dupattas, accessories, and the finishing touches that define a look.",
    paras: [
      "Johra occupies a specific and important niche in Bangladeshi fashion: beautiful, well-made accessories that elevate any outfit. Their chikankari cotton dupattas, embellished silk scarves, and stretch belts are the kind of pieces that transform a basic kurta into a complete look.",
      "The brand's approach is detail-oriented — they understand that the dupatta is often the first thing someone notices about an outfit, and that a well-chosen accessory can carry even a simple base piece into formal territory.",
      "Browse our Johra range on FashionHub for dupattas and belts that work with both Bangladeshi and Pakistani collections.",
    ],
  },
  "Gul Ahmed": {
    tagline: "Pakistan's original lawn house, since 1953.",
    paras: [
      "Gul Ahmed is the category-creator. Founded in Karachi in 1953, the brand essentially invented the Pakistani lawn as a fashion category — establishing the conventions of the multi-piece printed set that every subsequent label has built upon.",
      "Their Ideas sub-brand provides excellent everyday lawn at accessible price points (৳2,800–৳3,500 on our platform). The premium Residency Club and Signature lines represent their more elaborate embellished work, favoured for formal occasions.",
      "Gul Ahmed on FashionHub: we stock their seasonal lawn collections as they release. Heritage prints with lasting quality — the kind of pieces that get passed between sisters and aunts across generations.",
    ],
  },
  Libas: {
    tagline: "Pakistani fusion wear for the contemporary South Asian wardrobe.",
    paras: [
      "Libas represents a newer wave of Pakistani fashion — less anchored in traditional silhouettes, more interested in the conversations between South Asian style and global fashion. Their embroidered maxi dresses and layered chiffon pieces have found particular resonance with younger Bangladeshi buyers.",
      "The brand excels at embellishment that feels modern rather than ornate — zari details on simple georgette bases, floral embroidery on clean-cut maxi silhouettes. Pieces that work for Eid celebrations but could also be styled down for a dinner.",
      "Our Libas range covers their dress and formal wear lines. All pieces are imported from authorised Pakistani distributors.",
    ],
  },
}

interface Props {
  slug: string
}

export default function BrandDetailPage({ slug }: Props) {
  const [brand, setBrand] = useState<BackendBrand | null | undefined>(undefined)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let cancelled = false
    fetchBrandBySlug(slug).then(async (b) => {
      if (cancelled) return
      setBrand(b)
      if (b) {
        const raw = await fetchProductsByBrandName(b.name).catch(() => [])
        if (!cancelled) setProducts(raw.map((p, i) => normalizeProduct(p, i)))
      }
    })
    return () => { cancelled = true }
  }, [slug])

  if (brand === undefined) {
    return (
      <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
        <AnnouncementBar />
        <Header />
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <p className="text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}>Loading…</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
        <AnnouncementBar />
        <Header />
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <h1
            className="font-heading mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", color: "var(--color-brand-charcoal)" }}
          >
            Brand not found
          </h1>
          <Link href="/brands" className="text-sm" style={{ color: "var(--color-brand-rose)" }}>
            ← Back to all brands
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const story = BRAND_STORIES[brand.name]

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      {/* Banner */}
      <div
        className="relative py-20 px-5 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-brand-beige) 0%, var(--color-brand-rose) 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 60%, rgba(255,255,255,0.10) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.07) 0%, transparent 45%)",
          }}
        />
        <div className="relative z-10">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 mb-6 text-sm transition-opacity hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <ArrowLeft size={14} /> All brands
          </Link>

          <div
            className="inline-flex items-center justify-center rounded-xl mb-5 mx-auto"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "14px 32px",
            }}
          >
            <span
              className="font-heading text-white"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.01em" }}
            >
              {brand.name}
            </span>
          </div>

          {story && (
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", maxWidth: 520, margin: "0 auto" }}>
              {story.tagline}
            </p>
          )}

          <div className="flex items-center justify-center gap-4 mt-5">
            <span
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.75)" }}
            >
              {products.length} {products.length === 1 ? "style" : "styles"}
            </span>
          </div>
        </div>
      </div>

      {/* Brand story */}
      {story && (
        <div className="max-w-3xl mx-auto px-5 py-14">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--color-brand-rose)" }}
          >
            Brand Story
          </span>
          <div className="mt-4 space-y-4">
            {story.paras.map((para, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div
        className="py-14"
        style={{ background: "var(--color-brand-beige)", borderTop: "1px solid var(--color-border-light)" }}
      >
        <div className="max-w-5xl mx-auto px-5">
          <h2
            className="font-heading mb-8"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--color-brand-charcoal)" }}
          >
            {brand.name} Collection
          </h2>

          {products.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
              No products available right now — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
