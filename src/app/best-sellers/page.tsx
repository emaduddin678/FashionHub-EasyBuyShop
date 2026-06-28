import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { ProductCard } from "@/components/storefront/ProductCard"
import { getBestSellers } from "@/lib/data/products"

export const metadata = {
  title: "Best Sellers — FashionHub",
  description: "Our most-loved kurtas, lawn suits, sarees, dresses, pants, and accessories at FashionHub",
}

export default function Page() {
  const products = getBestSellers()

  return (
    <div className="min-h-screen font-sans bg-[#f4f5f9]">
      <AnnouncementBar />
      <Header />

      <div className="bg-brand-charcoal py-14 text-center">
        <h1 className="text-3xl font-bold text-white">Best Sellers</h1>
        <p className="text-white/70 text-sm mt-2">
          Our most-loved styles, picked by FashionHub shoppers
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
