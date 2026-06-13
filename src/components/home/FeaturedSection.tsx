'use client'

import { useEffect, useState, useRef } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'
import type { Product } from '@/types'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'
const PAGE_SIZE = 12

async function fetchFeatured(offset: number): Promise<Product[]> {
  const res = await fetch(`${BACKEND}/api/products/featured?limit=${PAGE_SIZE}&offset=${offset}`)
  if (!res.ok) throw new Error('Failed')
  return res.json() as Promise<Product[]>
}

export function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const offsetRef = useRef(0)

  useEffect(() => {
    fetchFeatured(0)
      .then((data) => {
        setProducts(data)
        offsetRef.current = data.length
        setHasMore(data.length === PAGE_SIZE)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const loadMore = async () => {
    setIsLoadingMore(true)
    try {
      const data = await fetchFeatured(offsetRef.current)
      setProducts((prev) => [...prev, ...data])
      offsetRef.current += data.length
      setHasMore(data.length === PAGE_SIZE)
    } catch {}
    finally { setIsLoadingMore(false) }
  }

  return (
    <section className="px-4 pb-8">
      <h2 className="font-headline font-bold uppercase text-primary text-xl mb-6">
        Новинки
      </h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      {!isLoading && hasMore && (
        <div className="mt-8">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="w-full border border-primary text-primary py-4 font-medium uppercase tracking-wide text-sm hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary-fixed disabled:opacity-50"
          >
            {isLoadingMore ? 'ЗАГРУЖАЕМ...' : 'ПОКАЗАТЬ ЕЩЁ'}
          </button>
        </div>
      )}
    </section>
  )
}
