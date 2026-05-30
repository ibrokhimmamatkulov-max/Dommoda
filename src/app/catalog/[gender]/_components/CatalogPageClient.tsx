'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { CategoryChips } from '@/components/catalog/CategoryChips'
import { FilterSortBar } from '@/components/catalog/FilterSortBar'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'
import { getProducts } from '@/lib/api'
import { analytics } from '@/lib/analytics'
import categoriesData from '@/data/categories.json'
import type { Product, Category } from '@/types'

const categories = categoriesData as Category[]

const PAGE_LIMIT = 24

const CATEGORY_TITLES: Record<string, string> = {
  women: 'ЖЕНЩИНАМ',
  men: 'МУЖЧИНАМ',
  kids: 'ДЕТЯМ',
  sport: 'СПОРТ',
}

interface CatalogPageClientProps {
  gender: string
}

export function CatalogPageClient({ gender }: CatalogPageClientProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use a ref so loadProducts always reads the current page without being
  // recreated on every page increment — eliminates the stale-closure race condition
  // where rapid "load more" clicks would fire duplicate requests for the same page.
  const pageRef = useRef(1)

  useEffect(() => {
    analytics.visit(`/catalog/${gender}`)
  }, [gender])

  const categoryData = categories.find((c) => c.id === gender)
  const title = CATEGORY_TITLES[gender] ?? gender.toUpperCase()

  const loadProducts = useCallback(
    async (reset: boolean) => {
      const currentPage = reset ? 1 : pageRef.current
      if (reset) {
        setIsLoading(true)
        setProducts([])
        pageRef.current = 1
      } else {
        setIsLoadingMore(true)
      }
      setError(null)

      try {
        const result = await getProducts({
          category: gender,
          subcategory: activeSubcategory ?? undefined,
          page: currentPage,
          limit: PAGE_LIMIT,
        })

        if (reset) {
          setProducts(result.products)
          pageRef.current = 2
        } else {
          setProducts((prev) => [...prev, ...result.products])
          pageRef.current = currentPage + 1
        }
        setTotal(result.total)
      } catch {
        setError('Ошибка загрузки. Попробуйте ещё раз.')
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [gender, activeSubcategory]
  )

  // Reset and reload when gender or subcategory changes
  useEffect(() => {
    loadProducts(true)
  }, [loadProducts])

  const handleSubcategorySelect = (id: string | null) => {
    setActiveSubcategory(id)
  }

  const handleLoadMore = () => {
    loadProducts(false)
  }

  const hasMore = products.length < total

  return (
    <>
      <TopAppBar variant="catalog" title={title} />

      <main className="pb-20">
        {/* Category chips */}
        {categoryData != null && (
          <CategoryChips
            variant="catalog"
            subcategories={categoryData.subcategories}
            activeSubcategory={activeSubcategory}
            onSelect={handleSubcategorySelect}
          />
        )}

        {/* Filter/sort bar */}
        <FilterSortBar
          activeFiltersCount={activeSubcategory != null ? 1 : 0}
          sortLabel="Популярные"
          total={total}
          shown={products.length}
        />

        {/* Product grid */}
        <section className="p-4">
          {error != null ? (
            <div className="text-center py-16">
              <p className="text-secondary">{error}</p>
              <button
                onClick={() => loadProducts(true)}
                className="mt-4 px-6 py-2 border border-primary text-primary text-sm font-medium hover:bg-surface-container-low transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))
                  : products.length === 0
                  ? null
                  : products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
              </div>

              {!isLoading && products.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-secondary">
                    Товары не найдены. Попробуйте другие фильтры.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Pagination */}
        {!isLoading && hasMore && error == null && (
          <section className="flex flex-col items-center py-8 px-4 gap-4">
            <button
              disabled={isLoadingMore}
              onClick={handleLoadMore}
              className="w-full max-w-sm border border-primary text-primary font-headline text-sm font-bold uppercase py-3 px-6 hover:bg-surface-container-low transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              {isLoadingMore ? 'ЗАГРУЖАЕМ...' : 'ПОКАЗАТЬ ЕЩЁ'}
            </button>
          </section>
        )}
      </main>

      <BottomNavBar />
    </>
  )
}
