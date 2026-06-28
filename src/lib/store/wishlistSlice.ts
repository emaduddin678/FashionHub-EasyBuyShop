import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ClothingSize } from "@/lib/data/products"

export interface WishlistItem {
  id: number
  name: string
  brand: string
  category: string
  price: number
  originalPrice: number
  image: string
  sizes: ClothingSize[]
  unavailableSizes: ClothingSize[]
  rating: number
  reviewCount: number
  badge: string | null
  addedAt: string
  // Legacy fields kept for backward compat with ProductCard
  imgBg: string
  imgFg: string
  imgText: string
}

interface WishlistState {
  items: WishlistItem[]
}

const initialState: WishlistState = { items: [] }

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.some((i) => i.id === action.payload.id)
      if (!exists) {
        state.items.push({ ...action.payload, addedAt: action.payload.addedAt || new Date().toISOString() })
      }
    },
    removeFromWishlist(state, action: PayloadAction<{ id: number }>) {
      state.items = state.items.filter((i) => i.id !== action.payload.id)
    },
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id)
      if (idx >= 0) {
        state.items.splice(idx, 1)
      } else {
        state.items.push({ ...action.payload, addedAt: action.payload.addedAt || new Date().toISOString() })
      }
    },
    clearWishlist(state) {
      state.items = []
    },
  },
})

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
  wishlistSlice.actions

export default wishlistSlice.reducer
