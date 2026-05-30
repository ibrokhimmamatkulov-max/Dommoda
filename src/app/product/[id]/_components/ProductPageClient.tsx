'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { ProductImageCarousel } from '@/components/product/ProductImageCarousel'
import { SizeSelector } from '@/components/product/SizeSelector'
import { getProductById } from '@/lib/api'
import { analytics } from '@/lib/analytics'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { usePrice } from '@/lib/usePrice'
import type { Product } from '@/types'

interface ProductPageClientProps {
  id: string
}

function StarRating({ rating }: { rating: number }) {
  const filled = Math.floor(rating)
  return (
    <div className="flex text-on-surface text-sm" aria-label={`Рейтинг ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < filled ? 'text-on-surface' : 'text-outline-variant'}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export function ProductPageClient({ id }: ProductPageClientProps) {
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [sizeError, setSizeError] = useState(false)
  const [descriptionOpen, setDescriptionOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const sizeRef = useRef<HTMLDivElement>(null)
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const addItem = useCartStore((s) => s.addItem)
  const isInWishlist = useWishlistStore((s) => (product ? s.isInWishlist(product.id) : false))
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const fmt = usePrice()

  useEffect(() => {
    setIsLoading(true)
    getProductById(id)
      .then((data) => {
        if (data == null) {
          setNotFound(true)
          return
        }
        setProduct(data)
        analytics.productView(`/product/${id}`, data.name, data.brand)
        // Pre-select first available size
        const firstAvailable = data.sizes.find((s) => s.available)
        if (firstAvailable) setSelectedSize(firstAvailable.label)
        // Pre-select first color
        if (data.colors.length > 0) setSelectedColor(data.colors[0].hex)
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current)
    }
  }, [])

  const handleAddToCart = () => {
    if (selectedSize == null) {
      setSizeError(true)
      sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    if (product == null) return

    setSizeError(false)
    addItem(product, selectedSize, selectedColor)
    analytics.addToCart(product.name, product.brand)

    setShowToast(true)
    toastTimeout.current = setTimeout(() => setShowToast(false), 2000)
  }

  const handleWishlist = () => {
    if (product == null) return
    toggleWishlist(product.id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || product == null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-secondary text-center">Товар не найден</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-primary text-primary text-sm font-medium"
        >
          Назад
        </button>
      </div>
    )
  }

  return (
    <>
      <TopAppBar variant="product" productId={product.id} />

      <main className="bg-background pb-32 pt-14">
        {/* Image carousel */}
        <ProductImageCarousel
          images={product.images}
          productName={`${product.brand} ${product.name}`}
        />

        {/* Product info */}
        <section className="px-4 mt-6">
          <p className="font-label text-sm uppercase text-outline tracking-wider mb-1">
            {product.brand}
          </p>
          <h2 className="font-headline text-2xl font-bold leading-tight mb-2">
            {product.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={product.rating} />
            <span className="font-body text-sm font-medium">{product.rating}</span>
            <span className="font-body text-sm text-outline ml-1">
              {product.reviewCount} отзывов
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6">
            <span className="font-headline text-3xl font-bold text-primary tracking-tight">
              {fmt(product.price)}
            </span>
            {product.priceOriginal != null && (
              <>
                <span className="font-body text-lg text-outline line-through mb-1">
                  {fmt(product.priceOriginal)}
                </span>
                {product.discountPercent != null && (
                  <span className="bg-error text-on-error text-xs font-bold px-2 py-1 rounded mb-2">
                    -{product.discountPercent}%
                  </span>
                )}
              </>
            )}
          </div>
        </section>

        {/* Selectors */}
        <section className="px-4 mb-6">
          {/* Size selector */}
          <div ref={sizeRef} className="mb-5">
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelect={(size) => {
                setSelectedSize(size)
                setSizeError(false)
              }}
              hasError={sizeError}
            />
          </div>

          {/* Color selector */}
          {product.colors.length > 0 && (
            <div>
              <span className="font-label text-sm font-bold uppercase tracking-wider block mb-3">
                Цвет
              </span>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.hex}
                    aria-label={color.label}
                    onClick={() => setSelectedColor(color.hex)}
                    className={`w-8 h-8 rounded-full border border-outline-variant transition-all ${
                      selectedColor === color.hex
                        ? 'ring-2 ring-offset-2 ring-primary'
                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-outline-variant'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Description + Delivery */}
        <section className="px-4 mt-8 border-t border-outline-variant pt-6">
          {product.description != null && (
            <>
              <button
                onClick={() => setDescriptionOpen((v) => !v)}
                className="w-full flex justify-between items-center py-2 group"
                aria-expanded={descriptionOpen}
              >
                <span className="font-headline font-bold text-lg">Описание</span>
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-outline group-hover:text-primary transition-colors"
                >
                  {descriptionOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {descriptionOpen && (
                <p className="text-sm text-on-surface-variant mt-2 mb-4">
                  {product.description}
                </p>
              )}
            </>
          )}

          {/* Delivery info */}
          <div className="mt-6 flex items-start gap-3 p-4 bg-surface-container-low rounded">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-primary mt-0.5"
            >
              local_shipping
            </span>
            <div>
              <p className="font-body font-medium text-sm">
                Доставка от 299 ₽ • 2-5 дней
              </p>
              <p className="font-body text-xs text-outline mt-1">
                Точная стоимость будет рассчитана при оформлении заказа.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Toast notification */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-36 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-sm px-4 py-2 rounded-full z-50 whitespace-nowrap shadow-lg"
        >
          Товар добавлен в корзину
        </div>
      )}

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-background border-t border-outline-variant p-4 z-40">
        <button
          onClick={handleAddToCart}
          className="w-full h-12 bg-primary text-on-primary font-label text-sm font-bold uppercase tracking-widest rounded hover:opacity-90 active:scale-[0.98] transition-all mb-2 shadow-lg"
        >
          ДОБАВИТЬ В КОРЗИНУ
        </button>
        <button
          onClick={handleWishlist}
          className="w-full h-12 border border-primary text-primary font-label text-sm font-bold uppercase tracking-widest rounded hover:bg-surface-container-lowest active:scale-[0.98] transition-all"
        >
          {isInWishlist ? '✓ В СПИСКЕ ЖЕЛАНИЙ' : 'В СПИСОК ЖЕЛАНИЙ'}
        </button>
      </div>

      <BottomNavBar />
    </>
  )
}
