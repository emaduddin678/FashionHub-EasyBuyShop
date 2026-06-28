"use client"

import { type CartItem } from "@/lib/store/cartSlice"

interface Props {
  items: CartItem[]
  subtotal: number
  discountAmount: number
  discountLabel: string
  deliveryCharge: number
  total: number
  onPlaceOrder: () => void
  loading: boolean
}

function fmt(n: number) {
  return n.toLocaleString()
}

export function CheckoutSummary({
  items,
  subtotal,
  discountAmount,
  discountLabel,
  deliveryCharge,
  total,
  onPlaceOrder,
  loading,
}: Props) {
  const totalQty = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      {/* Title */}
      <h2 className="font-semibold text-lg text-brand-charcoal pb-3 border-b border-gray-100 mb-4">
        Order Total
      </h2>

      {/* Price breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">
            Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})
          </span>
          <span className="font-semibold">৳{fmt(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Discount ({discountLabel})</span>
            <span>−৳{fmt(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-500">Delivery</span>
          {deliveryCharge === 0 ? (
            <span className="font-bold text-green-600">FREE</span>
          ) : (
            <span className="font-semibold">৳{fmt(deliveryCharge)}</span>
          )}
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
          <span className="font-bold text-gray-900 text-base">Total</span>
          <span className="font-bold text-xl text-brand-charcoal">৳{fmt(total)}</span>
        </div>
        <p className="text-xs text-gray-400 text-right -mt-1">Including VAT</p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={loading}
        className="mt-4 w-full bg-brand-rose hover:bg-brand-mauve text-brand-charcoal font-bold py-4 rounded-xl text-base transition-all hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5 text-brand-charcoal" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processing...
          </>
        ) : (
          "Place Order →"
        )}
      </button>

      {/* SSL */}
      <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
        🔒 256-bit SSL Secured
      </p>

      {/* What happens next */}
      <div className="bg-gray-50 rounded-xl p-4 mt-4">
        <p className="text-sm font-medium text-brand-charcoal mb-3">What happens next?</p>
        <div className="space-y-2">
          {[
            { icon: "📧", text: "Order confirmation sent to your email" },
            { icon: "📦", text: "We prepare and pack your order" },
            { icon: "🚚", text: "Delivery within 3-5 business days" },
          ].map((step) => (
            <div key={step.text} className="flex items-start gap-2 text-xs text-gray-500 py-1">
              <span>{step.icon}</span>
              <span>{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
