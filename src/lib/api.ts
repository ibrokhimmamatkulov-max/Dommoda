import type { Product } from '@/types'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

export async function getProducts(params?: {
  category?: string
  subcategory?: string
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'new'
  has_discount?: boolean
  page?: number
  limit?: number
}): Promise<{ products: Product[]; total: number }> {
  const qs = new URLSearchParams()
  if (params?.category) qs.set('category', params.category)
  if (params?.subcategory) qs.set('subcategory', params.subcategory)
  if (params?.sort) qs.set('sort', params.sort)
  if (params?.has_discount) qs.set('has_discount', 'true')
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))

  const res = await fetch(`${BACKEND}/api/products?${qs}`)
  if (!res.ok) throw new Error('Failed to fetch products')
  const data = await res.json() as { products: Product[]; total: number }
  return { products: data.products, total: data.total }
}

export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${BACKEND}/api/products/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json() as Promise<Product>
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(`${BACKEND}/api/products/featured`)
  if (!res.ok) throw new Error('Failed to fetch featured products')
  return res.json() as Promise<Product[]>
}

export async function validatePromoCode(code: string): Promise<{
  valid: boolean
  discountAmount?: number
  discountPercent?: number
}> {
  if (code === 'DOMMODA10') {
    return { valid: true, discountPercent: 10 }
  }
  if (code === 'FIRST500') {
    return { valid: true, discountAmount: 500 }
  }
  return { valid: false }
}
