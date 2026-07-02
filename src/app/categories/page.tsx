import Link from "next/link"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { CATEGORIES } from "@/lib/data/products"

export const metadata = {
  title: "Shop by Category — FashionHub",
  description: "Browse kurtas, lawn suits, sarees, dresses, pants, and accessories at FashionHub",
}

export default function Page() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      <div className="bg-brand-charcoal py-14 text-center">
        <h1 className="text-3xl font-bold text-white">Shop by Category</h1>
        <p className="text-white/70 text-sm mt-2">
          Kurtas, lawn suits, sarees, dresses, pants &amp; accessories — all in one place
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-brand-charcoal transition-all duration-200"
            >
              <img
                src={`https://placehold.co/600x400/F5EFE6/2D2D2D?text=${encodeURIComponent(category.label)}`}
                alt={category.label}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6 text-center">
                <h3 className="font-bold text-xl text-brand-charcoal">{category.label}</h3>
                <p className="text-xs text-brand-rose mt-2">{category.productCount} styles available</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
