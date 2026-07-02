"use client"

import Link from "next/link"
import { Phone } from "lucide-react"

interface OrderItem {
  id: number
  name: string
  brand?: string
  size: number | string
  quantity: number
  price: number
  image?: string
}

interface Pricing {
  subtotal: number
  delivery: number
  discount?: number
  total: number
}

interface TrackingOrderSummaryProps {
  orderId: string
  items: OrderItem[]
  pricing: Pricing
  payment: { method: string; amount: number }
}

const PAYMENT_LABELS: Record<string, { label: string; color: string }> = {
  bkash:  { label: "Paid via bKash",        color: "#E2136E" },
  nagad:  { label: "Paid via Nagad",         color: "#F37021" },
  rocket: { label: "Paid via Rocket",        color: "#8B5CF6" },
  card:   { label: "Paid via Card",          color: "#1A2B5E" },
  cod:    { label: "Cash on Delivery",       color: "#374151" },
}

function fmt(n: number) {
  return n.toLocaleString()
}

export function TrackingOrderSummary({ orderId, items, pricing, payment }: TrackingOrderSummaryProps) {
  const waMessage = encodeURIComponent(`Hi, I need help with order ${orderId}`)
  const pm = PAYMENT_LABELS[payment.method] ?? { label: payment.method, color: "#374151" }

  return (
    <div className="sticky top-24">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {/* Title */}
        <h2 className="font-semibold text-lg text-brand-charcoal pb-3 mb-4 border-b border-gray-100">
          Order Summary
        </h2>

        {/* Items */}
        <div className="space-y-3 mb-5">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image ?? `https://placehold.co/56x56/f5f5f5/cccccc?text=%F0%9F%91%9F`}
                alt={item.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-lg bg-gray-50 object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-charcoal truncate">{item.name}</p>
                {item.brand && <p className="text-xs text-gray-400">{item.brand}</p>}
                <p className="text-xs text-gray-400">Size {item.size} · Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-800 flex-shrink-0">৳{fmt(item.price)}</p>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>৳{fmt(pricing.subtotal)}</span>
          </div>
          {(pricing.discount ?? 0) > 0 && (
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Discount</span>
              <span>−৳{fmt(pricing.discount!)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery</span>
            {pricing.delivery === 0 ? (
              <span className="text-green-600 font-bold">FREE</span>
            ) : (
              <span>৳{fmt(pricing.delivery)}</span>
            )}
          </div>
          <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-brand-charcoal text-base">৳{fmt(pricing.total)}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="mb-5">
          <p className="text-xs font-semibold" style={{ color: pm.color }}>
            {pm.label}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <a
            href={`https://wa.me/8801712345678?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-brand-charcoal text-brand-charcoal font-semibold py-2.5 rounded-xl text-sm hover:bg-brand-charcoal hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            Contact Support
          </a>
          <Link
            href="/returns"
            className="flex items-center justify-center w-full border border-gray-200 text-gray-500 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            🔄 Return / Exchange
          </Link>
        </div>

        {/* Need help box */}
        <div className="bg-brand-charcoal rounded-xl p-4 mt-4 text-center">
          <p className="text-white font-medium text-sm">Need help?</p>
          <p className="text-white/70 text-xs mt-1">Our team is available 24/7</p>
          <a
            href={`https://wa.me/8801712345678?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center w-full bg-brand-gold hover:bg-[#b8881a] text-brand-charcoal font-bold py-2.5 rounded-xl text-sm transition-colors"
          >
            💬 Chat Now
          </a>
        </div>
      </div>
    </div>
  )
}
