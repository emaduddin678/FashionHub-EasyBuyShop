import type { Metadata } from "next"
import { Suspense } from "react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import OrderTrackingPage from "@/components/pages/OrderTrackingPage"

export const metadata: Metadata = {
  title: "Track Your Order — FashionHub",
  description: "Real-time delivery updates for your FashionHub order.",
}

export default function Page() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />
      <Suspense fallback={
        <div className="py-32 text-center font-sans" style={{ color: "var(--color-brand-charcoal)", opacity: 0.4, fontSize: "14px" }}>
          Loading…
        </div>
      }>
        <OrderTrackingPage />
      </Suspense>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
