"use client"

import { useState } from "react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { ChevronDown, ChevronUp, Search, MessageCircle, Mail, Phone } from "lucide-react"
import Link from "next/link"

const faqGroups = [
  {
    id: "orders-payments",
    title: "Orders & Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept bKash, Nagad, Visa, Mastercard, and Cash on Delivery (COD). All digital payments are secured with 256-bit SSL encryption. COD carries a small ৳20 handling fee.",
      },
      {
        q: "How do I track my order?",
        a: "Visit our Order Tracking page at /track and enter your Order ID or registered phone number. You'll get real-time updates on your delivery status.",
      },
      {
        q: "Can I cancel or change my order?",
        a: "Orders can be cancelled within 1 hour of placement. After that, contact us immediately on WhatsApp at +880 1712-345678 with your Order ID. Changes to the delivery address may also be accommodated if the order hasn't been dispatched yet.",
      },
      {
        q: "My payment failed but money was deducted — what do I do?",
        a: "Failed payment deductions are automatically reversed within 3–5 business days by your bank or mobile financial service. If it isn't resolved by then, contact us on WhatsApp with your transaction reference and we'll assist you.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: [
      {
        q: "How long does standard delivery take?",
        a: "Standard delivery takes 3–5 business days across Bangladesh. Same-day delivery is available in Dhaka Metro for ৳60. Express delivery (next business day) costs ৳150.",
      },
      {
        q: "Do you deliver outside Dhaka?",
        a: "Yes! We deliver to all 64 districts of Bangladesh. Delivery fees vary by zone — see our Delivery Information page for the full breakdown.",
      },
      {
        q: "Is there free delivery?",
        a: "Yes — orders above ৳2,000 qualify for free standard delivery. Same-day and express options are always charged separately.",
      },
      {
        q: "What if I'm not home during delivery?",
        a: "Our delivery agent will call you 30–60 minutes before arriving. If you're unavailable, they'll attempt delivery again the next business day. After 3 failed attempts, the order returns to us.",
      },
    ],
  },
  {
    id: "returns-exchanges",
    title: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer returns within 7 days of delivery. Items must be unworn, unused, and in original condition with all tags intact. Sale items and intimates are non-returnable.",
      },
      {
        q: "How do I initiate a return?",
        a: "Call or WhatsApp us at +880 1712-345678 within 7 days of delivery with your Order ID and reason. We'll arrange free pickup from your address within 1–2 business days.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. The refund goes to your original payment method.",
      },
      {
        q: "Can I exchange for a different size?",
        a: "Yes! Size exchanges are free within 7 days. Contact us on WhatsApp and we'll arrange simultaneous pickup of the old size and delivery of the new one.",
      },
    ],
  },
  {
    id: "sizing",
    title: "Sizing",
    items: [
      {
        q: "How do I find my size?",
        a: "Use our Size Guide at /size-guide. We recommend taking your bust, waist, and hip measurements with a soft tape measure and comparing against our size chart.",
      },
      {
        q: "Do Pakistani brands run differently to Bangladeshi brands?",
        a: "Yes — Pakistani brands like Sapphire and Sana Safinaz often run slightly larger than equivalent Bangladeshi sizes. Our Size Guide includes brand-specific sizing notes to help you choose.",
      },
      {
        q: "What if I'm between sizes?",
        a: "We recommend going up one size for a comfortable fit. If you're unsure, message us on WhatsApp with your measurements and the product you're interested in — our team will advise.",
      },
      {
        q: "Are your measurements in inches or centimetres?",
        a: "Our Tops & Kurtas and Dresses & Suits tables are in centimetres (cm). Some legacy brand charts include inches. All measurements are clearly labelled within the Size Guide.",
      },
    ],
  },
  {
    id: "products-brands",
    title: "Products & Brands",
    items: [
      {
        q: "Are all products authentic?",
        a: "100% yes. FashionHub is an authorised retailer for every brand we carry, including Aarong, Yellow, Khas, Sapphire, Sana Safinaz, and Gul Ahmed. Every item carries the brand's official quality guarantee.",
      },
      {
        q: "Do you carry authentic Pakistani lawn?",
        a: "Yes — we stock authentic collections from Sapphire, Sana Safinaz, and Gul Ahmed. All pieces are sourced directly from authorised distributors.",
      },
      {
        q: "What if I receive a wrong or damaged product?",
        a: "Contact us immediately on WhatsApp with photos of the product and your Order ID. We'll send a replacement within 2–3 business days at no extra charge.",
      },
      {
        q: "Will you be restocking sold-out items?",
        a: "Restock depends on the brand and season. You can add sold-out items to your Wishlist — we'll notify you if they come back in stock.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filtered = faqGroups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) =>
          !searchQuery ||
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0)

  const total = filtered.reduce((s, g) => s + g.items.length, 0)

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-brand-ivory)" }}>
      <AnnouncementBar />
      <Header />

      <main className="max-w-3xl mx-auto px-5 py-16">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1
            className="font-heading mb-3"
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              color: "var(--color-brand-charcoal)",
              letterSpacing: "-0.01em",
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Quick answers to the most common questions about shopping at FashionHub.
          </p>
        </div>

        {/* Search */}
        <div
          className="relative mb-10 rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--color-border)", background: "#fff" }}
        >
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-brand-charcoal)", opacity: 0.4 }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-11 pr-4 py-3.5 text-sm bg-transparent focus:outline-none"
            style={{ color: "var(--color-brand-charcoal)" }}
          />
          {searchQuery && (
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "var(--color-brand-charcoal)", opacity: 0.4 }}
            >
              {total} result{total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Accordion groups */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={36} style={{ color: "var(--color-brand-rose)", opacity: 0.3, margin: "0 auto 12px" }} />
            <p className="font-heading text-xl mb-1" style={{ color: "var(--color-brand-charcoal)" }}>
              No results found
            </p>
            <p className="text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
              Try different keywords or browse all categories above.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((group) => (
              <section key={group.id}>
                <h2
                  className="font-heading mb-4"
                  style={{
                    fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                    color: "var(--color-brand-charcoal)",
                    borderBottom: "1.5px solid var(--color-border-light)",
                    paddingBottom: 10,
                  }}
                >
                  {group.title}
                </h2>

                <div className="space-y-2">
                  {group.items.map((item, idx) => {
                    const key = `${group.id}-${idx}`
                    const open = openItems[key]
                    return (
                      <div
                        key={key}
                        className="rounded-xl overflow-hidden transition-all"
                        style={{
                          border: open
                            ? "1.5px solid var(--color-brand-rose)"
                            : "1.5px solid var(--color-border)",
                          background: open ? "var(--color-brand-beige)" : "#fff",
                        }}
                      >
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left"
                        >
                          <span
                            className="font-medium text-sm pr-4 leading-snug"
                            style={{ color: "var(--color-brand-charcoal)" }}
                          >
                            {item.q}
                          </span>
                          {open ? (
                            <ChevronUp size={16} style={{ color: "var(--color-brand-rose)", flexShrink: 0 }} />
                          ) : (
                            <ChevronDown size={16} style={{ color: "var(--color-brand-charcoal)", opacity: 0.4, flexShrink: 0 }} />
                          )}
                        </button>
                        {open && (
                          <div
                            className="px-5 pb-5 text-sm leading-relaxed"
                            style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}
                          >
                            {item.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Still have questions */}
        <div
          className="mt-14 rounded-2xl p-8 text-center"
          style={{ background: "var(--color-brand-beige)", border: "1.5px solid var(--color-border-light)" }}
        >
          <h2
            className="font-heading mb-2"
            style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)", color: "var(--color-brand-charcoal)" }}
          >
            Still have a question?
          </h2>
          <p className="text-sm mb-7" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Our team is available 7 days a week to help.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: MessageCircle,
                label: "WhatsApp",
                sub: "+880 1712-345678",
                href: "https://wa.me/8801712345678",
                cta: "Chat Now",
              },
              {
                icon: Mail,
                label: "Email",
                sub: "hello@fashionhub.com.bd",
                href: "mailto:hello@fashionhub.com.bd",
                cta: "Send Email",
              },
              {
                icon: Phone,
                label: "Call",
                sub: "+880 1712-345678",
                href: "tel:+8801712345678",
                cta: "Call Now",
              },
            ].map(({ icon: Icon, label, sub, href, cta }) => (
              <div
                key={label}
                className="rounded-xl p-5 text-center"
                style={{ background: "#fff", border: "1px solid var(--color-border)" }}
              >
                <Icon size={22} style={{ color: "var(--color-brand-rose)", margin: "0 auto 8px" }} />
                <p
                  className="font-medium text-sm mb-0.5"
                  style={{ color: "var(--color-brand-charcoal)" }}
                >
                  {label}
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
                  {sub}
                </p>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-block text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                  style={{ background: "var(--color-brand-rose)", color: "#fff" }}
                >
                  {cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
