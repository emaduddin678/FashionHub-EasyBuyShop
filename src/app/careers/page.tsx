import { Header } from "@/components/storefront/Header"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"

export const metadata = {
  title: "Careers — FashionHub",
  description: "Join the FashionHub team",
}

export default function Page() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />
      <main className="max-w-[1440px] mx-auto px-16 py-20 text-center">
        <h1 className="text-[42px] font-extrabold text-brand-charcoal mb-4">Careers</h1>
        <p className="text-lg text-gray-500">This page is coming soon. Design is on the way!</p>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
