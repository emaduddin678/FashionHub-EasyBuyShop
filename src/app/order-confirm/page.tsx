import type { Metadata } from "next"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import OrderConfirmPage from "@/components/pages/OrderConfirmPage"

export const metadata: Metadata = {
  title: "Order Confirmed — FashionHub",
  description: "Your order has been placed successfully.",
}

export default function Page() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />
      <OrderConfirmPage />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
