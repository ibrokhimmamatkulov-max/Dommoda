'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  productIds: string[]
  toggle: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggle: (productId) => {
        set((state) => {
          const isIn = state.productIds.includes(productId)
          return {
            productIds: isIn
              ? state.productIds.filter((id) => id !== productId)
              : [...state.productIds, productId],
          }
        })
      },

      isInWishlist: (productId) => {
        return get().productIds.includes(productId)
      },
    }),
    {
      name: 'dommoda-wishlist',
    }
  )
)
