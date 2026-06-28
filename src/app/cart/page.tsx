import type { Metadata } from "next"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { CartPage } from "@/components/pages/CartPage"

export const metadata: Metadata = {
  title: "Your Bag | FashionHub",
  description: "Review your bag and proceed to checkout.",
}

export default function Page() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />
      <CartPage />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
