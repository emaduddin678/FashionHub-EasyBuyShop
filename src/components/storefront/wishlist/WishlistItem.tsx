"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, X } from "lucide-react"
import { useAppDispatch } from "@/lib/store/hooks"
import { removeFromWishlist, type WishlistItem as WishlistItemType } from "@/lib/store/wishlistSlice"
import { addToCart } from "@/lib/store/cartSlice"
import type { ClothingSize } from "@/lib/data/products"

interface Props {
  item: WishlistItemType
  isSelected: boolean
  onToggleSelect: (id: number) => void
  showCheckbox: boolean
  onToast: (msg: string, undoFn?: () => void) => void
  onAddedToCart: (name: string) => void
}

function starStr(rating: number) {
  const r = Math.round(rating)
  return "★".repeat(r) + "☆".repeat(5 - r)
}

function calcDiscount(price: number, original: number) {
  if (!original || original <= price) return null
  return Math.round(((original - price) / original) * 100)
}

export function WishlistItemCard({
  item,
  isSelected,
  onToggleSelect,
  showCheckbox,
  onToast,
  onAddedToCart,
}: Props) {
  const dispatch = useAppDispatch()
  const [selectedSize, setSelectedSize] = useState<ClothingSize | null>(null)
  const [sizeError, setSizeError] = useState(false)
  const [removed, setRemoved] = useState(false)

  const discountPct = calcDiscount(item.price, item.originalPrice)
  const allSizes = item.sizes ?? []
  const unavailableSizes = item.unavailableSizes ?? []
  const isOutOfStock = allSizes.length > 0 && allSizes.every((s) => unavailableSizes.includes(s))

  function handleRemove() {
    setRemoved(true)
    dispatch(removeFromWishlist({ id: item.id }))
    onToast(`Removed from wishlist`, () => {
      setRemoved(false)
      dispatch({
        type: "wishlist/addToWishlist",
        payload: item,
      })
    })
  }

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 2000)
      return
    }
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: `৳${item.price.toLocaleString()}`,
        size: selectedSize,
        selectedColor: null,
        imgBg: item.imgBg,
        imgFg: item.imgFg,
        imgText: item.imgText,
      }),
    )
    onAddedToCart(item.name)
  }

  if (removed) return null

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200">
      {/* Checkbox */}
      <div
        className={`absolute top-3 left-3 z-20 transition-opacity duration-150 ${
          showCheckbox || isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(item.id)}
          className="w-[18px] h-[18px] rounded accent-[#1A2B5E] cursor-pointer"
          aria-label={`Select ${item.name}`}
        />
      </div>

      {/* Image area */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://placehold.co/300x220/F5EFE6/2D2D2D?text=👗"
          alt={item.name}
          className="w-full h-full object-contain"
        />

        {/* Badge */}
        {item.badge && (
          <span className="absolute top-3 left-8 bg-[#D4A017] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide z-10">
            {item.badge}
          </span>
        )}

        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10"
          aria-label="Remove from wishlist"
        >
          <X size={14} />
        </button>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4">
        <p className="text-[10px] uppercase font-medium text-[#D4A017] tracking-wider">
          {item.brand}
        </p>
        <Link
          href={`/product/${item.id}`}
          className="text-sm font-semibold text-[#1A2B5E] mt-1 block hover:underline leading-snug"
        >
          {item.name}
        </Link>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-[#1A2B5E]">৳{item.price.toLocaleString()}</span>
          {item.originalPrice > item.price && (
            <span className="text-gray-400 text-sm line-through">
              ৳{item.originalPrice.toLocaleString()}
            </span>
          )}
          {discountPct && (
            <span className="text-xs font-semibold text-[#D4A017]">{discountPct}% OFF</span>
          )}
        </div>

        {/* Rating row */}
        {item.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-amber-400 text-xs tracking-widest">{starStr(item.rating)}</span>
            <span className="text-xs text-gray-500">
              {item.rating.toFixed(1)} ({item.reviewCount})
            </span>
          </div>
        )}

        {/* Size selector */}
        {allSizes.length > 0 && (
          <div className="mt-3">
            <p className={`text-xs mb-1.5 ${sizeError ? "text-red-500 font-medium" : "text-gray-400"}`}>
              {sizeError ? "Please select a size" : "Select Size"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allSizes.map((sz) => {
                const unavail = unavailableSizes.includes(sz)
                return (
                  <button
                    key={sz}
                    disabled={unavail}
                    onClick={() => {
                      if (!unavail) {
                        setSelectedSize(sz)
                        setSizeError(false)
                      }
                    }}
                    className={`px-2 py-1 text-xs rounded border transition-all ${
                      unavail
                        ? "bg-gray-100 text-gray-300 line-through cursor-not-allowed border-gray-100"
                        : selectedSize === sz
                        ? "bg-[#1A2B5E] text-white border-[#1A2B5E]"
                        : sizeError
                        ? "bg-white text-gray-600 border-red-400"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#1A2B5E]"
                    }`}
                  >
                    {sz}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-1.5 bg-[#1A2B5E] text-white text-sm py-2.5 rounded-lg hover:bg-[#152249] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
          <Link
            href={`/product/${item.id}`}
            className="flex items-center justify-center bg-white border border-[#1A2B5E] text-[#1A2B5E] text-sm py-2.5 rounded-lg hover:bg-[#1A2B5E] hover:text-white transition-colors text-center"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  )
}
