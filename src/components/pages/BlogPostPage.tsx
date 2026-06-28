"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { ProductCard } from "@/components/storefront/ProductCard"
import { PRODUCTS } from "@/lib/data/products"
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/lib/data/blog"
import type { BlogCategory } from "@/lib/data/blog"

const CATEGORY_STYLE: Record<BlogCategory, { bg: string; color: string }> = {
  "Style Tips":     { bg: "rgba(200,140,150,0.15)", color: "var(--color-brand-rose)" },
  "Seasonal Edits": { bg: "rgba(90,138,106,0.12)",  color: "#5a8a6a" },
  "Brand Stories":  { bg: "rgba(45,45,45,0.08)",    color: "var(--color-brand-charcoal)" },
  "Care Guides":    { bg: "rgba(212,160,68,0.12)",  color: "#a07828" },
}

interface Props {
  slug: string
}

export default function BlogPostPage({ slug }: Props) {
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
        <AnnouncementBar />
        <Header />
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <h1
            className="font-heading mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", color: "var(--color-brand-charcoal)" }}
          >
            Article not found
          </h1>
          <Link href="/blog" className="text-sm" style={{ color: "var(--color-brand-rose)" }}>
            ← Back to Style Notes
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const relatedProducts = post.relatedProductIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PRODUCTS

  const relatedPosts = getRelatedPosts(slug)
  const catStyle = CATEGORY_STYLE[post.category]

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      <main className="max-w-3xl mx-auto px-5 py-12">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-60"
          style={{ color: "var(--color-brand-charcoal)" }}
        >
          <ArrowLeft size={14} /> Style Notes
        </Link>

        {/* Category pill */}
        <span
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={catStyle}
        >
          {post.category}
        </span>

        {/* Title */}
        <h1
          className="font-heading mb-5 leading-tight"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            color: "var(--color-brand-charcoal)",
            letterSpacing: "-0.02em",
          }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <div
          className="flex items-center gap-4 mb-8 text-sm"
          style={{ color: "var(--color-brand-charcoal)", opacity: 0.45 }}
        >
          <span className="flex items-center gap-1.5">
            <User size={13} /> {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} /> {post.date}
          </span>
        </div>

        {/* Cover image */}
        <div className="overflow-hidden rounded-2xl mb-10" style={{ aspectRatio: "16/9" }}>
          <img
            src={`https://placehold.co/900x506/${post.coverBg}/${post.coverFg}?text=${encodeURIComponent(post.title.split(" ").slice(0, 4).join("+"))}`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body */}
        <div className="space-y-5 mb-14">
          {post.body.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: "var(--color-brand-charcoal)",
                opacity: 0.78,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Divider */}
        <hr style={{ borderColor: "var(--color-border-light)", marginBottom: 40 }} />

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mb-14">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "var(--color-brand-charcoal)", opacity: 0.4, letterSpacing: "0.15em" }}
            >
              Products mentioned in this article
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "var(--color-brand-charcoal)", opacity: 0.4, letterSpacing: "0.15em" }}
            >
              You might also enjoy
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {relatedPosts.map((rp) => {
                const rCatStyle = CATEGORY_STYLE[rp.category]
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group flex gap-4 p-4 rounded-xl transition-all"
                    style={{
                      background: "#fff",
                      border: "1.5px solid var(--color-border)",
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand-rose)"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"
                    }}
                  >
                    <div className="overflow-hidden rounded-lg shrink-0" style={{ width: 80, height: 80 }}>
                      <img
                        src={`https://placehold.co/160x160/${rp.coverBg}/${rp.coverFg}?text=${encodeURIComponent(rp.title.split(" ")[0])}`}
                        alt={rp.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5 inline-block"
                        style={rCatStyle}
                      >
                        {rp.category}
                      </span>
                      <p
                        className="text-sm font-medium leading-snug line-clamp-2"
                        style={{ color: "var(--color-brand-charcoal)" }}
                      >
                        {rp.title}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--color-brand-charcoal)", opacity: 0.4 }}
                      >
                        {rp.date}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
