import type { Metadata } from "next"
import Link from "next/link"
import { PRODUCTS, CATEGORIES } from "@/lib/data/products"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { ImageGallery } from "@/components/storefront/pdp/ImageGallery"
import { ProductInfo } from "@/components/storefront/pdp/ProductInfo"
import { PDPTabs } from "@/components/storefront/pdp/PDPTabs"
import { RelatedProducts } from "@/components/storefront/pdp/RelatedProducts"
import { RecentlyViewedPDP } from "@/components/storefront/pdp/RecentlyViewedPDP"

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = PRODUCTS.find((p) => p.id === Number(id))
  if (!product) return { title: "Product Not Found — FashionHub" }
  return {
    title: `${product.name} — ${product.brand} | FashionHub`,
    description: product.description.slice(0, 155),
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = PRODUCTS.find((p) => p.id === Number(id)) ?? null

  if (!product) {
    return (
      <div
        className="min-h-screen font-sans flex flex-col"
        style={{ background: "var(--color-brand-ivory)" }}
      >
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24">
          <p
            className="font-heading font-light text-brand-charcoal"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            Product Not Found
          </p>
          <p className="font-sans text-brand-charcoal/55" style={{ fontSize: "15px" }}>
            This product doesn&apos;t exist or may have been removed.
          </p>
          <Link
            href="/"
            className="mt-2 font-sans font-semibold px-8 py-3 rounded-full text-brand-ivory transition-colors"
            style={{ background: "var(--color-brand-rose)" }}
          >
            Back to Shop
          </Link>
        </div>
        <Footer />
        <WhatsAppFloat />
      </div>
    )
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  ).slice(0, 4)

  const categoryLabel =
    CATEGORIES.find((c) => c.id === product.category)?.label ??
    product.category.charAt(0).toUpperCase() + product.category.slice(1)

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "var(--color-brand-ivory)" }}
    >
      <AnnouncementBar />
      <Header />

      {/* Breadcrumb */}
      <div
        className="w-full"
        style={{
          background: "var(--color-brand-beige)",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 font-sans flex-wrap" style={{ fontSize: "13px" }}>
            <Link href="/" className="text-brand-charcoal/60 hover:text-brand-rose transition-colors">
              Home
            </Link>
            <span className="text-brand-charcoal/30">›</span>
            <Link
              href={`/category/${product.category}`}
              className="text-brand-charcoal/60 hover:text-brand-rose transition-colors"
            >
              {categoryLabel}
            </Link>
            <span className="text-brand-charcoal/30">›</span>
            <span className="text-brand-charcoal truncate max-w-[220px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main 60/40 split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Left — Image gallery (60%) */}
          <div className="w-full lg:w-[58%] flex-shrink-0 lg:sticky lg:top-[88px]">
            <ImageGallery product={product} />
          </div>

          {/* Right — Product info (40%) */}
          <div className="flex-1 min-w-0">
            <ProductInfo product={product} categoryLabel={categoryLabel} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <PDPTabs product={product} />

      {/* Related products */}
      <RelatedProducts relatedProducts={relatedProducts} category={product.category} />

      {/* Recently viewed */}
      <RecentlyViewedPDP currentProductId={product.id} />

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
