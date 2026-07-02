import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      {/* Breadcrumb */}
      <div style={{ background: "var(--color-brand-beige)", borderBottom: "1px solid var(--color-border-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Skeleton className="h-3 w-64" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Gallery — 58% */}
          <div className="w-full lg:w-[58%] flex-shrink-0 space-y-4">
            <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "1 / 1" }} />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Info — 42% */}
          <div className="flex-1 w-full space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-32" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-3 w-16" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-14 rounded-lg" />
                ))}
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-full mt-4" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
