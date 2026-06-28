import type { Metadata } from "next"
import CategoryProductListingPage from "@/components/pages/CategoryProductListingPage"
import { CATEGORIES } from "@/lib/data/products"

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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <CategoryProductListingPage category={slug} />
}
