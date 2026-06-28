import type { Metadata } from "next"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import AccountDashboardPage from "@/components/pages/AccountDashboardPage"

export const metadata: Metadata = {
  title: "My Account — FashionHub",
  description: "Manage your FashionHub account, orders, and preferences.",
}

export default function Page() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />
      <AccountDashboardPage />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
