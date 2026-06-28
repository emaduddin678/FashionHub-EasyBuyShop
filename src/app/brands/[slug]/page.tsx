import type { Metadata } from "next"
import { BRANDS } from "@/lib/data/products"
import BrandDetailPage from "@/components/pages/BrandDetailPage"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const brand = BRANDS.find((b) => b.id === slug)
  return {
    title: brand
      ? `${brand.name} — FashionHub`
      : "Brand — FashionHub",
    description: brand
      ? `Shop authentic ${brand.name} fashion on FashionHub. ${brand.productCount} styles available.`
      : "Shop authentic fashion on FashionHub.",
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <BrandDetailPage slug={slug} />
}
