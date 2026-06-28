"use client"

import { useState, useMemo } from "react"
import { useAppDispatch } from "@/lib/store/hooks"
import { removeFromWishlist, type WishlistItem } from "@/lib/store/wishlistSlice"
import { addToCart } from "@/lib/store/cartSlice"
import { WishlistItemCard } from "./WishlistItem"
import type { ClothingSize } from "@/lib/data/products"

type SortOption = "recently-added" | "price-asc" | "price-desc" | "name"

interface Props {
  items: WishlistItem[]
  onToast: (msg: string, undoFn?: () => void) => void
  onAddedToCart: (name: string) => void
}

export function WishlistGrid({ items, onToast, onAddedToCart }: Props) {
  const dispatch = useAppDispatch()
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>("recently-added")

  const allSelected = items.length > 0 && items.every((i) => selectedIds.has(i.id))

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)))
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleBulkAddToCart() {
    const selected = items.filter((i) => selectedIds.has(i.id))
    selected.forEach((item) => {
      const firstSize: ClothingSize | undefined =
        item.sizes?.find((s) => !item.unavailableSizes?.includes(s)) ?? item.sizes[0]
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
    onToast(`✓ ${selected.length} item${selected.length > 1 ? "s" : ""} added to cart!`)
    setSelectedIds(new Set())
  }

  function handleBulkRemove() {
    const idsToRemove = [...selectedIds]
    const removedItems = items.filter((i) => idsToRemove.includes(i.id))
    idsToRemove.forEach((id) => dispatch(removeFromWishlist({ id })))
    onToast(
      `Removed ${idsToRemove.length} item${idsToRemove.length > 1 ? "s" : ""}`,
      () => {
        removedItems.forEach((item) =>
          dispatch({ type: "wishlist/addToWishlist", payload: item }),
        )
      },
    )
    setSelectedIds(new Set())
  }

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    })
  }, [items, sortBy])

  const numSelected = selectedIds.size

  return (
    <div>
      {/* Toolbar row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* Left: Select All */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-[18px] h-[18px] rounded accent-[#1A2B5E] cursor-pointer"
          />
          <span className="text-sm font-medium text-[#1A2B5E]">
            Select All ({items.length})
          </span>
        </label>

        {/* Right: Bulk actions */}
        {numSelected > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleBulkAddToCart}
              className="bg-[#1A2B5E] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#152249] transition-colors"
            >
              Add Selected to Cart ({numSelected})
            </button>
            <button
              onClick={handleBulkRemove}
              className="border border-red-400 text-red-500 text-sm px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Remove Selected
            </button>
          </div>
        )}
      </div>

      {/* Sort row */}
      <div className="flex justify-end items-center gap-2 mb-6">
        <span className="text-sm text-gray-500">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#1A2B5E] bg-white text-gray-700 cursor-pointer"
        >
          <option value="recently-added">Recently Added</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sortedItems.map((item, idx) => (
          <div
            key={item.id}
            className={
              sortedItems.length % 2 !== 0 && idx === sortedItems.length - 1
                ? "sm:max-w-[calc(50%-10px)]"
                : undefined
            }
          >
            <WishlistItemCard
              item={item}
              isSelected={selectedIds.has(item.id)}
              onToggleSelect={toggleSelect}
              showCheckbox={numSelected > 0}
              onToast={onToast}
              onAddedToCart={onAddedToCart}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
