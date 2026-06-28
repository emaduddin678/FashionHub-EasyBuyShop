"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Truck, MapPin } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

interface StoredOrder {
  orderId: string
  customer: { fullName?: string; firstName?: string; lastName?: string; email?: string; phone?: string }
  delivery: {
    address?: string; upazila?: string; district?: string; division?: string; postalCode?: string
    speed?: string; charge?: number
  }
  payment: { method?: string }
  pricing: { subtotal?: number; discount?: number; deliveryCharge?: number; codFee?: number; total?: number }
  placedAt?: string
  items: {
    id: number; name: string; price: string; size: string; quantity: number
    imgBg?: string; imgFg?: string; imgText?: string
    selectedColor?: { name: string; hex: string } | null
  }[]
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function taka(n: number) { return `৳${n.toLocaleString()}` }

function parsePrice(p: string) { return parseInt(p.replace(/[৳,\s]/g, ""), 10) || 0 }

function addBusinessDays(date: Date, days: number): Date {
  const d = new Date(date)
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    const dow = d.getDay()
    if (dow !== 5 && dow !== 6) added++ // skip Fri=5 Sat=6
  }
  return d
}

function getDeliveryEstimate(speed: string | undefined): string {
  const now = new Date()
  if (speed === "same-day") return "Today"
  if (speed === "express") {
    const d = addBusinessDays(now, 1)
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long" })
  }
  const s = addBusinessDays(now, 2)
  const e = addBusinessDays(now, 3)
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" }
  const eOpts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
  if (s.getMonth() === e.getMonth()) return `${s.getDate()} – ${e.toLocaleDateString("en-GB", eOpts)}`
  return `${s.toLocaleDateString("en-GB", opts)} – ${e.toLocaleDateString("en-GB", eOpts)}`
}

function getSpeedLabel(speed: string | undefined): string {
  if (speed === "same-day") return "Dhaka Metro Same-Day"
  if (speed === "express") return "Express Next-Day"
  return "Standard 2–3 Days"
}

function getCustomerName(order: StoredOrder): string {
  if (order.customer.fullName) return order.customer.fullName
  const parts = [order.customer.firstName, order.customer.lastName].filter(Boolean)
  return parts.join(" ") || "Customer"
}

// ── Animated Checkmark ─────────────────────────────────────────────────────────

function AnimatedCheckmark() {
  return (
    <>
      <style>{`
        @keyframes fh-circle-draw {
          from { stroke-dashoffset: 166; }
          to   { stroke-dashoffset: 0;   }
        }
        @keyframes fh-check-draw {
          from { stroke-dashoffset: 48; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes fh-fade-in {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1);    }
        }
        .fh-confirm-wrap {
          animation: fh-fade-in 0.4s ease both;
        }
        .fh-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: fh-circle-draw 0.8s cubic-bezier(0.65,0,0.45,1) 0.15s forwards;
        }
        .fh-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: fh-check-draw 0.4s cubic-bezier(0.65,0,0.45,1) 0.85s forwards;
        }
      `}</style>
      <div className="fh-confirm-wrap flex items-center justify-center mb-6">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          {/* Background disc */}
          <circle cx="40" cy="40" r="40" fill="rgba(198,147,132,0.12)" />
          {/* Animated ring */}
          <circle
            className="fh-circle"
            cx="40" cy="40" r="26.4"
            stroke="var(--color-brand-rose)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            transform="rotate(-90 40 40)"
          />
          {/* Animated check */}
          <path
            className="fh-check"
            d="M26 40 L36 50 L54 30"
            stroke="var(--color-brand-rose)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </>
  )
}

// ── No order found ─────────────────────────────────────────────────────────────

function NoOrderFound() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center px-4"
      style={{ background: "var(--color-brand-beige)" }}
    >
      <div className="max-w-sm w-full text-center" style={{ padding: "3rem 2rem" }}>
        <p
          className="font-heading font-light mb-3"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.2 }}
        >
          No order found
        </p>
        <p className="font-sans mb-8" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
          We couldn&apos;t find order details. You may have already navigated away.
        </p>
        <Link
          href="/"
          className="inline-block font-sans font-semibold text-sm rounded-full px-8 py-3"
          style={{ background: "var(--color-brand-rose)", color: "var(--color-brand-ivory)" }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function OrderConfirmPage() {
  const [order, setOrder] = useState<StoredOrder | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastOrder")
      if (raw) setOrder(JSON.parse(raw))
    } catch { /* ignore */ }
    setLoaded(true)
  }, [])

  if (!loaded) return null
  if (!order) return <NoOrderFound />

  const customerName = getCustomerName(order)
  const estimate = getDeliveryEstimate(order.delivery.speed)
  const speedLabel = getSpeedLabel(order.delivery.speed)
  const total = order.pricing.total ?? 0
  const discount = order.pricing.discount ?? 0
  const shipping = order.pricing.deliveryCharge ?? 0
  const codFee = order.pricing.codFee ?? 0

  return (
    <div
      className="w-full min-h-[80vh]"
      style={{ background: "var(--color-brand-beige)", paddingTop: "clamp(40px, 6vw, 72px)", paddingBottom: "clamp(60px, 8vw, 96px)" }}
    >
      <div className="max-w-lg mx-auto px-4">

        {/* ── Main confirmation card ── */}
        <div
          style={{
            background: "var(--color-brand-ivory)",
            border: "1px solid var(--color-border-light)",
            borderRadius: "var(--radius-card, 16px)",
            padding: "clamp(1.75rem, 5vw, 3rem)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Animated checkmark */}
          <AnimatedCheckmark />

          {/* Title */}
          <h1
            className="font-heading font-light text-center"
            style={{ fontSize: "clamp(2rem, 5vw, 2.375rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.15, marginBottom: "8px" }}
          >
            Order Placed!
          </h1>

          {/* Sub */}
          <p
            className="font-sans text-center mb-5"
            style={{ fontSize: "15px", color: "var(--color-brand-charcoal)", opacity: 0.7 }}
          >
            Thank you for shopping with FashionHub, {customerName.split(" ")[0]}.
          </p>

          {/* Order ID pill */}
          <div
            className="flex items-center justify-center mb-6"
          >
            <span
              className="font-sans text-center"
              style={{
                fontSize: "13px",
                color: "var(--color-brand-charcoal)",
                opacity: 0.5,
                background: "var(--color-brand-beige)",
                border: "1px solid var(--color-border-light)",
                borderRadius: "999px",
                padding: "4px 16px",
                letterSpacing: "0.03em",
              }}
            >
              Order {order.orderId}
            </span>
          </div>

          {/* Delivery estimate block */}
          <div
            className="flex items-start gap-3 mb-7 rounded-xl p-4"
            style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
          >
            <Truck size={18} strokeWidth={1.75} style={{ color: "var(--color-brand-rose)", flexShrink: 0, marginTop: "1px" }} />
            <div>
              <p className="font-sans font-semibold" style={{ fontSize: "14px", color: "var(--color-brand-charcoal)" }}>
                Estimated Delivery: <span style={{ color: "var(--color-brand-rose)" }}>{estimate}</span>
              </p>
              <p className="font-sans mt-0.5" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.55 }}>
                {speedLabel}
                {order.delivery.upazila && order.delivery.district ? ` · ${order.delivery.upazila}, ${order.delivery.district}` : ""}
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-7">
            <Link
              href="/track"
              className="flex-1 font-sans font-semibold text-sm text-center rounded-full py-3 transition-colors"
              style={{ background: "var(--color-brand-rose)", color: "var(--color-brand-ivory)" }}
            >
              Track My Order →
            </Link>
            <Link
              href="/"
              className="flex-1 font-sans font-semibold text-sm text-center rounded-full py-3 transition-colors"
              style={{
                background: "transparent",
                color: "var(--color-brand-charcoal)",
                border: "1.5px solid var(--color-border)",
              }}
            >
              Continue Shopping
            </Link>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--color-border-light)", marginBottom: "20px" }} />

          {/* Items summary */}
          <p
            className="font-sans font-semibold mb-3"
            style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}
          >
            Order Summary
          </p>

          <div className="space-y-4 mb-5">
            {order.items.map((item, idx) => {
              const unit = parsePrice(item.price)
              return (
                <div key={`${item.id}-${item.size}-${idx}`} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://placehold.co/56x72/${item.imgBg || "F5EFE6"}/${item.imgFg || "2D2D2D"}?text=${encodeURIComponent(item.imgText || "")}`}
                    alt={item.name}
                    style={{ width: "56px", height: "72px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-sans font-medium truncate"
                      style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}
                    >
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span
                        className="font-sans text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--color-brand-beige)", color: "var(--color-brand-charcoal)", border: "1px solid var(--color-border-light)" }}
                      >
                        {item.size}
                      </span>
                      {item.selectedColor && (
                        <span className="flex items-center gap-1">
                          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: item.selectedColor.hex }} />
                          <span className="font-sans text-xs" style={{ color: "var(--color-brand-charcoal)", opacity: 0.55 }}>{item.selectedColor.name}</span>
                        </span>
                      )}
                      <span className="font-sans text-xs" style={{ color: "var(--color-brand-charcoal)", opacity: 0.45 }}>× {item.quantity}</span>
                    </div>
                  </div>
                  <p className="font-sans font-semibold flex-shrink-0" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>
                    {taka(unit * item.quantity)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 pt-4" style={{ borderTop: "1px solid var(--color-border-light)" }}>
            <div className="flex justify-between font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
              <span>Subtotal</span><span>{taka(order.pricing.subtotal ?? 0)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between font-sans text-sm font-semibold" style={{ color: "#5a8a6a" }}>
                <span>Discount</span><span>−{taka(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: "#5a8a6a", fontWeight: 600 }}>FREE</span> : taka(shipping)}</span>
            </div>
            {codFee > 0 && (
              <div className="flex justify-between font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
                <span>COD Handling</span><span>{taka(codFee)}</span>
              </div>
            )}
            <div
              className="flex justify-between font-sans font-bold pt-2"
              style={{ borderTop: "1px solid var(--color-border-light)", marginTop: "8px", paddingTop: "12px" }}
            >
              <span style={{ fontSize: "15px", color: "var(--color-brand-charcoal)" }}>Total Paid</span>
              <span style={{ fontSize: "17px", color: "var(--color-brand-charcoal)" }}>{taka(total)}</span>
            </div>
          </div>
        </div>

        {/* ── Delivery address card ── */}
        {(order.delivery.address || order.delivery.district) && (
          <div
            className="mt-4 flex items-start gap-3 p-4 rounded-xl"
            style={{
              background: "var(--color-brand-ivory)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <MapPin size={16} strokeWidth={1.75} style={{ color: "var(--color-brand-rose)", flexShrink: 0, marginTop: "2px" }} />
            <div className="font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.75 }}>
              <p className="font-semibold" style={{ opacity: 1, color: "var(--color-brand-charcoal)" }}>{customerName}</p>
              {order.delivery.address && <p>{order.delivery.address}</p>}
              {(order.delivery.upazila || order.delivery.district) && (
                <p>{[order.delivery.upazila, order.delivery.district, order.delivery.division].filter(Boolean).join(", ")} {order.delivery.postalCode}</p>
              )}
              {order.customer.phone && <p className="mt-0.5" style={{ opacity: 0.55 }}>{order.customer.phone}</p>}
            </div>
          </div>
        )}

        {/* ── Email confirmation note ── */}
        {order.customer.email && (
          <p
            className="font-sans italic text-center mt-5"
            style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}
          >
            A confirmation has been sent to {order.customer.email}.
          </p>
        )}

        {/* ── WhatsApp support link ── */}
        <div className="text-center mt-6">
          <a
            href={`https://wa.me/8801712345678?text=${encodeURIComponent(`Hi, my order is ${order.orderId}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm inline-flex items-center gap-2"
            style={{ color: "var(--color-brand-charcoal)", opacity: 0.5, textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            Need help? Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
