export interface Product {
  id: string
  brand: string
  name: string
  category: string
  subcategory: string
  price: number
  priceOriginal?: number
  discountPercent?: number
  images: string[]
  sizes: ProductSize[]
  colors: ProductColor[]
  rating: number
  reviewCount: number
  description?: string
  inStock: boolean
}

export interface ProductSize {
  label: string
  available: boolean
}

export interface ProductColor {
  label: string
  hex: string
}

export interface Category {
  id: string
  label: string
  icon: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  label: string
}

export interface CartItem {
  product: Product
  selectedSize: string
  selectedColor: string
  quantity: number
}

export interface Cart {
  items: CartItem[]
  promoCode?: string
  promoDiscount?: number
}

export interface CheckoutFormData {
  deliveryMethod: 'courier' | 'pickup' | 'post'
  city: string
  street: string
  building: string
  apartment?: string
  zip: string
  recipientName: string
  phone: string
  email: string
  comment?: string
}

export interface DeliveryOption {
  id: 'courier' | 'pickup' | 'post'
  label: string
  price: string
  description: string
}

export interface Banner {
  id: string
  imageUrl: string
  alt: string
  badgeText: string
  headline: string
  ctaText: string
  ctaUrl: string
}
