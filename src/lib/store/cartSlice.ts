import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ClothingSize } from "@/lib/data/products"

export interface CartItem {
  id: number
  name: string
  price: string
  size: ClothingSize
  quantity: number
  selectedColor: { name: string; hex: string } | null
  imgBg: string
  imgFg: string
  imgText: string
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = { items: [] }

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size
      )
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart(state, action: PayloadAction<{ id: number; size: string }>) {
      state.items = state.items.filter(
        (i) => !(i.id === action.payload.id && i.size === action.payload.size)
      )
    },
    incrementQuantity(state, action: PayloadAction<{ id: number; size: string }>) {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size
      )
      if (item) item.quantity += 1
    },
    decrementQuantity(state, action: PayloadAction<{ id: number; size: string }>) {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size
      )
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1
        } else {
          state.items = state.items.filter(
            (i) => !(i.id === action.payload.id && i.size === action.payload.size)
          )
        }
      }
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } =
  cartSlice.actions

export default cartSlice.reducer
