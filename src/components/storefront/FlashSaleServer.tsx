import { FlashSale } from "./FlashSale"
import { fetchFlashSaleProducts, normalizeProduct } from "@/lib/api/products"
import { getOnSale } from "@/lib/data/products"

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function FlashSaleSkeleton() {
  return (
    <section className="bg-[#0d1733] py-[72px]">
      <div className="max-w-[1440px] mx-auto px-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="h-10 w-52 bg-white/10 rounded animate-pulse mb-3" />
            <div className="h-4 w-60 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 w-24 bg-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-[22px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-[14px] overflow-hidden">
              <div className="h-60 bg-white/10 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                <div className="h-5 w-36 bg-white/10 rounded animate-pulse" />
                <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
                <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Server data-fetcher that renders the client FlashSale component ───────────

export async function FlashSaleServer() {
  let products = getOnSale()

  try {
    const apiProducts = await fetchFlashSaleProducts(4)
    if (apiProducts.length > 0) {
      products = apiProducts.map((p, i) => normalizeProduct(p, i))
    }
  } catch {
    // silently fall back to mock data when backend is unavailable
  }

  return <FlashSale products={products} />
}
