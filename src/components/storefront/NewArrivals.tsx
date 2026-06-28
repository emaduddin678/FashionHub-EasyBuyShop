import Link from "next/link"
import { getNewArrivals } from "@/lib/data/products"
import { fetchNewArrivals, normalizeProduct } from "@/lib/api/products"
import { NewArrivalsClient } from "./NewArrivalsClient"

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function NewArrivalsSkeleton() {
  return (
    <section
      className="w-full"
      style={{
        background: "var(--color-brand-ivory)",
        paddingTop: "var(--space-section)",
        paddingBottom: "var(--space-section)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-3 w-24 bg-brand-charcoal/10 rounded-full mb-3 animate-pulse" />
          <div className="h-9 w-48 bg-brand-charcoal/10 rounded animate-pulse mb-2" />
          <div className="h-4 w-72 bg-brand-charcoal/10 rounded animate-pulse" />
        </div>
        <div className="flex gap-2 mb-8">
          {[100, 72, 96, 76, 80].map((w) => (
            <div key={w} className="h-9 rounded-full animate-pulse bg-brand-charcoal/10" style={{ width: `${w}px` }} />
          ))}
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

// ── Server component — fetches data then hands off to client ──────────────────

export async function NewArrivals() {
  let products = getNewArrivals()

  try {
    const apiProducts = await fetchNewArrivals(8)
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
        background: "var(--color-brand-ivory)",
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
            JUST LANDED
          </p>
          <h2
            className="font-heading font-light text-brand-charcoal mb-2"
            style={{ fontSize: "clamp(2rem, 4vw, 2.625rem)", lineHeight: 1.15 }}
          >
            New Arrivals
          </h2>
          <p className="font-sans text-brand-charcoal/60" style={{ fontSize: "15px" }}>
            Fresh from the looms — explore our latest collections.
          </p>
        </div>

        {/* Client: tabs + grid */}
        <NewArrivalsClient products={displayed} />

        {/* View all link */}
        <div className="mt-8 text-center">
          <Link
            href="/new-arrivals"
            className="font-sans font-semibold text-brand-rose border-b border-brand-rose hover:text-brand-mauve hover:border-brand-mauve transition-colors"
            style={{ fontSize: "14px" }}
          >
            View All New Arrivals →
          </Link>
        </div>

      </div>
    </section>
  )
}
