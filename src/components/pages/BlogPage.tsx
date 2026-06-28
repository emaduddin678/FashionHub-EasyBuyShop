"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { BLOG_POSTS } from "@/lib/data/blog"
import type { BlogCategory } from "@/lib/data/blog"

const FILTERS: Array<"All" | BlogCategory> = [
  "All",
  "Style Tips",
  "Seasonal Edits",
  "Brand Stories",
  "Care Guides",
]

const CATEGORY_STYLE: Record<BlogCategory, { bg: string; color: string }> = {
  "Style Tips":     { bg: "rgba(200,140,150,0.15)", color: "var(--color-brand-rose)" },
  "Seasonal Edits": { bg: "rgba(90,138,106,0.12)",  color: "#5a8a6a" },
  "Brand Stories":  { bg: "rgba(45,45,45,0.08)",    color: "var(--color-brand-charcoal)" },
  "Care Guides":    { bg: "rgba(212,160,68,0.12)",  color: "#a07828" },
}

export default function BlogPage() {
  const [filter, setFilter]   = useState<"All" | BlogCategory>("All")
  const [search, setSearch]   = useState("")

  const filtered = BLOG_POSTS.filter((p) => {
    const matchCat = filter === "All" || p.category === filter
    const q = search.trim().toLowerCase()
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    return matchCat && matchQ
  })

  const featured = BLOG_POSTS[0]

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      {/* Hero */}
      <div
        className="py-20 px-5 text-center"
        style={{ background: "var(--color-brand-beige)", borderBottom: "1px solid var(--color-border-light)" }}
      >
        <h1
          className="font-heading mb-3"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            color: "var(--color-brand-charcoal)",
            letterSpacing: "-0.02em",
          }}
        >
          Style Notes
        </h1>
        <p style={{ fontSize: 16, color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
          Fashion tips, seasonal guides &amp; style stories.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-14">

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div
            className="relative flex-1"
            style={{ maxWidth: 340 }}
          >
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-brand-charcoal)", opacity: 0.35 }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors"
              style={{
                border: "1.5px solid var(--color-border)",
                color: "var(--color-brand-charcoal)",
                background: "#fff",
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3.5 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: filter === f ? "var(--color-brand-rose)" : "transparent",
                  color: filter === f ? "#fff" : "var(--color-brand-charcoal)",
                  border: filter === f ? "1.5px solid var(--color-brand-rose)" : "1.5px solid var(--color-border)",
                  opacity: filter === f ? 1 : 0.65,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Featured post */}
        {filter === "All" && !search && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group block mb-10 rounded-2xl overflow-hidden transition-all"
            style={{
              background: "#fff",
              border: "1.5px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
                <img
                  src={`https://placehold.co/700x440/${featured.coverBg}/${featured.coverFg}?text=${encodeURIComponent(featured.title.split(" ").slice(0, 3).join("+"))}`}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ position: "absolute", inset: 0 }}
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span
                  className="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-4"
                  style={CATEGORY_STYLE[featured.category]}
                >
                  {featured.category}
                </span>
                <h2
                  className="font-heading mb-3 leading-tight"
                  style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)", color: "var(--color-brand-charcoal)" }}
                >
                  {featured.title}
                </h2>
                <p
                  className="text-sm leading-relaxed mb-5 line-clamp-3"
                  style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}
                >
                  {featured.excerpt}
                </p>
                <p className="text-xs mb-5" style={{ color: "var(--color-brand-charcoal)", opacity: 0.4 }}>
                  {featured.author} &nbsp;·&nbsp; {featured.date}
                </p>
                <span
                  className="self-start text-sm font-semibold transition-opacity group-hover:opacity-70"
                  style={{ color: "var(--color-brand-rose)" }}
                >
                  Read More →
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={32} style={{ margin: "0 auto 12px", color: "var(--color-brand-rose)", opacity: 0.3 }} />
            <p className="font-heading text-lg mb-1" style={{ color: "var(--color-brand-charcoal)" }}>
              No articles found
            </p>
            <p className="text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.45 }}>
              Try a different search term or browse all categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((post) => {
              const catStyle = CATEGORY_STYLE[post.category]
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl overflow-hidden transition-all"
                  style={{
                    background: "#fff",
                    border: "1.5px solid var(--color-border)",
                    boxShadow: "var(--shadow-card)",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)"
                    ;(e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand-rose)"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"
                    ;(e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"
                  }}
                >
                  {/* Cover */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <img
                      src={`https://placehold.co/560x315/${post.coverBg}/${post.coverFg}?text=${encodeURIComponent(post.title.split(" ").slice(0, 3).join("+"))}`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span
                      className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={catStyle}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3
                      className="font-heading leading-snug mb-2"
                      style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.2rem)", color: "var(--color-brand-charcoal)" }}
                    >
                      {post.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1"
                      style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}
                    >
                      {post.excerpt}
                    </p>
                    <div
                      className="flex items-center gap-1.5 text-xs mb-3"
                      style={{ color: "var(--color-brand-charcoal)", opacity: 0.4 }}
                    >
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>
                    <span
                      className="text-sm font-semibold transition-opacity group-hover:opacity-70"
                      style={{ color: "var(--color-brand-rose)" }}
                    >
                      Read More →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
