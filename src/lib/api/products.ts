import { apiFetch } from "./client"
import type { Product, Brand, ProductCategory, Fabric, ProductBadge, ProductColor } from "@/lib/data/products"

// ── Backend response shapes ────────────────────────────────────────────────────

interface BackendVariant {
  sku: string
  size: string
  color: string
  stock: number
}

interface BackendCategory {
  _id: string
  name: string
  slug: string
}

export interface BackendProduct {
  _id: string
  title: string
  slug: string
  shortDescription: string
  purchasePrice: number
  regularPrice: number
  sellingPrice: number
  primaryImage: string
  additionalImages: string[]
  status: "active" | "draft" | "archived"
  isActive: boolean
  isFeatured: boolean
  variants: BackendVariant[]
  totalStock: number
  discountPercent: number
  mainCategory: BackendCategory | null
  subCategory: BackendCategory | null
  keywords: string[]
  viewCount: number
  createdAt: string
  updatedAt: string
}

interface ApiListResponse {
  success: boolean
  message: string
  payload: {
    items: BackendProduct[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// ── Best-effort mapping from backend taxonomy to the FashionHub catalog shape ──

const KNOWN_BRANDS: Brand[] = ["Aarong", "Yellow", "Khas", "Sapphire", "Sana Safinaz", "Johra", "Gul Ahmed", "Libas"]

const CATEGORY_KEYWORDS: Record<ProductCategory, string[]> = {
  kurta: ["kurta"],
  "lawn-suit": ["lawn", "suit", "unstitched"],
  saree: ["saree", "sari"],
  dress: ["dress", "gown"],
  pant: ["pant", "palazzo", "trouser"],
  accessory: ["dupatta", "belt", "accessory", "scarf"],
}

const COLOR_HEX: Record<string, string> = {
  black: "#1B1B1B",
  white: "#F7F4ED",
  red: "#B3122E",
  maroon: "#6E1423",
  pink: "#E8B4BC",
  blue: "#1F2A44",
  green: "#3C6E47",
  beige: "#E8DCC8",
  gold: "#B8860B",
  grey: "#3A3A3A",
  gray: "#3A3A3A",
  yellow: "#D9A02C",
}

function inferBrand(title: string): Brand {
  const match = KNOWN_BRANDS.find((b) => title.toLowerCase().includes(b.toLowerCase()))
  return match ?? "Yellow"
}

function inferCategory(p: BackendProduct): ProductCategory {
  const haystack = `${p.title} ${p.mainCategory?.name ?? ""} ${p.subCategory?.name ?? ""}`.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [ProductCategory, string[]][]) {
    if (keywords.some((kw) => haystack.includes(kw))) return category
  }
  return "kurta"
}

function colorFromName(name: string): ProductColor {
  const hex = COLOR_HEX[name.trim().toLowerCase()] ?? "#C9BBA8"
  return { name, hex }
}

function buildBadge(p: BackendProduct): ProductBadge {
  const discount = p.discountPercent ?? 0
  if (discount >= 10) return "sale"
  if (p.isFeatured) return "featured"
  const ageMs = Date.now() - new Date(p.createdAt).getTime()
  const ageDays = ageMs / 86_400_000
  if (ageDays <= 14) return "new"
  return null
}

// ── Normalizer: BackendProduct → Product (ProductCard-compatible) ─────────────

export function normalizeProduct(p: BackendProduct, index = 0): Product {
  const hasDiscount = p.regularPrice > p.sellingPrice
  const images = [p.primaryImage, ...p.additionalImages].filter(Boolean)
  const sizes = Array.from(new Set(p.variants.map((v) => v.size))).filter(
    (s): s is Product["sizes"][number] => ["XS", "S", "M", "L", "XL", "XXL"].includes(s)
  )
  const colors = Array.from(new Set(p.variants.map((v) => v.color))).map(colorFromName)

  return {
    id: index + 1,
    name: p.title,
    brand: inferBrand(p.title),
    category: inferCategory(p),
    fabric: "Cotton" as Fabric,
    sizes: sizes.length ? sizes : ["M"],
    colors: colors.length ? colors : [{ name: "Default", hex: "#C9BBA8" }],
    price: p.sellingPrice,
    originalPrice: hasDiscount ? p.regularPrice : undefined,
    images: images.length ? images : ["/images/products/placeholder.jpg"],
    badge: buildBadge(p),
    rating: 4.2,
    reviewCount: p.viewCount ?? 0,
    inStock: p.totalStock > 0,
    description: p.shortDescription,
    sku: p.variants[0]?.sku ?? p._id,
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** Featured / best-seller products for the homepage BestSellers section. */
export async function fetchFeaturedProducts(limit = 8): Promise<BackendProduct[]> {
  const data = await apiFetch<ApiListResponse>("/api/products", {
    query: { status: "active", isFeatured: true, limit, sortBy: "createdAt", sortOrder: "desc" },
  })
  return data.payload.items
}

/** Newest active products for the NewArrivals section. */
export async function fetchNewArrivals(limit = 8): Promise<BackendProduct[]> {
  const data = await apiFetch<ApiListResponse>("/api/products", {
    query: { status: "active", limit, sortBy: "createdAt", sortOrder: "desc" },
  })
  return data.payload.items
}

/** Products with the highest discount for the FlashSale section. */
export async function fetchFlashSaleProducts(limit = 4): Promise<BackendProduct[]> {
  const data = await apiFetch<ApiListResponse>("/api/products", {
    query: { status: "active", limit, sortBy: "price", sortOrder: "asc" },
  })
  // Filter to only products that actually have a discount, prefer deepest discounts
  const withDiscount = data.payload.items.filter((p) => p.regularPrice > p.sellingPrice)
  if (withDiscount.length >= limit) return withDiscount.slice(0, limit)
  // If not enough discounted items, pad with any active products
  return data.payload.items.slice(0, limit)
}
