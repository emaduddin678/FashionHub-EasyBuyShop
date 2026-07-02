import { apiFetch } from "./client"

export interface BackendBrand {
  _id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  active: boolean
  productCount?: number
}

interface BrandListResponse {
  brands: BackendBrand[]
  total: number
  pages: number
}

interface BrandSingleResponse {
  success: boolean
  data: BackendBrand
}

/** Active brands (brands are shared across every store — no storeSlug filter). */
export async function fetchBrands(limit = 100): Promise<BackendBrand[]> {
  const data = await apiFetch<BrandListResponse>("/api/admin/brands", {
    query: { active: true, limit },
  })
  return data.brands
}

export async function fetchBrandBySlug(slug: string): Promise<BackendBrand | null> {
  try {
    const data = await apiFetch<BrandSingleResponse>(`/api/admin/brands/${slug}`)
    return data.data
  } catch {
    return null
  }
}
