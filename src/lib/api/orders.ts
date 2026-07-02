import { apiFetch } from "./client"

export interface OrderItemPayload {
  productId?: string
  productName: string
  sku?: string
  variant?: { color?: string; size?: string }
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface CreateOrderPayload {
  customer: {
    name: string
    email?: string
    phone: string
    shippingAddress: {
      street: string
      city: string
      state: string
      zip?: string
      country: string
    }
  }
  items: OrderItemPayload[]
  pricing: {
    subtotal: number
    discountAmount?: number
    couponCode?: string
    shippingCost: number
    total: number
  }
  payment: {
    method: "cash_on_delivery" | "bkash" | "nagad" | "rocket" | "card"
  }
  source?: string
  storeId?: string
}

export interface CreatedOrder {
  _id: string
  orderId: string
  status: string
  createdAt: string
}

export interface MyOrder {
  _id: string
  orderId: string
  status: string
  items: { productName: string; quantity: number; unitPrice: number; totalPrice: number; variant?: { size?: string; color?: string } }[]
  pricing: { subtotal: number; discountAmount: number; shippingCost: number; total: number }
  payment: { method: string; status: string }
  shipping: { courier?: string; trackingNumber?: string; estimatedDelivery?: string }
  createdAt: string
}

export interface TrackOrderResult {
  orderId: string
  status: string
  timeline: { action: string; note?: string; at: string }[]
  shipping: {
    courier?: string
    trackingNumber?: string
    estimatedDelivery?: string
    shippedAt?: string
    deliveredAt?: string
  }
  items: { productName: string; sku?: string; variant?: { color?: string; size?: string }; quantity: number }[]
  createdAt: string
}

export async function createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; message: string; payload: CreatedOrder }> {
  return apiFetch("/api/orders", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
  })
}

export async function getMyOrders(page = 1, limit = 20): Promise<{ success: boolean; payload: { orders: MyOrder[]; total: number; page: number; pages: number } }> {
  return apiFetch("/api/orders/my", {
    credentials: "include",
    query: { page, limit },
  })
}

export async function trackOrder(orderId: string): Promise<{ success: boolean; payload: TrackOrderResult }> {
  return apiFetch(`/api/orders/track/${orderId.toUpperCase()}`)
}
