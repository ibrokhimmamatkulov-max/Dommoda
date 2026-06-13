'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { CategoryChips } from '@/components/catalog/CategoryChips'
import { FilterSortBar } from '@/components/catalog/FilterSortBar'
import { FilterBottomSheet, type ActiveFilters } from '@/components/catalog/FilterBottomSheet'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'
import { getProducts } from '@/lib/api'
import { analytics } from '@/lib/analytics'
import type { Product } from '@/types'

const DEFAULT_PAGE_LIMIT = 24

const SORT_LABELS: Record<ActiveFilters['sort'], string> = {
  popular: 'Популярные',
  new: 'Новые',
  price_asc: 'Цена ↑',
  price_desc: 'Цена ↓',
}

const ALL_SUBCATEGORIES = [
  { id: 'tshirts',     label: 'Футболки' },
  { id: 'dresses',     label: 'Платья' },
  { id: 'blouses',     label: 'Блузки' },
  { id: 'jeans',       label: 'Джинсы' },
  { id: 'pants',       label: 'Брюки' },
  { id: 'skirts',      label: 'Юбки' },
  { id: 'shorts',      label: 'Шорты' },
  { id: 'shirts',      label: 'Рубашки' },
  { id: 'knitwear',    label: 'Свитеры' },
  { id: 'hoodies',     label: 'Худи' },
  { id: 'blazers',     label: 'Пиджаки' },
  { id: 'jumpsuits',   label: 'Комбинезоны' },
  { id: 'jackets',     label: 'Куртки' },
  { id: 'shoes',       label: 'Обувь' },
  { id: 'accessories', label: 'Аксессуары' },
  { id: 'leggings',    label: 'Леггинсы' },
  { id: 'sport_sets',  label: 'Костюмы' },
]

interface SpecialCatalogPageClientProps {
  title: string
  hasDiscount?: boolean
  brand?: string
  showSubcategoryChips?: boolean
  defaultSort?: ActiveFilters['sort']
  analyticsPath: string
  pageLimit?: number
}

export function SpecialCatalogPageClient({
  title,
  hasDiscount,
  brand,
  showSubcategoryChips = false,
  defaultSort = 'popular',
  analyticsPath,
  pageLimit = DEFAULT_PAGE_LIMIT,
}: SpecialCatalogPageClientProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)
  const [filters, setFilters] = useState<ActiveFilters>({ sort: defaultSort, size: null, minPrice: '', maxPrice: '' })
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pageRef = useRef(1)

  useEffect(() => {
    analytics.visit(analyticsPath)
  }, [analyticsPath])

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
          has_discount: hasDiscount,
          brand,
          subcategory: activeSubcategory ?? undefined,
          sort: filters.sort,
          size: filters.size ?? undefined,
          min_price: filters.minPrice !== '' ? Number(filters.minPrice) : undefined,
          max_price: filters.maxPrice !== '' ? Number(filters.maxPrice) : undefined,
          page: currentPage,
          limit: pageLimit,
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
    [hasDiscount, brand, activeSubcategory, filters, pageLimit]
  )

  useEffect(() => {
    loadProducts(true)
  }, [loadProducts])

  const activeFiltersCount =
    (activeSubcategory != null ? 1 : 0) +
    (filters.sort !== defaultSort ? 1 : 0) +
    (filters.size != null ? 1 : 0) +
    (filters.minPrice !== '' || filters.maxPrice !== '' ? 1 : 0)

  return (
    <>
      <TopAppBar variant="catalog" title={title} />

      <main className="pb-nav">
        {showSubcategoryChips && (
          <CategoryChips
            variant="catalog"
            subcategories={ALL_SUBCATEGORIES}
            activeSubcategory={activeSubcategory}
            onSelect={setActiveSubcategory}
          />
        )}

        <FilterSortBar
          activeFiltersCount={activeFiltersCount}
          sortLabel={SORT_LABELS[filters.sort]}
          total={total}
          shown={products.length}
          onFilterClick={() => setFilterSheetOpen(true)}
        />

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
                  ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                  : products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
              {!isLoading && products.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-secondary">Товары не найдены.</p>
                </div>
              )}
            </>
          )}
        </section>

        {!isLoading && products.length < total && error == null && (
          <section className="flex flex-col items-center py-8 px-4 gap-4">
            <button
              disabled={isLoadingMore}
              onClick={() => loadProducts(false)}
              className="w-full max-w-sm border border-primary text-primary font-headline text-sm font-bold uppercase py-3 px-6 hover:bg-surface-container-low transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              {isLoadingMore ? 'ЗАГРУЖАЕМ...' : 'ПОКАЗАТЬ ЕЩЁ'}
            </button>
          </section>
        )}
      </main>

      <BottomNavBar />

      <FilterBottomSheet
        isOpen={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </>
  )
}
