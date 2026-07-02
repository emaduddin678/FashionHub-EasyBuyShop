import type { MetadataRoute } from "next"
import { CATEGORIES } from "@/lib/data/products"
import { BLOG_POSTS } from "@/lib/data/blog"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://fashionhub.com.bd").replace(/\/$/, "")
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002"
const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || "fashionhub"

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>

const STATIC_ROUTES: { path: string; changeFrequency: ChangeFreq; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  ...CATEGORIES.map((c) => ({
    path: `/category/${c.id}`,
    changeFrequency: "daily" as ChangeFreq,
    priority: 0.9,
  })),
  { path: "/category/sale", changeFrequency: "daily", priority: 0.9 },
  { path: "/category/new-arrivals", changeFrequency: "daily", priority: 0.9 },
  { path: "/categories", changeFrequency: "weekly", priority: 0.6 },
  { path: "/best-sellers", changeFrequency: "weekly", priority: 0.7 },
  { path: "/brands", changeFrequency: "weekly", priority: 0.6 },
  { path: "/lookbook", changeFrequency: "weekly", priority: 0.5 },
  { path: "/eid-special", changeFrequency: "weekly", priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.5 },
  { path: "/about", changeFrequency: "monthly", priority: 0.4 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.4 },
  { path: "/delivery", changeFrequency: "monthly", priority: 0.4 },
  { path: "/returns", changeFrequency: "monthly", priority: 0.4 },
  { path: "/payment", changeFrequency: "monthly", priority: 0.4 },
  { path: "/size-guide", changeFrequency: "monthly", priority: 0.4 },
  { path: "/track", changeFrequency: "monthly", priority: 0.3 },
  { path: "/affiliates", changeFrequency: "monthly", priority: 0.3 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.3 },
  { path: "/press", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
]

interface SitemapProduct {
  _id: string
  updatedAt?: string
}

interface SitemapBrand {
  slug: string
}

async function fetchProductEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(
      `${API_URL}/api/products?status=active&limit=500&storeSlug=${STORE_SLUG}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    const data = await res.json()
    const items: SitemapProduct[] = data.payload?.items ?? []
    return items.map((p) => ({
      url: `${SITE_URL}/product/${p._id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch {
    // backend unavailable at build/request time — sitemap still serves static routes
    return []
  }
}

async function fetchBrandEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/api/admin/brands?active=true&limit=100`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    const brands: SitemapBrand[] = data.brands ?? []
    return brands.map((b) => ({
      url: `${SITE_URL}/brands/${b.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }))
  } catch {
    return []
  }
}

function blogEntries(): MetadataRoute.Sitemap {
  return BLOG_POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const [productEntries, brandEntries] = await Promise.all([
    fetchProductEntries(),
    fetchBrandEntries(),
  ])

  return [...staticEntries, ...productEntries, ...brandEntries, ...blogEntries()]
}
