"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, Package } from "lucide-react"
import { trackOrder, type TrackOrderResult } from "@/lib/api/orders"

// ── Types ─────────────────────────────────────────────────────────────────────

interface TrackStep {
  label: string
  sub: string
  date: string | null
  state: "done" | "active" | "pending"
}

interface TrackedOrder {
  orderId: string
  customerName: string
  // The public tracking endpoint returns status/timeline/items only — no
  // pricing or customer PII — so both are optional and omitted from the UI
  // when absent (every real, backend-sourced lookup).
  items: { name: string; size: string; quantity: number; price?: number; imgBg: string; imgFg: string; imgText: string }[]
  pricing?: { subtotal: number; discount: number; shipping: number; total: number }
  steps: TrackStep[]
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function taka(n: number) { return `৳${n.toLocaleString()}` }

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

// Backend order.status: pending | confirmed | processing | shipped | delivered | cancelled | refunded
const STATUS_STEP_INDEX: Record<string, number> = {
  pending: 0, confirmed: 0, processing: 1, shipped: 2, delivered: 4, cancelled: -1, refunded: -1,
}

const STEP_DEFS = [
  { label: "Order Placed",     sub: "Your order has been confirmed" },
  { label: "Processing",       sub: "Our team is preparing your order" },
  { label: "Shipped",          sub: "Handed to our delivery partner" },
  { label: "Out for Delivery", sub: "Arriving soon" },
  { label: "Delivered",        sub: "Order delivered" },
]

function buildStepsFromBackend(result: TrackOrderResult): TrackStep[] {
  const currentIdx = STATUS_STEP_INDEX[result.status] ?? 0
  const isDelivered = result.status === "delivered"

  const timestampFor: Record<number, string> = {}
  for (const entry of result.timeline) {
    const a = entry.action.toLowerCase()
    if (a.includes("creat") || a.includes("placed")) timestampFor[0] = entry.at
    else if (a.includes("process") || a.includes("pack")) timestampFor[1] = entry.at
    else if (a.includes("ship") || a.includes("despatch")) timestampFor[2] = entry.at
    else if (a.includes("out for delivery")) timestampFor[3] = entry.at
    else if (a.includes("deliver")) timestampFor[4] = entry.at
  }
  timestampFor[0] = timestampFor[0] ?? result.createdAt

  return STEP_DEFS.map((step, i) => {
    const done = i < currentIdx || isDelivered
    const active = i === currentIdx && !isDelivered && result.status !== "cancelled" && result.status !== "refunded"
    const ts = timestampFor[i]
    return {
      label: step.label,
      sub: ts ? `${fmt(ts)} at ${fmtTime(ts)}` : done ? "Completed" : active ? step.sub : "Pending",
      date: ts ?? null,
      state: done ? "done" : active ? "active" : "pending",
    }
  })
}

function fromTrackOrderResult(result: TrackOrderResult): TrackedOrder {
  return {
    orderId: result.orderId,
    customerName: "",
    items: result.items.map((it) => ({
      name: it.productName,
      size: it.variant?.size ?? "-",
      quantity: it.quantity,
      imgBg: "F5EFE6",
      imgFg: "2D2D2D",
      imgText: it.productName.split(" ")[0] || "Item",
    })),
    steps: buildStepsFromBackend(result),
  }
}

// ── Pulsing dot ────────────────────────────────────────────────────────────────

function PulsingDot() {
  return (
    <>
      <style>{`
        @keyframes fh-pulse-ring {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .fh-pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--color-brand-rose);
          animation: fh-pulse-ring 1.8s cubic-bezier(0.215,0.61,0.355,1) infinite;
        }
      `}</style>
      <div style={{ position: "relative", width: "36px", height: "36px", flexShrink: 0 }}>
        <div className="fh-pulse-ring" />
        <div
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "var(--color-brand-rose)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-brand-ivory)" }} />
        </div>
      </div>
    </>
  )
}

// ── Tracking Timeline ──────────────────────────────────────────────────────────

function TrackingTimeline({ steps }: { steps: TrackStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const done   = step.state === "done"
        const active = step.state === "active"

        return (
          <div key={step.label} className="flex gap-4">
            {/* Icon + connector */}
            <div className="flex flex-col items-center" style={{ width: "36px", flexShrink: 0 }}>
              {active ? (
                <PulsingDot />
              ) : (
                <div
                  style={{
                    width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "var(--color-brand-charcoal)" : "transparent",
                    border: done ? "none" : "2px solid var(--color-border)",
                    opacity: done ? 1 : 0.35,
                  }}
                >
                  {done ? (
                    <Check size={15} strokeWidth={2.5} style={{ color: "var(--color-brand-ivory)" }} />
                  ) : (
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-border)" }} />
                  )}
                </div>
              )}
              {/* Connector line */}
              {!isLast && (
                <div
                  style={{
                    width: "1.5px",
                    flex: 1,
                    minHeight: "28px",
                    background: done ? "var(--color-brand-charcoal)" : "transparent",
                    borderLeft: done ? "none" : "1.5px dashed var(--color-border-light)",
                    margin: "4px 0",
                    opacity: done ? 0.3 : 0.5,
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: isLast ? 0 : "24px", paddingTop: "6px" }}>
              <p
                className="font-sans font-semibold"
                style={{
                  fontSize: "14px",
                  color: "var(--color-brand-charcoal)",
                  opacity: active ? 1 : done ? 1 : 0.4,
                }}
              >
                {step.label}
                {active && (
                  <span
                    className="ml-2 font-sans font-bold text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(198,147,132,0.15)", color: "var(--color-brand-rose)" }}
                  >
                    LIVE
                  </span>
                )}
              </p>
              <p
                className="font-sans mt-0.5"
                style={{
                  fontSize: "12px",
                  color: "var(--color-brand-charcoal)",
                  opacity: active ? 0.75 : done ? 0.55 : 0.3,
                }}
              >
                {step.sub}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Results Card ───────────────────────────────────────────────────────────────

function ResultsCard({ order }: { order: TrackedOrder }) {
  const activeStep = order.steps.find((s) => s.state === "active") ?? order.steps[order.steps.length - 1]
  const doneCount  = order.steps.filter((s) => s.state === "done").length
  const progress   = Math.round((doneCount / (order.steps.length - 1)) * 100)

  return (
    <div className="mt-8 space-y-5">
      {/* Status card */}
      <div
        style={{
          background: "var(--color-brand-ivory)",
          border: "1px solid var(--color-border-light)",
          borderRadius: "var(--radius-card, 16px)",
          padding: "24px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div>
            <p className="font-sans font-semibold" style={{ fontSize: "15px", color: "var(--color-brand-charcoal)" }}>
              {order.orderId}
            </p>
            {order.customerName && (
              <p className="font-sans mt-0.5" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
                {order.customerName}
              </p>
            )}
          </div>
          <span
            className="font-sans font-bold text-xs px-3 py-1.5 rounded-full"
            style={{ background: "rgba(198,147,132,0.15)", color: "var(--color-brand-rose)" }}
          >
            {activeStep.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div
            style={{
              height: "4px", borderRadius: "999px",
              background: "var(--color-border-light)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "var(--color-brand-rose)",
                borderRadius: "999px",
                transition: "width 0.8s ease",
              }}
            />
          </div>
          <p className="font-sans mt-1.5 text-right" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.45 }}>
            {progress}% complete
          </p>
        </div>

        {/* Timeline */}
        <TrackingTimeline steps={order.steps} />
      </div>

      {/* Items summary */}
      <div
        style={{
          background: "var(--color-brand-ivory)",
          border: "1px solid var(--color-border-light)",
          borderRadius: "var(--radius-card, 16px)",
          padding: "24px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <p
          className="font-sans font-semibold mb-4"
          style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}
        >
          Items in this Order
        </p>

        <div className="space-y-4 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://placehold.co/52x68/${item.imgBg}/${item.imgFg}?text=${encodeURIComponent(item.imgText)}`}
                alt={item.name}
                style={{ width: "52px", height: "68px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium truncate" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>{item.name}</p>
                <p className="font-sans mt-0.5" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
                  Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              {item.price !== undefined && (
                <p className="font-sans font-semibold flex-shrink-0" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>
                  {taka(item.price * item.quantity)}
                </p>
              )}
            </div>
          ))}
        </div>

        {order.pricing && (
          <div className="space-y-1.5 pt-4" style={{ borderTop: "1px solid var(--color-border-light)" }}>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between font-sans text-sm font-semibold" style={{ color: "#5a8a6a" }}>
                <span>Discount</span><span>−{taka(order.pricing.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-sans text-sm" style={{ color: "var(--color-brand-charcoal)", opacity: 0.6 }}>
              <span>Shipping</span>
              <span>{order.pricing.shipping === 0 ? <span style={{ color: "#5a8a6a", fontWeight: 600 }}>FREE</span> : taka(order.pricing.shipping)}</span>
            </div>
            <div className="flex justify-between font-sans font-bold" style={{ paddingTop: "10px", borderTop: "1px solid var(--color-border-light)", marginTop: "6px" }}>
              <span style={{ fontSize: "15px", color: "var(--color-brand-charcoal)" }}>Total</span>
              <span style={{ fontSize: "15px", color: "var(--color-brand-charcoal)" }}>{taka(order.pricing.total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Need help */}
      <p className="font-sans text-center" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.45 }}>
        Need help?{" "}
        <a
          href="https://wa.me/8801712345678"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-brand-rose)", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          Chat with us on WhatsApp
        </a>
      </p>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function OrderTrackingPage() {
  const searchParams = useSearchParams()
  const urlOrderId = searchParams.get("orderId") ?? ""

  const [query, setQuery] = useState(urlOrderId)
  const [order, setOrder] = useState<TrackedOrder | null>(null)
  const [searching, setSearching] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const doSearch = async (q: string) => {
    if (!q.trim()) return
    setSearching(true)
    setNotFound(false)
    setHasSearched(true)

    try {
      const { payload } = await trackOrder(q.trim())
      setOrder(fromTrackOrderResult(payload))
      setNotFound(false)
    } catch {
      setOrder(null)
      setNotFound(true)
    } finally {
      setSearching(false)
    }
  }

  // Auto-search on URL param
  useEffect(() => {
    if (urlOrderId) {
      setQuery(urlOrderId)
      doSearch(urlOrderId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlOrderId])

  return (
    <div style={{ background: "var(--color-brand-ivory)", minHeight: "80vh" }}>
      {/* Hero */}
      <div
        style={{
          background: "var(--color-brand-beige)",
          borderBottom: "1px solid var(--color-border-light)",
          paddingTop: "clamp(40px, 6vw, 64px)",
          paddingBottom: "clamp(32px, 5vw, 52px)",
          paddingLeft: "clamp(16px, 4vw, 32px)",
          paddingRight: "clamp(16px, 4vw, 32px)",
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <Package
            size={36}
            strokeWidth={1.5}
            style={{ color: "var(--color-brand-rose)", margin: "0 auto 16px" }}
          />
          <h1
            className="font-heading font-light"
            style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.15, marginBottom: "10px" }}
          >
            Track Your Order
          </h1>
          <p
            className="font-sans"
            style={{ fontSize: "15px", color: "var(--color-brand-charcoal)", opacity: 0.6, maxWidth: "480px", margin: "0 auto" }}
          >
            Enter the order ID from your confirmation email.
          </p>
        </div>
      </div>

      {/* Search form */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "clamp(24px, 4vw, 40px) clamp(16px, 4vw, 24px) 0",
        }}
      >
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(query) }}
            placeholder="e.g. ORD00000001"
            style={{
              flex: 1,
              height: "50px",
              border: "1.5px solid var(--color-border)",
              borderRadius: "999px",
              padding: "0 20px",
              fontSize: "14px",
              fontFamily: "var(--font-sans, sans-serif)",
              background: "var(--color-brand-ivory)",
              color: "var(--color-brand-charcoal)",
              outline: "none",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-charcoal)" }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)" }}
          />
          <button
            type="button"
            onClick={() => doSearch(query)}
            disabled={searching}
            style={{
              height: "50px",
              padding: "0 24px",
              background: searching ? "var(--color-brand-mauve)" : "var(--color-brand-rose)",
              color: "var(--color-brand-ivory)",
              border: "none",
              borderRadius: "999px",
              fontFamily: "var(--font-sans, sans-serif)",
              fontWeight: 600,
              fontSize: "14px",
              cursor: searching ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { if (!searching) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-mauve)" }}
            onMouseLeave={(e) => { if (!searching) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-rose)" }}
          >
            {searching ? (
              <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : null}
            {searching ? "Searching…" : "Track Order"}
          </button>
        </div>

        {/* Not found */}
        {notFound && hasSearched && (
          <div
            className="mt-4 text-center rounded-xl p-5"
            style={{ background: "rgba(198,147,132,0.08)", border: "1px solid rgba(198,147,132,0.2)" }}
          >
            <p className="font-sans font-semibold text-sm" style={{ color: "var(--color-brand-charcoal)" }}>
              Order not found
            </p>
            <p className="font-sans mt-1" style={{ fontSize: "12px", color: "var(--color-brand-charcoal)", opacity: 0.55 }}>
              Double-check your order ID or phone number and try again.
            </p>
          </div>
        )}

        {/* Results */}
        {order && !searching && <ResultsCard order={order} />}

        {/* Back link */}
        <div className="text-center mt-8 mb-12">
          <Link
            href="/"
            className="font-sans text-sm"
            style={{ color: "var(--color-brand-charcoal)", opacity: 0.45, textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
