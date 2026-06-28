"use client"

import Link from "next/link"
import { type CartItem } from "@/lib/store/cartSlice"

interface Props {
  items: CartItem[]
}

function parsePrice(p: string) {
  return parseInt(p.replace(/[৳,\s]/g, ""), 10) || 0
}

function fmt(n: number) {
  return n.toLocaleString()
}

export function OrderReview({ items }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-brand-charcoal text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
          4
        </div>
        <h2 className="font-semibold text-lg text-brand-charcoal">Review Your Order</h2>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => {
          const lineTotal = parsePrice(item.price) * item.quantity
          return (
            <div
              key={`${item.id}-${item.size}`}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://placehold.co/60x60/F5EFE6/2D2D2D?text=%F0%9F%91%97"
                alt={item.name}
                width={60}
                height={60}
                className="w-[60px] h-[60px] rounded-lg bg-gray-50 object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Size: {item.size} · Qty: {item.quantity}
                </p>
              </div>
              <p className="font-medium text-sm text-brand-charcoal flex-shrink-0">
                ৳{fmt(lineTotal)}
              </p>
            </div>
          )
        })}
      </div>

      <Link
        href="/cart"
        className="inline-block mt-4 text-sm font-semibold text-brand-rose hover:text-brand-mauve transition-colors"
      >
        Edit Cart →
      </Link>
    </div>
  )
}
