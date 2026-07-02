import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { ClothingSize } from "@/lib/data/products"
import wishlistApi from "@/lib/api/wishlist"
import type { RootState } from "./index"

export interface WishlistItem {
  id: string | number
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

export const syncWishlistFromServer = createAsyncThunk(
  "wishlist/syncFromServer",
  async (_, { rejectWithValue }) => {
    try {
      const items = await wishlistApi.getWishlist()
      return items
        .filter((i) => i.productId && i.productId._id)
        .map((i) => {
          const p = i.productId
          return {
            id: p._id,
            name: p.title,
            brand: "",
            category: "",
            price: p.sellingPrice,
            originalPrice: p.regularPrice ?? p.sellingPrice,
            image: p.primaryImage ?? "",
            sizes: [],
            unavailableSizes: [],
            rating: 0,
            reviewCount: 0,
            badge: null,
            addedAt: i.addedAt,
            imgBg: "F5EFE6",
            imgFg: "2D2D2D",
            imgText: p.title.split(" ")[0] ?? "",
          } satisfies WishlistItem
        })
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

// Only real backend products (Mongo ObjectIds) can be persisted server-side —
// mock demo products used in a few "you may also like" rails are frontend-only.
const isServerProductId = (id: string | number) => /^[0-9a-fA-F]{24}$/.test(String(id))

// Toggling a wishlist item only ever touched local Redux state — nothing pushed
// the change to the backend, so a logged-in user's additions/removals were
// silently wiped the next time syncWishlistFromServer ran (e.g. on next login).
// These thunks keep the same optimistic local update but also persist it.
export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggleItem",
  async (item: WishlistItem, { dispatch, getState }) => {
    const state = getState() as RootState
    const wasWishlisted = state.wishlist.items.some((i) => String(i.id) === String(item.id))
    dispatch(toggleWishlist(item))

    if (!state.auth.user || !isServerProductId(item.id)) return

    try {
      if (wasWishlisted) await wishlistApi.removeItem(String(item.id))
      else await wishlistApi.addItem(String(item.id))
    } catch {
      dispatch(toggleWishlist(item)) // revert the optimistic update
    }
  },
)

export const removeWishlistItem = createAsyncThunk(
  "wishlist/removeItemAndPersist",
  async (id: string | number, { dispatch, getState }) => {
    const state = getState() as RootState
    dispatch(removeFromWishlist({ id }))

    if (!state.auth.user || !isServerProductId(id)) return

    try {
      await wishlistApi.removeItem(String(id))
    } catch {
      // best-effort — local removal stands, next login sync will reconcile
    }
  },
)

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.some((i) => String(i.id) === String(action.payload.id))
      if (!exists) {
        state.items.push({ ...action.payload, addedAt: action.payload.addedAt || new Date().toISOString() })
      }
    },
    removeFromWishlist(state, action: PayloadAction<{ id: string | number }>) {
      state.items = state.items.filter((i) => String(i.id) !== String(action.payload.id))
    },
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const idx = state.items.findIndex((i) => String(i.id) === String(action.payload.id))
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
  extraReducers: (builder) => {
    builder.addCase(syncWishlistFromServer.fulfilled, (state, action) => {
      state.items = action.payload
    })
  },
})

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
  wishlistSlice.actions

export default wishlistSlice.reducer
