import type { Metadata } from "next"
import CategoryProductListingPage from "@/components/pages/CategoryProductListingPage"
import { CATEGORIES, getByCategory, getOnSale, getNewArrivals, type Product, type ProductCategory } from "@/lib/data/products"
import { fetchProductsByCategory, normalizeProduct } from "@/lib/api/products"

const VALID_SLUGS = [
  ...CATEGORIES.map((c) => c.id),
  "sale",
  "new-arrivals",
]

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES.find((c) => c.id === slug)
  const label = cat?.label ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `Shop ${label} — FashionHub Bangladesh`,
    description: `Browse our curated ${label} collection. Free shipping above ৳2,000.`,
  }
}

const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id))

function getMockProducts(category: string): Product[] {
  if (CATEGORY_IDS.has(category as ProductCategory)) return getByCategory(category as ProductCategory)
  if (category === "sale") return getOnSale()
  if (category === "new-arrivals") return getNewArrivals()
  return []
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let initialProducts = getMockProducts(slug)
  try {
    const apiProducts = await fetchProductsByCategory(slug)
    if (apiProducts.length > 0) {
      initialProducts = apiProducts.map((p, i) => normalizeProduct(p, i))
    }
  } catch {
    // fall back to local mock data
  }

  return <CategoryProductListingPage category={slug} initialProducts={initialProducts} />
}
