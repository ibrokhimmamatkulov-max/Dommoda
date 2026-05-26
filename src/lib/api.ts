import type { Product } from '@/types'
import productsData from '@/data/products.json'

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function getProducts(params?: {
  category?: string
  subcategory?: string
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'new'
  page?: number
  limit?: number
}): Promise<{ products: Product[]; total: number }> {
  await delay(300)

  let filtered = productsData as Product[]

  if (params?.category) {
    filtered = filtered.filter((p) => p.category === params.category)
  }

  if (params?.subcategory) {
    filtered = filtered.filter((p) => p.subcategory === params.subcategory)
  }

  if (params?.sort) {
    switch (params.sort) {
      case 'price_asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case 'new':
        filtered = [...filtered].reverse()
        break
      case 'popular':
      default:
        filtered = [...filtered].sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }
  }

  const total = filtered.length
  const page = params?.page ?? 1
  const limit = params?.limit ?? 24
  const start = (page - 1) * limit
  const paginated = filtered.slice(start, start + limit)

  return { products: paginated, total }
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay(300)
  const found = (productsData as Product[]).find((p) => p.id === id)
  return found ?? null
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await delay(300)
  const sorted = [...(productsData as Product[])].sort(
    (a, b) => b.reviewCount - a.reviewCount
  )
  return sorted.slice(0, 4)
}

export async function validatePromoCode(code: string): Promise<{
  valid: boolean
  discountAmount?: number
  discountPercent?: number
}> {
  await delay(300)

  if (code === 'DOMMODA10') {
    return { valid: true, discountPercent: 10 }
  }

  if (code === 'FIRST500') {
    return { valid: true, discountAmount: 500 }
  }

  return { valid: false }
}
