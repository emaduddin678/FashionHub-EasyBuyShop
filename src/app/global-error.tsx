"use client"

import "./globals.css"

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div
          className="min-h-screen font-sans flex flex-col items-center justify-center gap-5 py-24 px-6 text-center"
          style={{ background: "var(--color-brand-ivory)" }}
        >
          <p
            className="font-heading font-light text-brand-charcoal"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            FashionHub is temporarily unavailable
          </p>
          <p className="font-sans text-brand-charcoal/55 max-w-md" style={{ fontSize: "15px" }}>
            A critical error occurred. Our team has been notified — please try again in a moment.
          </p>
          <button
            onClick={() => unstable_retry()}
            className="font-sans font-semibold px-8 py-3 rounded-full text-brand-ivory transition-colors"
            style={{ background: "var(--color-brand-rose)" }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
