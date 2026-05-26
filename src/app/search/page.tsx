'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { ProductCard } from '@/components/product/ProductCard'
import productsData from '@/data/products.json'
import type { Product } from '@/types'

const allProducts = productsData as Product[]

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const lower = query.toLowerCase()
    const filtered = allProducts.filter(
      (p) =>
        p.brand.toLowerCase().includes(lower) ||
        p.name.toLowerCase().includes(lower)
    )
    setResults(filtered)
  }, [query])

  return (
    <>
      {/* Search AppBar */}
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
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[48px] text-outline-variant"
            >
              search
            </span>
            <p className="text-secondary text-sm">
              Введите название товара или бренда
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
            <p className="text-on-surface font-medium">
              По запросу &ldquo;{query}&rdquo; ничего не найдено
            </p>
            <p className="text-secondary text-sm">
              Попробуйте изменить запрос
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-secondary mb-6">
              Найдено {results.length} товаров
            </p>
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
