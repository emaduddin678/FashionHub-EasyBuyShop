"use client"

import { useState } from "react"
import Link from "next/link"

// ── Link columns ──────────────────────────────────────────────────────────────

const SHOP_LINKS = [
  { label: "New Arrivals",  href: "/new-arrivals" },
  { label: "Best Sellers",  href: "/best-sellers" },
  { label: "Kurtas",        href: "/category/kurta" },
  { label: "Lawn Suits",    href: "/category/lawn-suit" },
  { label: "Sarees",        href: "/category/saree" },
  { label: "Dresses",       href: "/category/dress" },
  { label: "Accessories",   href: "/category/accessory" },
  { label: "Eid Special",   href: "/eid-special" },
  { label: "Lookbook",      href: "/lookbook" },
  { label: "Brands",        href: "/brands" },
]

const SERVICE_LINKS = [
  { label: "My Account",          href: "/account" },
  { label: "Track My Order",      href: "/track" },
  { label: "FAQs",                href: "/faq" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "Delivery Information", href: "/delivery" },
  { label: "Size Guide",          href: "/size-guide" },
  { label: "Payment Methods",     href: "/payment" },
  { label: "Contact Us",          href: "/contact" },
]

const COMPANY_LINKS = [
  { label: "About FashionHub", href: "/about" },
  { label: "Blog",             href: "/blog" },
  { label: "Careers",          href: "/careers" },
  { label: "Affiliates",       href: "/affiliates" },
  { label: "Press",            href: "/press" },
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function FooterLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {links.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="font-sans text-brand-ivory/60 hover:text-brand-ivory hover:underline underline-offset-2 decoration-brand-rose transition-colors"
            style={{ fontSize: "14px" }}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4
      className="font-sans font-semibold uppercase tracking-widest text-brand-ivory/40 mb-5"
      style={{ fontSize: "11px" }}
    >
      {children}
    </h4>
  )
}

// ── Social icons ──────────────────────────────────────────────────────────────

const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    svg: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    svg: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "#",
    svg: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    svg: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
]

const PAYMENT_BADGES = ["bKash", "Nagad", "Visa", "Mastercard"]

// ── Main component ────────────────────────────────────────────────────────────

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    console.log("[FashionHub] Newsletter signup:", email)
    setSubscribed(true)
    setEmail("")
  }

  return (
    <footer style={{ background: "var(--color-brand-charcoal)" }}>

      {/* ── Newsletter strip ── */}
      <div className="w-full bg-brand-rose py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <p
            className="font-heading font-light text-brand-ivory text-center md:text-left md:flex-1 leading-snug"
            style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)" }}
          >
            Be the first to know about new arrivals and exclusive offers.
          </p>

          {subscribed ? (
            <p className="font-sans font-semibold text-brand-ivory" style={{ fontSize: "14px" }}>
              ✓ You&apos;re subscribed — check your inbox!
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full md:w-auto"
              style={{ maxWidth: "420px" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-5 py-3 rounded-l-full font-sans text-brand-charcoal placeholder:text-brand-charcoal/40 outline-none"
                style={{ fontSize: "14px", background: "var(--color-brand-beige)" }}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-r-full font-sans font-semibold text-brand-ivory whitespace-nowrap transition-colors hover:bg-brand-charcoal/80"
                style={{ fontSize: "14px", background: "var(--color-brand-charcoal)" }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="inline-block">
              <span
                className="font-heading text-brand-ivory"
                style={{ fontSize: "28px", lineHeight: 1 }}
              >
                Fashion<span className="text-brand-rose">Hub</span>
              </span>
            </Link>
            <p className="font-sans text-brand-ivory/60 leading-relaxed" style={{ fontSize: "13px" }}>
              A fashion collective for the modern South Asian woman — curated with love from Dhaka.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-brand-ivory/50 hover:text-brand-rose transition-colors"
                  style={{ background: "rgba(253,250,246,0.07)" }}
                >
                  {svg}
                </a>
              ))}
            </div>

            {/* Payment trust badges */}
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="font-sans font-semibold text-brand-ivory/50 rounded px-2.5 py-1"
                  style={{ fontSize: "11px", background: "rgba(253,250,246,0.07)" }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Column 2 — Shop */}
          <div>
            <FooterHeading>Shop</FooterHeading>
            <FooterLinks links={SHOP_LINKS} />
          </div>

          {/* Column 3 — Customer Service */}
          <div>
            <FooterHeading>Customer Service</FooterHeading>
            <FooterLinks links={SERVICE_LINKS} />
          </div>

          {/* Column 4 — Company */}
          <div>
            <FooterHeading>Company</FooterHeading>
            <FooterLinks links={COMPANY_LINKS} />
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="w-full"
        style={{ borderTop: "1px solid rgba(253,250,246,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-sans text-brand-ivory/50" style={{ fontSize: "12px" }}>
            © 2025 FashionHub. All rights reserved.
          </p>
          <p className="font-sans text-brand-ivory/50" style={{ fontSize: "12px" }}>
            Made with ♥ in Dhaka, Bangladesh
          </p>
        </div>
      </div>

    </footer>
  )
}
