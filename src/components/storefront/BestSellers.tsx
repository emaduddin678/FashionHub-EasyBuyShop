import Link from "next/link"
import { getBestSellers } from "@/lib/data/products"
import { fetchFeaturedProducts, normalizeProduct } from "@/lib/api/products"
import { ProductCard } from "./ProductCard"

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function BestSellersSkeleton() {
  return (
    <section
      className="w-full"
      style={{
        background: "var(--color-surface-muted)",
        paddingTop: "var(--space-section)",
        paddingBottom: "var(--space-section)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-3 w-24 bg-brand-charcoal/10 rounded-full mb-3 animate-pulse" />
          <div className="h-9 w-44 bg-brand-charcoal/10 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-brand-charcoal/10 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-[var(--radius-card)] overflow-hidden bg-white shadow-[var(--shadow-card)]">
              <div className="bg-brand-charcoal/8 animate-pulse" style={{ aspectRatio: "3/4" }} />
              <div className="p-4 space-y-2">
                <div className="h-2.5 w-16 bg-brand-charcoal/10 rounded animate-pulse" />
                <div className="h-4 w-36 bg-brand-charcoal/10 rounded animate-pulse" />
                <div className="h-3 w-24 bg-brand-charcoal/10 rounded animate-pulse" />
                <div className="h-4 w-20 bg-brand-charcoal/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export async function BestSellers() {
  let products = getBestSellers()

  try {
    const apiProducts = await fetchFeaturedProducts(8)
    if (apiProducts.length > 0) {
      products = apiProducts.map((p, i) => normalizeProduct(p, i))
    }
  } catch {
    // fall back to local mock data
  }

  const displayed = products.slice(0, 8)

  return (
    <section
      className="w-full"
      style={{
        background: "var(--color-surface-muted)",
        paddingTop: "var(--space-section)",
        paddingBottom: "var(--space-section)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-8">
          <p
            className="font-sans uppercase tracking-widest text-brand-charcoal/50 mb-2"
            style={{ fontSize: "11px" }}
          >
            MOST LOVED
          </p>
          <h2
            className="font-heading font-light text-brand-charcoal mb-2"
            style={{ fontSize: "clamp(2rem, 4vw, 2.625rem)", lineHeight: 1.15 }}
          >
            Best Sellers
          </h2>
          <p className="font-sans text-brand-charcoal/60" style={{ fontSize: "15px" }}>
            The pieces our customers keep coming back for.
          </p>
        </div>

        {/* Mobile: horizontal scroll  |  Desktop: 4-col grid */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {displayed.map((product, i) => (
            <div key={product.id} className="snap-start flex-shrink-0 w-[180px]">
              <ProductCard product={product} rank={i + 1} />
            </div>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-4 gap-5">
          {displayed.map((product, i) => (
            <ProductCard key={product.id} product={product} rank={i + 1} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Link
            href="/best-sellers"
            className="font-sans font-semibold text-sm px-8 py-3 rounded-full bg-brand-rose text-brand-ivory hover:bg-brand-mauve transition-colors duration-200"
          >
            Shop Best Sellers
          </Link>
        </div>

      </div>
    </section>
  )
}
