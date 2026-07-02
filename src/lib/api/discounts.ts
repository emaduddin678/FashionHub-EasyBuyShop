import { apiFetch } from "./client"

export interface ApplyCouponResult {
  valid: boolean
  code?: string
  discountAmount?: number
  freeShipping?: boolean
  label?: string
  message?: string
}

// Normalized, persisted shape used by CartPage/CheckoutPage once a coupon is applied.
export interface PromoResult {
  code: string
  discountAmount: number
  freeShipping: boolean
  label: string
}

export async function applyCouponCode(
  code: string,
  cartTotal: number,
): Promise<{ success: boolean; payload: ApplyCouponResult }> {
  return apiFetch("/api/discounts/apply-code", {
    method: "POST",
    body: JSON.stringify({ code, cartTotal }),
  })
}
