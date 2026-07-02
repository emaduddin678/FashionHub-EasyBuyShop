"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Heart, X, ShoppingBag } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { removeWishlistItem, clearWishlist, type WishlistItem } from "@/lib/store/wishlistSlice"
import { addToCart } from "@/lib/store/cartSlice"
import type { ClothingSize } from "@/lib/data/products"

// ── Helpers ────────────────────────────────────────────────────────────────────

function taka(n: number) { return `৳${n.toLocaleString()}` }

const ALL_SIZES: ClothingSize[] = ["XS", "S", "M", "L", "XL", "XXL"]

// ── Size Picker Popover ─────────────────────────────────────────────────────────

function SizePicker({
  item,
  onAdd,
  onClose,
}: {
  item: WishlistItem
  onAdd: (size: ClothingSize) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: "0",
        right: "0",
        zIndex: 50,
        background: "var(--color-brand-ivory)",
        border: "1.5px solid var(--color-border)",
        borderRadius: "12px",
        padding: "12px",
        boxShadow: "0 8px 24px rgba(45,42,38,0.14)",
      }}
    >
      <p
        className="font-sans font-semibold mb-2"
        style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.07em" }}
      >
        Select Size
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ALL_SIZES.map((sz) => {
          const available = item.sizes.includes(sz)
          return (
            <button
              key={sz}
              type="button"
              disabled={!available}
              onClick={() => { if (available) { onAdd(sz); onClose() } }}
              style={{
                height: "30px",
                padding: "0 10px",
                borderRadius: "6px",
                border: "1.5px solid",
                borderColor: available ? "var(--color-border)" : "var(--color-border-light)",
                background: "transparent",
                fontSize: "12px",
                fontFamily: "var(--font-sans, sans-serif)",
                fontWeight: 500,
                color: available ? "var(--color-brand-charcoal)" : "var(--color-brand-charcoal)",
                opacity: available ? 1 : 0.3,
                cursor: available ? "pointer" : "not-allowed",
                textDecoration: available ? "none" : "line-through",
                transition: "border-color 0.12s, background 0.12s",
              }}
              onMouseEnter={(e) => {
                if (available) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = "var(--color-brand-rose)"
                  el.style.background = "rgba(198,147,132,0.08)"
                }
              }}
              onMouseLeave={(e) => {
                if (available) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = "var(--color-border)"
                  el.style.background = "transparent"
                }
              }}
            >
              {sz}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Wishlist Card ───────────────────────────────────────────────────────────────

function WishlistCard({
  item,
  onRemove,
  onAddToCart,
}: {
  item: WishlistItem
  onRemove: () => void
  onAddToCart: (size: ClothingSize) => void
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const removeRef = useRef<HTMLButtonElement>(null)

  const savings = item.originalPrice > item.price ? item.originalPrice - item.price : 0
  const imgUrl = `https://placehold.co/480x640/${item.imgBg || "F5EFE6"}/${item.imgFg || "2D2D2D"}?text=${encodeURIComponent(item.imgText || item.name.split(" ")[0] || "")}`

  function handleAddToCart(size: ClothingSize) {
    onAddToCart(size)
    setAdded(true)
    setPickerOpen(false)
    setTimeout(() => setAdded(false), 2000)
  }

  const BADGE_LABELS: Record<string, string> = { new: "NEW", sale: "SALE", featured: "FEATURED" }
  const BADGE_COLORS: Record<string, string> = {
    new:      "var(--color-badge-new, #6b7c6e)",
    sale:     "var(--color-badge-sale, #c69384)",
    featured: "var(--color-badge-featured, #7c6e7a)",
  }

  return (
    <div
      className="group flex flex-col"
      style={{
        background: "var(--color-brand-ivory)",
        borderRadius: "var(--radius-card, 16px)",
        boxShadow: "var(--shadow-card)",
        overflow: "visible",
        position: "relative",
      }}
    >
      {/* Image wrapper */}
      <Link href={`/product/${item.id}`} className="relative block overflow-hidden flex-shrink-0" style={{ aspectRatio: "3/4", borderRadius: "var(--radius-card, 16px) var(--radius-card, 16px) 0 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl}
          alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s", display: "block" }}
          className="group-hover:scale-105"
        />

        {/* Badge */}
        {item.badge && (
          <span
            className="absolute top-3 left-3 z-10 font-sans font-bold text-brand-ivory px-2.5 py-1 rounded uppercase tracking-wider"
            style={{ fontSize: "10px", background: BADGE_COLORS[item.badge] ?? "var(--color-brand-charcoal)" }}
          >
            {BADGE_LABELS[item.badge] ?? item.badge}
          </span>
        )}

        {/* Remove button — top right */}
        <button
          ref={removeRef}
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove() }}
          aria-label="Remove from wishlist"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-sm transition-all"
          style={{ border: "none", cursor: "pointer" }}
          onMouseEnter={() => { if (removeRef.current) removeRef.current.style.color = "var(--color-brand-rose)" }}
          onMouseLeave={() => { if (removeRef.current) removeRef.current.style.color = "var(--color-brand-charcoal)" }}
        >
          <X size={14} strokeWidth={2} style={{ color: "inherit", transition: "color 0.15s" }} />
        </button>
      </Link>

      {/* Card body */}
      <Link href={`/product/${item.id}`} className="flex flex-col gap-1 p-4 pt-3 flex-1">
        <p
          className="font-sans uppercase tracking-widest"
          style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.55 }}
        >
          {item.brand}
        </p>
        <p
          className="font-sans leading-snug line-clamp-2"
          style={{ fontSize: "14px", color: "var(--color-brand-charcoal)" }}
        >
          {item.name}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-sans font-semibold" style={{ fontSize: "15px", color: "var(--color-brand-charcoal)" }}>
            {taka(item.price)}
          </span>
          {savings > 0 && (
            <>
              <span className="font-sans line-through" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.4 }}>
                {taka(item.originalPrice)}
              </span>
              <span
                className="font-sans font-semibold rounded-full px-2 py-0.5"
                style={{ fontSize: "11px", background: "rgba(198,147,132,0.12)", color: "var(--color-brand-rose)" }}
              >
                {taka(savings)} OFF
              </span>
            </>
          )}
        </div>
      </Link>

      {/* Add to Cart button — below card, relative for popover */}
      <div className="px-3 pb-3 relative">
        <button
          type="button"
          onClick={() => setPickerOpen((p) => !p)}
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "999px",
            border: "none",
            background: added ? "#5a8a6a" : "var(--color-brand-rose)",
            color: "var(--color-brand-ivory)",
            fontFamily: "var(--font-sans, sans-serif)",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            if (!added) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-mauve)"
          }}
          onMouseLeave={(e) => {
            if (!added) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-rose)"
          }}
        >
          {added ? (
            <><span>✓</span> Added to Bag</>
          ) : (
            <><ShoppingBag size={13} /> Add to Bag</>
          )}
        </button>

        {pickerOpen && (
          <SizePicker
            item={item}
            onAdd={handleAddToCart}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>
    </div>
  )
}

// ── Cart Toast ─────────────────────────────────────────────────────────────────

function CartToast({ name, onDismiss }: { name: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-[200] flex items-center gap-3 rounded-xl px-4 py-3 font-sans text-sm"
      style={{
        background: "var(--color-brand-ivory)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "0 8px 30px rgba(45,42,38,0.18)",
        color: "var(--color-brand-charcoal)",
      }}
    >
      <div
        style={{
          width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
          background: "rgba(90,138,106,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{ color: "#5a8a6a", fontSize: "13px" }}>✓</span>
      </div>
      <span className="flex-1 leading-snug" style={{ fontSize: "13px" }}>
        <span className="font-semibold">{name}</span> added to bag
      </span>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link href="/cart" style={{ color: "var(--color-brand-rose)", fontWeight: 600, fontSize: "12px" }}>
          View →
        </Link>
        <button
          type="button"
          onClick={onDismiss}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand-charcoal)", opacity: 0.4, padding: 0, lineHeight: 1 }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Confirm dialog ────────────────────────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4" style={{ background: "rgba(45,42,38,0.45)" }}>
      <div
        style={{
          background: "var(--color-brand-ivory)",
          borderRadius: "16px",
          padding: "28px 24px",
          maxWidth: "360px",
          width: "100%",
          boxShadow: "0 12px 48px rgba(45,42,38,0.22)",
        }}
      >
        <p className="font-sans font-semibold mb-1" style={{ fontSize: "15px", color: "var(--color-brand-charcoal)" }}>Are you sure?</p>
        <p className="font-sans mb-5" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}>{message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1, height: "40px", borderRadius: "999px",
              border: "1.5px solid var(--color-border)",
              background: "transparent",
              fontFamily: "var(--font-sans, sans-serif)",
              fontWeight: 600, fontSize: "13px",
              color: "var(--color-brand-charcoal)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1, height: "40px", borderRadius: "999px",
              border: "none",
              background: "var(--color-brand-rose)",
              fontFamily: "var(--font-sans, sans-serif)",
              fontWeight: 600, fontSize: "13px",
              color: "var(--color-brand-ivory)",
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <Heart
        size={64}
        strokeWidth={1.5}
        style={{ color: "var(--color-brand-rose)", opacity: 0.35, marginBottom: "20px" }}
      />
      <h2
        className="font-heading font-light mb-3"
        style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.2 }}
      >
        Nothing saved yet.
      </h2>
      <p
        className="font-sans mb-8"
        style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.55, maxWidth: "300px" }}
      >
        Heart the pieces you love and find them all right here.
      </p>
      <Link
        href="/"
        className="font-sans font-semibold text-sm rounded-full px-8 py-3 transition-colors"
        style={{ background: "var(--color-brand-rose)", color: "var(--color-brand-ivory)", border: "none", display: "inline-block" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-brand-mauve)" }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-brand-rose)" }}
      >
        Start Browsing →
      </Link>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

interface Toast { id: string; name: string }

export function WishlistPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((s) => s.wishlist.items)

  const [toasts, setToasts] = useState<Toast[]>([])
  const [confirmClear, setConfirmClear] = useState(false)

  function dismissToast(id: string) {
    setToasts((p) => p.filter((t) => t.id !== id))
  }

  function pushToast(name: string) {
    const id = `t-${Date.now()}-${Math.random()}`
    setToasts((p) => [...p, { id, name }])
  }

  function handleAddToCart(item: WishlistItem, size: ClothingSize) {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: `৳${item.price.toLocaleString()}`,
      size,
      selectedColor: null,
      imgBg: item.imgBg,
      imgFg: item.imgFg,
      imgText: item.imgText,
    }))
    pushToast(item.name)
  }

  function handleMoveAllToCart() {
    items.forEach((item) => {
      const size = item.sizes[0]
      if (size) {
        dispatch(addToCart({
          id: item.id,
          name: item.name,
          price: `৳${item.price.toLocaleString()}`,
          size,
          selectedColor: null,
          imgBg: item.imgBg,
          imgFg: item.imgFg,
          imgText: item.imgText,
        }))
      }
    })
    pushToast(`${items.length} items`)
  }

  function handleClearWishlist() {
    dispatch(clearWishlist())
    setConfirmClear(false)
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-brand-ivory)" }}
    >
      {/* Page header bar */}
      <div
        style={{
          background: "var(--color-brand-beige)",
          borderBottom: "1px solid var(--color-border-light)",
          paddingTop: "clamp(32px, 5vw, 52px)",
          paddingBottom: "clamp(20px, 3vw, 32px)",
        }}
      >
        <div
          className="max-w-7xl mx-auto flex items-end justify-between gap-4 flex-wrap"
          style={{ padding: "0 clamp(16px, 4vw, 32px)" }}
        >
          <div>
            <h1
              className="font-heading font-light"
              style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", color: "var(--color-brand-charcoal)", lineHeight: 1.15 }}
            >
              My Wishlist
            </h1>
            {items.length > 0 && (
              <p
                className="font-sans mt-1"
                style={{ fontSize: "14px", color: "var(--color-brand-charcoal)", opacity: 0.6 }}
              >
                {items.length} {items.length === 1 ? "piece" : "pieces"} saved
              </p>
            )}
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="font-sans font-semibold text-sm rounded-full px-5 py-2.5 transition-colors"
                style={{
                  background: "transparent",
                  border: "1.5px solid var(--color-brand-charcoal)",
                  color: "var(--color-brand-charcoal)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = "var(--color-brand-charcoal)"
                  el.style.color = "var(--color-brand-ivory)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = "transparent"
                  el.style.color = "var(--color-brand-charcoal)"
                }}
              >
                Move All to Cart
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="font-sans text-sm transition-colors"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--color-brand-charcoal)", opacity: 0.5,
                  textDecoration: "underline", textUnderlineOffset: "3px",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--color-brand-rose)"; (e.currentTarget as HTMLButtonElement).style.opacity = "1" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--color-brand-charcoal)"; (e.currentTarget as HTMLButtonElement).style.opacity = "0.5" }}
              >
                Clear Wishlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div
        className="max-w-7xl mx-auto"
        style={{ padding: "clamp(24px, 4vw, 48px) clamp(16px, 4vw, 32px)" }}
      >
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {items.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={() => dispatch(removeWishlistItem(item.id))}
                onAddToCart={(size) => handleAddToCart(item, size)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast stack */}
      {toasts.map((t) => (
        <CartToast key={t.id} name={t.name} onDismiss={() => dismissToast(t.id)} />
      ))}

      {/* Confirm clear dialog */}
      {confirmClear && (
        <ConfirmDialog
          message="This will remove all saved pieces from your wishlist."
          onConfirm={handleClearWishlist}
          onCancel={() => setConfirmClear(false)}
        />
      )}
    </div>
  )
}
