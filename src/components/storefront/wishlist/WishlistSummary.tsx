"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAppDispatch } from "@/lib/store/hooks"
import { addToCart } from "@/lib/store/cartSlice"
import { type WishlistItem } from "@/lib/store/wishlistSlice"

interface RecentlyViewedItem {
  id: number
  name: string
  imgBg: string
  imgFg: string
  imgText: string
}

interface Props {
  items: WishlistItem[]
  onToast: (msg: string, undoFn?: () => void) => void
}

export function WishlistSummary({ items, onToast }: Props) {
  const dispatch = useAppDispatch()
  const [copied, setCopied] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed")
      if (stored) {
        setRecentlyViewed(JSON.parse(stored).slice(0, 3))
      }
    } catch {
      // ignore
    }
  }, [])

  const totalValue = items.reduce((sum, i) => sum + i.price, 0)
  const totalSavings = items.reduce(
    (sum, i) => sum + (i.originalPrice > i.price ? i.originalPrice - i.price : 0),
    0,
  )
  const onSaleCount = items.filter((i) => i.originalPrice > i.price).length

  function handleAddAllToCart() {
    if (items.length === 0) return
    items.forEach((item) => {
      const firstSize = item.sizes?.find((s) => !item.unavailableSizes?.includes(s)) ?? item.sizes[0]
      if (!firstSize) return
      dispatch(
        addToCart({
          id: item.id,
          name: item.name,
          price: `৳${item.price.toLocaleString()}`,
          size: firstSize,
          selectedColor: null,
          imgBg: item.imgBg,
          imgFg: item.imgFg,
          imgText: item.imgText,
        }),
      )
    })
    onToast(`✓ ${items.length} item${items.length > 1 ? "s" : ""} added to cart!`)
  }

  function handleCopyLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true)
        onToast("🔗 Wishlist link copied!")
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  const wishlistUrl = typeof window !== "undefined" ? window.location.href : ""
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent("Check out my wishlist: " + wishlistUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(wishlistUrl)}`

  return (
    <div className="sticky top-24 space-y-4">
      {/* Main summary card */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-semibold text-lg text-[#1A2B5E] pb-3 mb-4 border-b">
          Wishlist Summary
        </h2>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[#1A2B5E]">{items.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Items Saved</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="font-bold text-[#1A2B5E] text-lg">৳{totalValue.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Value</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="font-bold text-[#D4A017] text-lg">{onSaleCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">On Sale</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="font-bold text-green-600 text-lg">৳{totalSavings.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-0.5">You Save</p>
          </div>
        </div>

        {/* Add all to cart */}
        <button
          onClick={handleAddAllToCart}
          disabled={items.length === 0}
          className="w-full bg-[#D4A017] text-[#1A2B5E] font-bold py-3.5 rounded-xl mt-2 hover:bg-amber-500 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          🛒 Add All to Cart
        </button>
      </div>

      {/* Share wishlist */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-medium text-[#1A2B5E]">Share Your Wishlist</p>
          <p className="text-xs text-gray-400 mt-1">
            Let friends and family know what you&apos;d love
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center bg-white border rounded-lg py-2 text-xs text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors gap-1"
            >
              <span>📘</span>
              <span>Facebook</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center bg-white border rounded-lg py-2 text-xs text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors gap-1"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center bg-white border rounded-lg py-2 text-xs text-gray-600 hover:border-[#1A2B5E] hover:text-[#1A2B5E] transition-colors gap-1"
            >
              <span>{copied ? "✓" : "🔗"}</span>
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="border-t pt-0">
            <p className="text-sm font-medium text-[#1A2B5E] mb-3">Items You Viewed</p>
            <div className="flex gap-2">
              {recentlyViewed.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  title={product.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://placehold.co/48x48/${product.imgBg}/${product.imgFg}?text=${encodeURIComponent(product.imgText.slice(0, 3))}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
