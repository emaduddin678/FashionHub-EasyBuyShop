"use client"

import { useState } from "react"
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"
import { Truck, Zap, Clock } from "lucide-react"
import Link from "next/link"

const zones = [
  { zone: "Dhaka Metro",     timeframe: "Same Day",  cost: "৳60",  free: true  },
  { zone: "Dhaka District",  timeframe: "Next Day",  cost: "৳80",  free: false },
  { zone: "Major Cities",    timeframe: "2–3 Days",  cost: "৳100", free: false },
  { zone: "Rest of BD",      timeframe: "3–5 Days",  cost: "৳120", free: false },
]

const cutoffs = [
  { icon: Clock, label: "Same-day cut-off",  time: "11:00 AM (Dhaka Metro only)" },
  { icon: Truck, label: "Express cut-off",   time: "2:00 PM (Dhaka, Ctg, Sylhet)" },
  { icon: Zap,   label: "Standard dispatch", time: "Next business day morning" },
]

export default function DeliveryPage() {
  const [orderTotal, setOrderTotal] = useState("")

  const amount = parseFloat(orderTotal)
  const qualifies = !isNaN(amount) && amount >= 2000
  const remaining = Math.max(0, 2000 - amount)

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
            Delivery Information
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
            Fast, reliable delivery to all 64 districts of Bangladesh.
          </p>
        </div>

        {/* Free shipping banner */}
        <div
          className="rounded-xl px-6 py-4 mb-8 flex items-center gap-3"
          style={{
            background: "rgba(200,140,150,0.10)",
            border: "1.5px solid var(--color-brand-rose)",
          }}
        >
          <Truck size={20} style={{ color: "var(--color-brand-rose)", flexShrink: 0 }} />
          <p className="text-sm font-medium" style={{ color: "var(--color-brand-charcoal)" }}>
            <strong>Free standard delivery</strong> on all orders above{" "}
            <strong>৳2,000</strong> — anywhere in Bangladesh.
          </p>
        </div>

        {/* Delivery zones table */}
        <div
          className="rounded-xl overflow-hidden mb-8"
          style={{ border: "1px solid var(--color-border)", background: "#fff" }}
        >
          <div className="px-6 pt-5 pb-3">
            <h2 className="font-heading text-xl" style={{ color: "var(--color-brand-charcoal)" }}>
              Delivery zones
            </h2>
          </div>
          <div className="overflow-x-auto px-4 pb-5">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["Zone", "Timeframe", "Cost"].map((h, i) => (
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
                {zones.map((row, i) => (
                  <tr
                    key={row.zone}
                    style={{ background: i % 2 === 0 ? "#fff" : "var(--color-brand-beige)" }}
                  >
                    <td
                      className="py-3.5 px-4 font-medium"
                      style={{ color: "var(--color-brand-charcoal)" }}
                    >
                      {row.zone}
                    </td>
                    <td
                      className="py-3.5 px-4"
                      style={{ color: "var(--color-brand-charcoal)", opacity: 0.7 }}
                    >
                      {row.timeframe}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: row.free ? "var(--color-brand-rose)" : "var(--color-brand-charcoal)" }}
                      >
                        {row.cost}
                      </span>
                      {row.free && (
                        <span
                          className="ml-2 text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(200,140,150,0.15)", color: "var(--color-brand-rose)" }}
                        >
                          Dhaka only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs" style={{ color: "var(--color-brand-charcoal)", opacity: 0.45 }}>
              Remote areas and char islands may take 1–2 extra days. Timeframes are business days (Sun–Thu).
            </p>
          </div>
        </div>

        {/* Cut-off times */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
        >
          <h2 className="font-heading text-xl mb-5" style={{ color: "var(--color-brand-charcoal)" }}>
            Order cut-off times
          </h2>
          <div className="space-y-4">
            {cutoffs.map(({ icon: Icon, label, time }) => (
              <div key={label} className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-brand-rose)" }}
                >
                  <Icon size={16} color="#fff" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-brand-charcoal)" }}>{label}</p>
                  <p className="text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>{time}</p>
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-5 rounded-lg px-4 py-3 text-sm"
            style={{
              background: "rgba(200,140,150,0.10)",
              border: "1px solid var(--color-border)",
              color: "var(--color-brand-charcoal)",
              opacity: 0.85,
            }}
          >
            Working days are <strong>Sunday–Thursday</strong>. Friday and Saturday are non-working days. Orders placed on weekends
            are dispatched on Sunday morning.
          </div>
        </div>

        {/* Partner couriers */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: "#fff", border: "1px solid var(--color-border)" }}
        >
          <h2 className="font-heading text-xl mb-2" style={{ color: "var(--color-brand-charcoal)" }}>
            Our courier partners
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--color-brand-charcoal)", opacity: 0.55 }}>
            We work with Bangladesh&apos;s most trusted courier services for reliable nationwide delivery.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {["Pathao Courier", "Steadfast", "RedX"].map((name) => (
              <div
                key={name}
                className="rounded-xl p-4 text-center"
                style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ background: "var(--color-brand-rose)" }}
                >
                  <Truck size={18} color="#fff" />
                </div>
                <p className="text-xs font-medium" style={{ color: "var(--color-brand-charcoal)" }}>{name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Free delivery calculator */}
        <div
          className="rounded-xl p-6 mb-10"
          style={{ background: "#fff", border: "1px solid var(--color-border)" }}
        >
          <h2 className="font-heading text-xl mb-2" style={{ color: "var(--color-brand-charcoal)" }}>
            Check your delivery cost
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-brand-charcoal)", opacity: 0.55 }}>
            Enter your estimated order total to see if you qualify for free delivery.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: "var(--color-brand-charcoal)" }}>৳</span>
            <input
              type="number"
              value={orderTotal}
              onChange={(e) => setOrderTotal(e.target.value)}
              placeholder="e.g. 1500"
              className="rounded-lg px-4 py-2.5 text-sm w-44 focus:outline-none transition-colors"
              style={{
                border: "1.5px solid var(--color-border)",
                color: "var(--color-brand-charcoal)",
                background: "var(--color-brand-beige)",
              }}
            />
          </div>
          {orderTotal && !isNaN(amount) && (
            <div className="mt-4">
              {qualifies ? (
                <p className="text-sm font-semibold" style={{ color: "#5a8a6a" }}>
                  You qualify for FREE standard delivery!
                </p>
              ) : (
                <p className="text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.7 }}>
                  Add <strong style={{ color: "var(--color-brand-rose)" }}>৳{remaining.toFixed(0)}</strong> more for free delivery.
                  Standard delivery: <strong>৳120</strong>.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Important notes */}
        <div
          className="rounded-xl p-6"
          style={{ background: "var(--color-brand-beige)", border: "1.5px solid var(--color-border-light)" }}
        >
          <h2 className="font-heading text-xl mb-4" style={{ color: "var(--color-brand-charcoal)" }}>
            Important delivery notes
          </h2>
          <ul className="space-y-3">
            {[
              "Our delivery agent will call you 30–60 minutes before arrival.",
              "Please ensure someone is available at the delivery address.",
              "For COD orders, please have the exact amount ready.",
              "We allow up to 3 delivery attempts. After that, the order is returned to us.",
              "Delivery times exclude public holidays, national strikes (hartals), and extreme weather events.",
            ].map((note) => (
              <li key={note} className="flex items-start gap-3 text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>
                <span
                  className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                  style={{ background: "var(--color-brand-rose)" }}
                />
                {note}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="inline-block text-center px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: "var(--color-brand-rose)", color: "#fff" }}
            >
              Shop Now →
            </Link>
            <Link
              href="/track"
              className="inline-block text-center px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-70"
              style={{
                background: "transparent",
                color: "var(--color-brand-charcoal)",
                border: "1.5px solid var(--color-border)",
              }}
            >
              Track My Order →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
