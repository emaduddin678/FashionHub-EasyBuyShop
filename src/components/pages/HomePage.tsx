import { Suspense } from "react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { HeroBanner } from "@/components/storefront/HeroBanner"
import { CategorySection } from "@/components/storefront/CategorySection"
import { TrustBar } from "@/components/storefront/TrustBar"
import { BestSellers, BestSellersSkeleton } from "@/components/storefront/BestSellers"
import { PromoBanner } from "@/components/storefront/PromoBanner"
import { NewArrivals, NewArrivalsSkeleton } from "@/components/storefront/NewArrivals"
import { FlashSaleServer, FlashSaleSkeleton } from "@/components/storefront/FlashSaleServer"
import { BrandStrip } from "@/components/storefront/BrandStrip"
import { RecentlyViewed } from "@/components/storefront/RecentlyViewed"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"

const HomePage = () => {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <HeroBanner />
        <CategorySection />
        <TrustBar />
        <Suspense fallback={<BestSellersSkeleton />}>
          <BestSellers />
        </Suspense>
        <PromoBanner />
        <Suspense fallback={<NewArrivalsSkeleton />}>
          <NewArrivals />
        </Suspense>
        <Suspense fallback={<FlashSaleSkeleton />}>
          <FlashSaleServer />
        </Suspense>
        <BrandStrip />
        <RecentlyViewed />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

export default HomePage
