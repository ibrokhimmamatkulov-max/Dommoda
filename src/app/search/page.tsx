'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/types'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${BACKEND}/api/products?search=${encodeURIComponent(query.trim())}&limit=50`
        )
        if (!res.ok) throw new Error()
        const data = await res.json() as { products: Product[] }
        setResults(data.products)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }, [query])

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center px-4 h-14 bg-surface-container-lowest border-b border-outline-variant gap-3">
        <button
          aria-label="Go back"
          onClick={() => router.back()}
          className="text-primary hover:opacity-80 p-2 -ml-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по брендам и названиям..."
          aria-label="Поиск товаров"
          className="flex-1 bg-transparent border-none outline-none text-base text-on-surface placeholder:text-outline"
        />
        {query.length > 0 && (
          <button
            aria-label="Clear search"
            onClick={() => setQuery('')}
            className="text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </header>

      <main className="px-4 py-6 pb-24">
        {query.trim().length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">search</span>
            <p className="text-secondary text-sm">Введите название товара или бренда</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-24">
            <span className="material-symbols-outlined text-[32px] text-outline-variant animate-spin">progress_activity</span>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
            <p className="text-on-surface font-medium">По запросу &ldquo;{query}&rdquo; ничего не найдено</p>
            <p className="text-secondary text-sm">Попробуйте изменить запрос</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-secondary mb-6">Найдено {results.length} товаров</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNavBar />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}
