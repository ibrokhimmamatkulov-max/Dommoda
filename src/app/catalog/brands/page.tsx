'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { getBrands } from '@/lib/api'

export default function BrandsPage() {
  const [brands, setBrands] = useState<{ name: string; count: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getBrands()
      .then(setBrands)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <TopAppBar variant="catalog" title="БРЕНДЫ" />

      <main className="pb-nav pt-2">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 p-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-16 bg-surface-container rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-secondary px-4 py-3">
              {brands.length} брендов
            </p>
            <div className="grid grid-cols-2 gap-3 px-4">
              {brands.map((b) => (
                <Link
                  key={b.name}
                  href={`/catalog/brands/${encodeURIComponent(b.name)}`}
                  className="flex flex-col justify-between p-4 border border-outline-variant rounded hover:border-primary hover:bg-surface-container-low transition-colors active:scale-95"
                >
                  <span className="font-headline font-bold text-sm text-primary uppercase leading-tight">
                    {b.name}
                  </span>
                  <span className="text-xs text-secondary mt-2">
                    {b.count} {b.count === 1 ? 'товар' : b.count < 5 ? 'товара' : 'товаров'}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNavBar />
    </>
  )
}
