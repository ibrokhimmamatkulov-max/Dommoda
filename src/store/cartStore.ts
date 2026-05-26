'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

const MAX_QUANTITY = 10

interface CartStore {
  items: CartItem[]
  promoCode: string | null
  promoDiscount: number
  addItem: (product: Product, size: string, color: string) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void
  clearCart: () => void
  getTotalCount: () => number
  getTotalPrice: () => number
  getItemDiscountTotal: () => number
  getDiscountTotal: () => number
  applyPromoCode: (code: string) => Promise<boolean>
  removePromoCode: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoDiscount: 0,

      addItem: (product, size, color) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor === color
          )

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id &&
                item.selectedSize === size &&
                item.selectedColor === color
                  ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
                  : item
              ),
            }
          }

          return {
            items: [
              ...state.items,
              { product, selectedSize: size, selectedColor: color, quantity: 1 },
            ],
          }
        })
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedSize === size &&
                item.selectedColor === color
              )
          ),
        }))
      },

      updateQuantity: (productId, size, color, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, size, color)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
              ? { ...item, quantity: Math.min(qty, MAX_QUANTITY) }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [], promoCode: null, promoDiscount: 0 }),

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      },

      getItemDiscountTotal: () => {
        return get().items.reduce((sum, item) => {
          if (item.product.priceOriginal) {
            return (
              sum +
              (item.product.priceOriginal - item.product.price) * item.quantity
            )
          }
          return sum
        }, 0)
      },

      getDiscountTotal: () => {
        return get().getItemDiscountTotal() + get().promoDiscount
      },

      applyPromoCode: async (code) => {
        const { validatePromoCode } = await import('@/lib/api')
        const result = await validatePromoCode(code)

        if (!result.valid) {
          return false
        }

        const totalPrice = get().getTotalPrice()
        let discountAmount = 0

        if (result.discountPercent) {
          discountAmount = Math.round((totalPrice * result.discountPercent) / 100)
        } else if (result.discountAmount) {
          discountAmount = result.discountAmount
        }

        set({ promoCode: code, promoDiscount: discountAmount })
        return true
      },

      removePromoCode: () => set({ promoCode: null, promoDiscount: 0 }),
    }),
    {
      name: 'dommoda-cart',
    }
  )
)
