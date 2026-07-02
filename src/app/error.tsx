"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

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
          Something Went Wrong
        </p>
        <p className="font-sans text-brand-charcoal/55 max-w-md" style={{ fontSize: "15px" }}>
          We hit an unexpected error loading this page. Please try again, or head back to the
          homepage.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => unstable_retry()}
            className="font-sans font-semibold px-8 py-3 rounded-full text-brand-ivory transition-colors"
            style={{ background: "var(--color-brand-rose)" }}
          >
            Try Again
          </button>
          <Link
            href="/"
            className="font-sans font-semibold px-8 py-3 rounded-full text-brand-charcoal transition-colors"
            style={{ border: "1px solid var(--color-border)" }}
          >
            Back to Shop
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
