export type ProductCategory = 'women' | 'men' | 'kids' | 'sport'

export const PRODUCT_CATEGORIES: Record<ProductCategory, string> = {
  women: 'Женщинам',
  men: 'Мужчинам',
  kids: 'Детям',
  sport: 'Спорт',
}

export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type ProductSizeLabel = (typeof PRODUCT_SIZES)[number]

export interface AdminProduct {
  id: string
  name: string
  brand: string
  category: ProductCategory
  subcategory: string
  price: number
  price_original: number | null
  description: string
  sizes: ProductSizeLabel[]
  in_stock: boolean
  images: string[]
}

export interface AdminProductFormData {
  name: string
  brand: string
  category: ProductCategory
  subcategory: string
  price: number
  price_original: number | null
  description: string
  sizes: ProductSizeLabel[]
  in_stock: boolean
  images: string[]
}

export interface AdminLoginRequest {
  username: string
  password: string
}

export interface AdminLoginResponse {
  token: string
}

export interface AdminProductsResponse {
  products: AdminProduct[]
  total: number
}
