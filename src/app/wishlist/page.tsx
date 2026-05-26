'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { ProductCard } from '@/components/product/ProductCard'
import { useWishlistStore } from '@/store/wishlistStore'
import { getProductById } from '@/lib/api'
import type { Product } from '@/types'

export default function WishlistPage() {
  const router = useRouter()
  const productIds = useWishlistStore((s) => s.productIds)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    Promise.all(productIds.map((id) => getProductById(id)))
      .then((results) => {
        setProducts(results.filter((p): p is Product => p != null))
      })
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false))
  }, [productIds])

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center px-4 h-14 bg-surface-container-lowest border-b border-outline-variant">
        <button
          aria-label="Go back"
          onClick={() => router.back()}
          className="text-primary hover:opacity-80 p-2 -ml-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline font-bold uppercase tracking-tight text-primary flex-1 text-center text-base">
          ИЗБРАННОЕ
        </h1>
        <div className="w-10" />
      </header>

      <main className="px-4 py-6 pb-24">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[64px] text-outline-variant"
            >
              favorite_border
            </span>
            <p className="text-secondary text-sm max-w-xs">
              Ещё нет избранных товаров. Нажмите ♡ на карточке товара, чтобы добавить.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <BottomNavBar />
    </>
  )
}
