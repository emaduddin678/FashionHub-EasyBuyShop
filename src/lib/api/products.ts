import { apiFetch } from "./client"
import type { Product, Brand, ProductCategory, Fabric, ProductBadge, ProductColor } from "@/lib/data/products"

const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || "fashionhub"

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
  longDescription?: string
  features?: string[]
  brand?: string
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
  ratingAverage?: number
  reviewCount?: number
  mainCategory: BackendCategory | null
  subCategory: BackendCategory | null
  childCategory?: BackendCategory | null
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

interface ApiSingleProductResponse {
  success: boolean
  message: string
  payload: BackendProduct
}

export interface BackendReview {
  _id: string
  userId: string
  userName: string
  rating: number
  title?: string
  comment: string
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
}

interface ApiReviewsResponse {
  success: boolean
  message: string
  payload: {
    reviews: BackendReview[]
    total: number
    page: number
    totalPages: number
    averageRating: number
    ratingDistribution: Record<string, number>
  }
}

// ── Best-effort mapping from backend taxonomy to the FashionHub catalog shape ──

const KNOWN_BRANDS: Brand[] = ["Aarong", "Yellow", "Khas", "Sapphire", "Sana Safinaz", "Johra", "Gul Ahmed", "Libas"]

const CATEGORY_KEYWORDS: Record<ProductCategory, string[]> = {
  kurta: ["kurta"],
  "lawn-suit": ["lawn", "suit", "unstitched", "shalwar", "kameez"],
  saree: ["saree", "sari"],
  dress: ["dress", "gown", "frock"],
  pant: ["pant", "palazzo", "trouser"],
  accessory: ["dupatta", "belt", "accessory", "scarf", "shawl"],
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
  tan: "#C9A668",
}

function inferBrand(title: string): Brand {
  const match = KNOWN_BRANDS.find((b) => title.toLowerCase().includes(b.toLowerCase()))
  return match ?? "Yellow"
}

function inferCategory(p: BackendProduct): ProductCategory {
  const haystack = `${p.title} ${p.mainCategory?.name ?? ""} ${p.subCategory?.name ?? ""} ${p.childCategory?.name ?? ""} ${(p.keywords ?? []).join(" ")}`.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [ProductCategory, string[]][]) {
    if (keywords.some((kw) => haystack.includes(kw))) return category
  }
  return "kurta"
}

function colorFromName(name: string): ProductColor {
  const hex = COLOR_HEX[name.trim().toLowerCase()] ?? "#C9BBA8"
  return { name, hex }
}

/** `p.discountPercent` comes back null on every live product even when
 *  regularPrice > sellingPrice (confirmed against the running backend) —
 *  computed here instead of trusted, so the "sale" badge actually fires. */
function computeDiscountPercent(p: BackendProduct): number {
  if (p.regularPrice <= p.sellingPrice || p.regularPrice <= 0) return 0
  return Math.round(((p.regularPrice - p.sellingPrice) / p.regularPrice) * 100)
}

function buildBadge(p: BackendProduct): ProductBadge {
  const discount = computeDiscountPercent(p)
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
    _id: p._id,
    id: index + 1,
    name: p.title,
    // Prefer the real backend brand; only guess from the title when it's blank.
    brand: p.brand?.trim() || inferBrand(p.title),
    category: inferCategory(p),
    fabric: "Cotton" as Fabric,
    sizes: sizes.length ? sizes : ["M"],
    colors: colors.length ? colors : [{ name: "Default", hex: "#C9BBA8" }],
    price: p.sellingPrice,
    originalPrice: hasDiscount ? p.regularPrice : undefined,
    images: images.length ? images : ["/images/products/placeholder.jpg"],
    badge: buildBadge(p),
    rating: p.ratingAverage || 4.2,
    reviewCount: p.reviewCount ?? p.viewCount ?? 0,
    inStock: p.totalStock > 0,
    description: p.shortDescription,
    sku: p.variants[0]?.sku ?? p._id,
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** Featured / best-seller products for the homepage BestSellers section. */
export async function fetchFeaturedProducts(limit = 8): Promise<BackendProduct[]> {
  const data = await apiFetch<ApiListResponse>("/api/products", {
    query: { status: "active", isFeatured: true, limit, sortBy: "createdAt", sortOrder: "desc", storeSlug: STORE_SLUG },
  })
  return data.payload.items
}

/** Newest active products for the NewArrivals section. */
export async function fetchNewArrivals(limit = 8): Promise<BackendProduct[]> {
  const data = await apiFetch<ApiListResponse>("/api/products", {
    query: { status: "active", limit, sortBy: "createdAt", sortOrder: "desc", storeSlug: STORE_SLUG },
  })
  return data.payload.items
}

/** Products with the highest discount for the FlashSale section. */
export async function fetchFlashSaleProducts(limit = 4): Promise<BackendProduct[]> {
  const data = await apiFetch<ApiListResponse>("/api/products", {
    query: { status: "active", limit, sortBy: "price", sortOrder: "asc", storeSlug: STORE_SLUG },
  })
  // Filter to only products that actually have a discount, prefer deepest discounts
  const withDiscount = data.payload.items.filter((p) => p.regularPrice > p.sellingPrice)
  if (withDiscount.length >= limit) return withDiscount.slice(0, limit)
  // If not enough discounted items, pad with any active products
  return data.payload.items.slice(0, limit)
}

/** Fetch a single product by its MongoDB _id. Returns null on any error. */
export async function fetchProductById(id: string): Promise<BackendProduct | null> {
  try {
    const data = await apiFetch<ApiSingleProductResponse>(`/api/products/${id}`)
    return data.payload
  } catch {
    return null
  }
}

/**
 * Fetch active products from the same main category as a given product,
 * excluding the current product. Used for "Related Products" on the PDP.
 */
export async function fetchRelatedProducts(
  mainCategoryId: string,
  excludeId: string,
  limit = 4,
): Promise<BackendProduct[]> {
  try {
    const data = await apiFetch<ApiListResponse>("/api/products", {
      query: {
        status: "active",
        mainCategory: mainCategoryId,
        limit: limit + 2,
        sortBy: "createdAt",
        sortOrder: "desc",
        storeSlug: STORE_SLUG,
      },
    })
    return data.payload.items.filter((p) => p._id !== excludeId).slice(0, limit)
  } catch {
    return []
  }
}

/** Fetch paginated reviews for a product. */
export async function fetchProductReviews(
  productId: string,
  params: Record<string, string | number> = {},
): Promise<ApiReviewsResponse["payload"]> {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  ).toString()
  const data = await apiFetch<ApiReviewsResponse>(
    `/api/products/${productId}/reviews${qs ? `?${qs}` : ""}`,
  )
  return data.payload
}

/**
 * Fetches active products for a PLP category page (kurta / saree / sale / etc).
 *
 * The backend doesn't share FashionHub's fashion taxonomy directly, so we fetch
 * this store's active catalog and reuse the same title/category/keyword
 * inference `normalizeProduct` relies on, via `inferCategory`, to bucket each
 * product into one of FashionHub's category slugs.
 */
export async function fetchProductsByCategory(
  category: string,
  limit = 100,
): Promise<BackendProduct[]> {
  const data = await apiFetch<ApiListResponse>("/api/products", {
    query: { status: "active", limit, sortBy: "createdAt", sortOrder: "desc", storeSlug: STORE_SLUG },
  })
  const items = data.payload.items

  if (category === "sale") return items.filter((p) => p.regularPrice > p.sellingPrice)
  if (category === "new-arrivals") {
    return items.filter((p) => (Date.now() - new Date(p.createdAt).getTime()) / 86_400_000 <= 14)
  }
  return items.filter((p) => inferCategory(p) === category)
}

/**
 * Fetches this store's active products made by a given brand.
 *
 * The backend's product list endpoint has no `brand` query filter, so we fetch
 * the active catalog and match on the product's own `brand` field client-side.
 */
export async function fetchProductsByBrandName(brandName: string, limit = 100): Promise<BackendProduct[]> {
  const data = await apiFetch<ApiListResponse>("/api/products", {
    query: { status: "active", limit, sortBy: "createdAt", sortOrder: "desc", storeSlug: STORE_SLUG },
  })
  const target = brandName.trim().toLowerCase()
  return data.payload.items.filter((p) => p.brand?.trim().toLowerCase() === target)
}
