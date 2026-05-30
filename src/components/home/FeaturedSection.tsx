'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'
import { getFeaturedProducts } from '@/lib/api'
import type { Product } from '@/types'

export function FeaturedSection() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    setError(null)

    getFeaturedProducts()
      .then((data) => {
        if (mounted) setProducts(data)
      })
      .catch(() => {
        if (mounted) setError('Не удалось загрузить товары. Попробуйте позже.')
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="px-4 pb-8">
      <h2 className="font-headline font-bold uppercase text-primary text-xl mb-6">
        Популярное
      </h2>

      {error != null ? (
        <p className="text-secondary text-sm text-center py-8">{error}</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={() => router.push('/catalog/all')}
          className="w-full border border-primary text-primary py-4 font-medium uppercase tracking-wide text-sm hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary-fixed"
        >
          Показать ещё
        </button>
      </div>
    </section>
  )
}
