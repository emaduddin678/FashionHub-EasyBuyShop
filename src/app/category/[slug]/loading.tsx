import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { Skeleton, ProductGridSkeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      {/* Category banner */}
      <div
        className="w-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, var(--color-brand-beige) 0%, var(--color-brand-ivory) 100%)",
          height: "clamp(160px, 20vw, 220px)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ background: "var(--color-brand-beige)", borderBottom: "1px solid var(--color-border-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 items-start">
          <aside className="hidden lg:block w-[260px] flex-shrink-0 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-9 w-36 rounded-full" />
            </div>
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
