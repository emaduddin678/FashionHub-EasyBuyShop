import type { Metadata } from "next"
import { fetchBrands, fetchBrandBySlug } from "@/lib/api/brands"
import BrandDetailPage from "@/components/pages/BrandDetailPage"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const brands = await fetchBrands()
    return brands.map((b) => ({ slug: b.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const brand = await fetchBrandBySlug(slug)
  return {
    title: brand ? `${brand.name} — FashionHub` : "Brand — FashionHub",
    description: brand
      ? `Shop authentic ${brand.name} products on FashionHub.`
      : "Shop authentic fashion on FashionHub.",
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <BrandDetailPage slug={slug} />
}
