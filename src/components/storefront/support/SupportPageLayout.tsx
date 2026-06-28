import Link from "next/link"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { SupportSidebar } from "@/components/storefront/support/SupportSidebar"
import { ChevronRight, Home } from "lucide-react"

interface SupportPageLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function SupportPageLayout({ title, description, children }: SupportPageLayoutProps) {
  return (
    <div className="min-h-screen font-sans bg-[#f4f5f9]">
      <AnnouncementBar />
      <Header />

      {/* Hero band */}
      <div className="bg-[#1A2B5E] py-10 text-center">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-1.5 text-white/60 text-xs mb-4">
          <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
            <Home size={12} />
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-white/60">Support</span>
          <ChevronRight size={12} />
          <span className="text-white">{title}</span>
        </nav>

        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-white/70 text-sm mt-2">{description}</p>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <SupportSidebar />
          </div>
          <div className="col-span-3">
            {children}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
