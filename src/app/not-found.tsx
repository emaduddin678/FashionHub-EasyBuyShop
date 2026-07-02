import Link from "next/link"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"

export const metadata = {
  title: "Page Not Found | FashionHub",
}

export default function NotFound() {
  return (
    <div
      className="min-h-screen font-sans flex flex-col"
      style={{ background: "var(--color-brand-ivory)" }}
    >
      <AnnouncementBar />
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24 px-6 text-center">
        <p
          className="font-heading font-light text-brand-charcoal"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          Page Not Found
        </p>
        <p className="font-sans text-brand-charcoal/55 max-w-md" style={{ fontSize: "15px" }}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="mt-2 font-sans font-semibold px-8 py-3 rounded-full text-brand-ivory transition-colors"
          style={{ background: "var(--color-brand-rose)" }}
        >
          Back to Shop
        </Link>
      </div>
      <Footer />
    </div>
  )
}
