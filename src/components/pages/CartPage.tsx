"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Truck } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  type CartItem,
} from "@/lib/store/cartSlice"

// ── Constants ──────────────────────────────────────────────────────────────────

const FREE_SHIPPING_THRESHOLD = 2000
const SHIPPING_FEE = 120

type PromoResult = { type: "percent"; value: number } | { type: "freeship" }

const PROMO_CODES: Record<string, PromoResult> = {
  EID20:     { type: "percent", value: 20 },
  WELCOME10: { type: "percent", value: 10 },
  FREESHIP:  { type: "freeship" },
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function parsePrice(p: string) {
  return parseInt(p.replace(/[৳,\s]/g, ""), 10) || 0
}

function taka(n: number) {
  return `৳${n.toLocaleString()}`
}

// ── Cart item row ──────────────────────────────────────────────────────────────

function CartItemRow({
  item,
  onRemove,
  onIncrement,
  onDecrement,
}: {
  item: CartItem
  onRemove: () => void
  onIncrement: () => void
  onDecrement: () => void
}) {
  const unitPrice = parsePrice(item.price)
  const lineTotal = unitPrice * item.quantity

  return (
    <div className="flex gap-4 py-5" style={{ borderBottom: "1px solid var(--color-border-light)" }}>
      {/* Product image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://placehold.co/160x200/${item.imgBg || "F5EFE6"}/${item.imgFg || "2D2D2D"}?text=${encodeURIComponent(item.imgText || "")}`}
        alt={item.name}
        className="flex-shrink-0 rounded-lg object-cover"
        style={{ width: "80px", height: "100px" }}
      />

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Name + remove */}
        <div className="flex items-start justify-between gap-2">
          <p
            className="font-sans font-semibold text-brand-charcoal truncate leading-tight"
            style={{ fontSize: "15px" }}
          >
            {item.name}
          </p>
          <button
            onClick={onRemove}
            className="flex-shrink-0 font-sans font-medium text-brand-rose hover:text-brand-mauve transition-colors"
            style={{ fontSize: "12px" }}
            aria-label="Remove item"
          >
            Remove
          </button>
        </div>

        {/* Brand (stored in imgText fallback — show as sub) */}
        <p className="font-sans text-brand-charcoal/55" style={{ fontSize: "12px" }}>
          {item.imgText || "FashionHub"}
        </p>

        {/* Size pill + color dot */}
        <div className="flex items-center gap-2">
          <span
            className="font-sans font-medium rounded-full px-2.5 py-0.5"
            style={{
              fontSize: "11px",
              background: "var(--color-brand-beige)",
              border: "1px solid var(--color-border-light)",
              color: "var(--color-brand-charcoal)",
            }}
          >
            {item.size}
          </span>
          {item.selectedColor && (
            <span
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{
                background: item.selectedColor.hex,
                border:
                  item.selectedColor.hex?.toLowerCase().includes("f") &&
                  parseInt(item.selectedColor.hex.slice(1, 3), 16) > 220
                    ? "1px solid var(--color-border)"
                    : "none",
              }}
              title={item.selectedColor.name}
            />
          )}
          {item.selectedColor && (
            <span className="font-sans text-brand-charcoal/45" style={{ fontSize: "11px" }}>
              {item.selectedColor.name}
            </span>
          )}
        </div>

        {/* Qty + price row */}
        <div className="flex items-center justify-between mt-1">
          {/* Quantity stepper */}
          <div
            className="inline-flex items-center rounded-full overflow-hidden"
            style={{ border: "1.5px solid var(--color-border)" }}
          >
            <button
              onClick={onDecrement}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center font-sans font-bold text-brand-charcoal hover:text-brand-rose transition-colors disabled:opacity-30"
              style={{ fontSize: "16px" }}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              className="w-8 text-center font-sans font-semibold text-brand-charcoal select-none"
              style={{ fontSize: "13px" }}
            >
              {item.quantity}
            </span>
            <button
              onClick={onIncrement}
              className="w-8 h-8 flex items-center justify-center font-sans font-bold text-brand-charcoal hover:text-brand-rose transition-colors"
              style={{ fontSize: "16px" }}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Prices */}
          <div className="text-right">
            <p className="font-sans font-semibold text-brand-charcoal" style={{ fontSize: "15px" }}>
              {taka(lineTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="font-sans text-brand-charcoal/40" style={{ fontSize: "11px" }}>
                {item.price} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Order summary card ─────────────────────────────────────────────────────────

function OrderSummary({
  subtotal,
  totalQty,
  discountPct,
  discountAmount,
  shippingFee,
  total,
  remaining,
  shippingPct,
  coupon,
  onCouponChange,
  onApplyCoupon,
  couponError,
  couponSuccess,
  appliedPromo,
}: {
  subtotal: number
  totalQty: number
  discountPct: number
  discountAmount: number
  shippingFee: number
  total: number
  remaining: number
  shippingPct: number
  coupon: string
  onCouponChange: (v: string) => void
  onApplyCoupon: () => void
  couponError: string
  couponSuccess: string
  appliedPromo: PromoResult | null
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden lg:sticky lg:top-[88px]"
      style={{ background: "var(--color-brand-beige)", border: "1px solid var(--color-border-light)" }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid var(--color-border-light)" }}>
        <h2
          className="font-heading font-light text-brand-charcoal"
          style={{ fontSize: "1.5rem", lineHeight: 1.2 }}
        >
          Order Summary
        </h2>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">
        {/* Line items */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="font-sans text-brand-charcoal/60" style={{ fontSize: "14px" }}>
              Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})
            </span>
            <span className="font-sans font-medium text-brand-charcoal" style={{ fontSize: "14px" }}>
              {taka(subtotal)}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="font-sans text-brand-charcoal/60" style={{ fontSize: "14px" }}>
                Discount ({discountPct}% off)
              </span>
              <span className="font-sans font-semibold" style={{ fontSize: "14px", color: "#4a7c59" }}>
                −{taka(discountAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="font-sans text-brand-charcoal/60" style={{ fontSize: "14px" }}>
              Shipping
            </span>
            {shippingFee === 0 ? (
              <span className="font-sans font-semibold" style={{ fontSize: "14px", color: "#4a7c59" }}>
                FREE
              </span>
            ) : (
              <span className="font-sans font-medium text-brand-charcoal" style={{ fontSize: "14px" }}>
                {taka(SHIPPING_FEE)}
              </span>
            )}
          </div>
        </div>

        {/* Free shipping progress */}
        <div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: "6px", background: "var(--color-border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${shippingPct}%`, background: "var(--color-brand-rose)" }}
            />
          </div>
          <p className="font-sans mt-2" style={{ fontSize: "12px" }}>
            {remaining > 0 ? (
              <span className="text-brand-charcoal/55">
                <Truck size={12} className="inline mr-1" style={{ color: "var(--color-brand-rose)" }} />
                You&apos;re{" "}
                <strong className="text-brand-charcoal">{taka(remaining)}</strong> away from free
                shipping!
              </span>
            ) : (
              <span style={{ color: "#4a7c59" }}>🎉 You&apos;ve unlocked free shipping!</span>
            )}
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--color-border-light)" }} />

        {/* Total */}
        <div className="flex justify-between items-baseline">
          <span className="font-sans font-semibold text-brand-charcoal" style={{ fontSize: "14px" }}>
            Total
          </span>
          <span className="font-sans font-semibold text-brand-charcoal" style={{ fontSize: "18px" }}>
            {taka(total)}
          </span>
        </div>

        {/* Promo code */}
        <div
          className="rounded-xl p-4 flex flex-col gap-2"
          style={{ background: "var(--color-brand-ivory)", border: "1px solid var(--color-border-light)" }}
        >
          <p className="font-sans font-semibold text-brand-charcoal" style={{ fontSize: "12px" }}>
            Promo Code
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => onCouponChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
              placeholder="e.g. EID20"
              className="flex-1 font-sans rounded-full px-4 py-2 outline-none transition-colors"
              style={{
                fontSize: "13px",
                background: "var(--color-brand-beige)",
                border: "1.5px solid var(--color-border-light)",
                color: "var(--color-brand-charcoal)",
              }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--color-brand-rose)" }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--color-border-light)" }}
            />
            <button
              onClick={onApplyCoupon}
              className="font-sans font-semibold rounded-full px-4 py-2 text-brand-ivory transition-colors whitespace-nowrap"
              style={{ fontSize: "13px", background: "var(--color-brand-rose)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-mauve)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-rose)" }}
            >
              Apply
            </button>
          </div>
          {couponError && (
            <p className="font-sans" style={{ fontSize: "12px", color: "var(--color-brand-rose)" }}>
              ✕ {couponError}
            </p>
          )}
          {couponSuccess && (
            <p className="font-sans" style={{ fontSize: "12px", color: "#4a7c59" }}>
              ✓ {couponSuccess}
            </p>
          )}
        </div>

        {/* Checkout CTA */}
        <Link
          href="/checkout"
          className="w-full flex items-center justify-center font-sans font-semibold text-brand-ivory rounded-full py-4 transition-colors"
          style={{ fontSize: "15px", background: "var(--color-brand-rose)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-brand-mauve)" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-brand-rose)" }}
        >
          Proceed to Checkout →
        </Link>

        <Link
          href="/"
          className="w-full text-center font-sans underline underline-offset-2 transition-colors hover:text-brand-rose"
          style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}
        >
          Continue Shopping
        </Link>

        {/* Payment badges */}
        <div className="flex flex-wrap gap-1.5 justify-center pt-1">
          {["bKash", "Nagad", "Visa", "Mastercard"].map((badge) => (
            <span
              key={badge}
              className="font-sans font-semibold rounded px-2.5 py-1 text-brand-charcoal/50"
              style={{
                fontSize: "11px",
                background: "var(--color-brand-ivory)",
                border: "1px solid var(--color-border-light)",
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((s) => s.cart.items)

  const [coupon, setCoupon] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<PromoResult | null>(null)
  const [couponError, setCouponError] = useState("")
  const [couponSuccess, setCouponSuccess] = useState("")

  // ── Derived totals ──────────────────────────────────────────────────────────
  const subtotal = items.reduce((s, i) => s + parsePrice(i.price) * i.quantity, 0)
  const totalQty = items.reduce((s, i) => s + i.quantity, 0)
  const discountPct = appliedPromo?.type === "percent" ? appliedPromo.value : 0
  const discountAmount = Math.round((subtotal * discountPct) / 100)
  const afterDiscount = subtotal - discountAmount
  const freeShip = appliedPromo?.type === "freeship"
  const shippingFee = afterDiscount >= FREE_SHIPPING_THRESHOLD || freeShip ? 0 : SHIPPING_FEE
  const total = afterDiscount + shippingFee
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)
  const shippingPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleRemove(item: CartItem) {
    dispatch(removeFromCart({ id: item.id, size: item.size }))
  }

  function handleApplyCoupon() {
    const code = coupon.trim().toUpperCase()
    const promo = PROMO_CODES[code]
    if (promo) {
      setAppliedPromo(promo)
      setCouponSuccess(
        promo.type === "percent" ? `${promo.value}% discount applied!` : "Free shipping applied!",
      )
      setCouponError("")
    } else {
      setCouponError("Invalid code. Try EID20, WELCOME10, or FREESHIP.")
      setCouponSuccess("")
      setAppliedPromo(null)
    }
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center gap-5 min-h-[60vh]">
        <ShoppingBag
          size={64}
          strokeWidth={1}
          style={{ color: "var(--color-brand-rose)", opacity: 0.35 }}
        />
        <div>
          <p
            className="font-heading font-light text-brand-charcoal mb-2"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}
          >
            Your bag is empty.
          </p>
          <p className="font-sans text-brand-charcoal/50" style={{ fontSize: "14px" }}>
            Looks like you haven&apos;t added anything yet.
          </p>
        </div>
        <Link
          href="/"
          className="font-sans font-semibold text-brand-ivory rounded-full px-8 py-3 mt-2 transition-colors"
          style={{ background: "var(--color-brand-rose)", fontSize: "14px" }}
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  // ── Filled cart ─────────────────────────────────────────────────────────────
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page title */}
        <div className="mb-8">
          <h1
            className="font-heading font-light text-brand-charcoal"
            style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", lineHeight: 1.15 }}
          >
            Your Bag
          </h1>
          <p className="font-sans text-brand-charcoal/60 mt-1" style={{ fontSize: "14px" }}>
            {totalQty} {totalQty === 1 ? "item" : "items"}
          </p>
        </div>

        {/* 65/35 split */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left: item list ── */}
          <div className="flex-1 min-w-0">
            {/* First item has no top border — handled by :first row having no top divider */}
            <div>
              {items.map((item, i) => (
                <div key={`${item.id}-${item.size}`} style={i === 0 ? { borderTop: "1px solid var(--color-border-light)" } : {}}>
                  <CartItemRow
                    item={item}
                    onRemove={() => handleRemove(item)}
                    onIncrement={() => dispatch(incrementQuantity({ id: item.id, size: item.size }))}
                    onDecrement={() => dispatch(decrementQuantity({ id: item.id, size: item.size }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: summary ── */}
          <div className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0">
            <OrderSummary
              subtotal={subtotal}
              totalQty={totalQty}
              discountPct={discountPct}
              discountAmount={discountAmount}
              shippingFee={shippingFee}
              total={total}
              remaining={remaining}
              shippingPct={shippingPct}
              coupon={coupon}
              onCouponChange={(v) => {
                setCoupon(v)
                setCouponError("")
                setCouponSuccess("")
              }}
              onApplyCoupon={handleApplyCoupon}
              couponError={couponError}
              couponSuccess={couponSuccess}
              appliedPromo={appliedPromo}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex items-center justify-between px-4 py-3"
        style={{
          background: "var(--color-brand-ivory)",
          borderTop: "1px solid var(--color-border-light)",
          boxShadow: "0 -4px 20px rgba(45,42,38,0.08)",
        }}
      >
        <div>
          <p className="font-sans text-brand-charcoal/50" style={{ fontSize: "11px" }}>Total</p>
          <p className="font-sans font-semibold text-brand-charcoal" style={{ fontSize: "18px" }}>
            {taka(total)}
          </p>
        </div>
        <Link
          href="/checkout"
          className="font-sans font-semibold text-brand-ivory rounded-full px-6 py-3 transition-colors"
          style={{ fontSize: "14px", background: "var(--color-brand-rose)" }}
        >
          Checkout →
        </Link>
      </div>
    </>
  )
}
