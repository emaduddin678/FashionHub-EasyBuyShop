import type { Metadata } from "next"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { WishlistPage } from "@/components/pages/WishlistPage"

export const metadata: Metadata = {
  title: "My Wishlist — FashionHub",
  description: "Your saved pieces, all in one place.",
}

export default function Page() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />
      <WishlistPage />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
