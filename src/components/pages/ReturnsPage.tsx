"use client"

import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { MessageCircle, Package, RotateCcw, Check, X } from "lucide-react"

const steps = [
  {
    icon: MessageCircle,
    title: "Initiate",
    desc: "Call or WhatsApp us at +880 1712-345678 within 7 days of receiving your order. Share your Order ID and reason for return.",
  },
  {
    icon: Package,
    title: "Pack & Drop",
    desc: "Repack the item in its original packaging with all tags intact and in unused, unworn condition. Our courier will collect from your address.",
  },
  {
    icon: RotateCcw,
    title: "Refund",
    desc: "Once we receive and inspect the item, your refund is processed within 5–7 business days back to your original payment method.",
  },
]

export default function ReturnsPage() {
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
            Returns &amp; Exchanges
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Easy, free returns within 7 days. We handle everything.
          </p>
        </div>

        {/* How it works — 3 steps */}
        <div
          className="rounded-2xl p-7 mb-10"
          style={{ background: "var(--color-brand-beige)", border: "1.5px solid var(--color-border-light)" }}
        >
          <h2 className="font-heading text-xl mb-6" style={{ color: "var(--color-brand-charcoal)" }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full mb-4 shrink-0"
                  style={{ background: "var(--color-brand-rose)", color: "#fff" }}
                >
                  <Icon size={20} />
                </div>
                <div
                  className="text-xs font-bold mb-1 tracking-widest uppercase"
                  style={{ color: "var(--color-brand-rose)" }}
                >
                  Step {i + 1}
                </div>
                <p className="font-semibold text-sm mb-2" style={{ color: "var(--color-brand-charcoal)" }}>
                  {title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-brand-charcoal)", opacity: 0.65 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy details */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: "#fff", border: "1px solid var(--color-border)" }}
        >
          <h2 className="font-heading text-xl mb-5" style={{ color: "var(--color-brand-charcoal)" }}>
            Return conditions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}
              >
                Accepted ✓
              </p>
              <ul className="space-y-2.5">
                {[
                  "Returned within 7 days of delivery",
                  "Unworn and unused",
                  "Original tags still attached",
                  "Original packaging intact",
                  "Defective or damaged on arrival",
                  "Wrong item or size received",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.8 }}>
                    <Check size={15} className="shrink-0 mt-0.5" style={{ color: "#5a8a6a" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--color-brand-charcoal)", opacity: 0.5 }}
              >
                Not accepted ✕
              </p>
              <ul className="space-y-2.5">
                {[
                  "More than 7 days since delivery",
                  "Worn or washed items",
                  "Tags removed or packaging damaged",
                  "Sale or Final Sale items",
                  "Intimates and undergarments",
                  "Custom or personalised orders",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.8 }}>
                    <X size={15} className="shrink-0 mt-0.5" style={{ color: "var(--color-brand-rose)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Refund timeline */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: "#fff", border: "1px solid var(--color-border)" }}
        >
          <h2 className="font-heading text-xl mb-5" style={{ color: "var(--color-brand-charcoal)" }}>
            Refund timeline
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["Payment Method", "Refund To", "Timeframe"].map((h, i) => (
                    <th
                      key={h}
                      className="py-3 px-4 text-left text-xs font-semibold tracking-wide"
                      style={{
                        background: "var(--color-brand-rose)",
                        color: "#fff",
                        borderRadius: i === 0 ? "8px 0 0 8px" : i === 2 ? "0 8px 8px 0" : 0,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { method: "bKash",         to: "bKash wallet",    days: "3–5 business days" },
                  { method: "Nagad",         to: "Nagad wallet",    days: "3–5 business days" },
                  { method: "Visa / Mastercard", to: "Original card", days: "5–7 business days" },
                  { method: "Cash on Delivery", to: "bKash / Nagad", days: "3–5 business days" },
                ].map((row, i) => (
                  <tr
                    key={row.method}
                    style={{ background: i % 2 === 0 ? "#fff" : "var(--color-brand-beige)" }}
                  >
                    <td className="py-3 px-4 font-medium" style={{ color: "var(--color-brand-charcoal)" }}>{row.method}</td>
                    <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.7 }}>{row.to}</td>
                    <td className="py-3 px-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.7 }}>{row.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            className="text-xs mt-3 italic"
            style={{ color: "var(--color-brand-charcoal)", opacity: 0.45 }}
          >
            Refund processing begins after we receive and inspect your item (1 business day).
          </p>
        </div>

        {/* Contact block */}
        <div
          className="rounded-2xl p-7 text-center"
          style={{ background: "var(--color-brand-beige)", border: "1.5px solid var(--color-border-light)" }}
        >
          <h2
            className="font-heading mb-2"
            style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)", color: "var(--color-brand-charcoal)" }}
          >
            Ready to return?
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Reach out and we&apos;ll take care of everything for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/8801712345678?text=Hi, I would like to initiate a return"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: "var(--color-brand-rose)", color: "#fff" }}
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </a>
            <a
              href="mailto:hello@fashionhub.com.bd"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-70"
              style={{
                background: "transparent",
                color: "var(--color-brand-charcoal)",
                border: "1.5px solid var(--color-border)",
              }}
            >
              hello@fashionhub.com.bd
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
