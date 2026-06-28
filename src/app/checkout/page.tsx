import type { Metadata } from "next"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { CheckoutPage } from "@/components/pages/CheckoutPage"

export const metadata: Metadata = {
  title: "Checkout — FashionHub",
  description: "Complete your purchase securely.",
}

export default function Page() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />
      <CheckoutPage />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
