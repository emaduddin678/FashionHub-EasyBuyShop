const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002"

export interface ServerWishlistItem {
  productId: {
    _id: string
    title: string
    slug: string
    sellingPrice: number
    regularPrice: number
    primaryImage: string
    status: string
  }
  addedAt: string
}

const wishlistApi = {
  async getWishlist(): Promise<ServerWishlistItem[]> {
    const res = await fetch(`${BASE_URL}/api/wishlist`, {
      credentials: "include",
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? "Failed to fetch wishlist")
    return (data.payload.items ?? []) as ServerWishlistItem[]
  },

  async addItem(productId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error((data as { message?: string }).message ?? "Failed to add to wishlist")
    }
  },

  async removeItem(productId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/wishlist/${productId}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error((data as { message?: string }).message ?? "Failed to remove from wishlist")
    }
  },
}

export default wishlistApi
