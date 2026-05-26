'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

interface TopAppBarHomeProps {
  variant: 'home'
  onMenuClick: () => void
}

interface TopAppBarCatalogProps {
  variant: 'catalog'
  title: string
}

interface TopAppBarProductProps {
  variant: 'product'
  productId?: string
}

interface TopAppBarCartProps {
  variant: 'cart'
  itemCount: number
  onClear: () => void
}

interface TopAppBarCheckoutProps {
  variant: 'checkout'
}

export type TopAppBarProps =
  | TopAppBarHomeProps
  | TopAppBarCatalogProps
  | TopAppBarProductProps
  | TopAppBarCartProps
  | TopAppBarCheckoutProps

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span
      aria-label={`${count} товаров в корзине`}
      className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
    >
      {count > 9 ? '9+' : count}
    </span>
  )
}

function HomeAppBar({ onMenuClick }: { onMenuClick: () => void }) {
  const totalCount = useCartStore((s) => s.getTotalCount())
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > 50 && currentScrollY > lastScrollY.current) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-surface-container-lowest border-b border-outline-variant transition-transform duration-300 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <button
        aria-label="Menu"
        onClick={onMenuClick}
        className="text-primary hover:opacity-70 transition-opacity p-2 -ml-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-fixed"
      >
        <span aria-hidden="true" className="material-symbols-outlined">
          menu
        </span>
      </button>
      <div className="text-xl font-black tracking-tighter text-primary font-headline select-none">
        DOMMODA
      </div>
      <div className="flex items-center gap-2">
        <Link href="/search" aria-label="Поиск">
          <span className="flex text-primary hover:opacity-70 transition-opacity p-2 rounded-full">
            <span aria-hidden="true" className="material-symbols-outlined">
              search
            </span>
          </span>
        </Link>
        <Link href="/cart" aria-label="Корзина" className="relative">
          <span className="flex text-primary hover:opacity-70 transition-opacity p-2 -mr-2 rounded-full">
            <span aria-hidden="true" className="material-symbols-outlined">
              shopping_bag
            </span>
            <CartBadge count={totalCount} />
          </span>
        </Link>
      </div>
    </header>
  )
}

function CatalogAppBar({ title }: { title: string }) {
  const router = useRouter()
  return (
    <header className="w-full top-0 sticky z-50 flex items-center justify-between px-4 h-14 bg-surface-container-lowest border-b border-outline-variant">
      <button
        aria-label="Go back"
        onClick={() => router.back()}
        className="text-primary hover:opacity-80 transition-opacity p-2 -ml-2 active:scale-95"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 className="font-headline text-base font-bold uppercase tracking-tight text-primary flex-1 text-center">
        {title}
      </h1>
      <div className="flex items-center gap-1">
        <button
          aria-label="Sort"
          onClick={() => window.alert('Сортировка — coming soon')}
          className="text-primary hover:opacity-80 transition-opacity p-2 active:scale-95"
        >
          <span className="material-symbols-outlined">sort</span>
        </button>
        <button
          aria-label="Filter"
          onClick={() => window.alert('Фильтры — coming soon')}
          className="text-primary hover:opacity-80 transition-opacity p-2 -mr-2 active:scale-95"
        >
          <span className="material-symbols-outlined">tune</span>
        </button>
      </div>
    </header>
  )
}

function ProductAppBar({ productId }: { productId?: string }) {
  const router = useRouter()
  const isInWishlist = useWishlistStore((s) =>
    productId != null ? s.isInWishlist(productId) : false
  )
  const toggleWishlist = useWishlistStore((s) => s.toggle)

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-surface-container-lowest border-b border-outline-variant">
      <button
        aria-label="Go back"
        onClick={() => router.back()}
        className="hover:opacity-70 transition-opacity active:scale-95 p-2 -ml-2"
      >
        <span className="material-symbols-outlined text-primary">arrow_back</span>
      </button>
      <div className="text-xl font-black tracking-tighter text-primary font-headline select-none">
        DOMMODA
      </div>
      <div className="flex items-center gap-2">
        <button
          aria-label="Share"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.share) {
              navigator.share({ url: window.location.href }).catch(() => null)
            }
          }}
          className="hover:opacity-70 transition-opacity active:scale-95 p-2"
        >
          <span className="material-symbols-outlined text-primary">share</span>
        </button>
        <button
          aria-label={isInWishlist ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => productId != null && toggleWishlist(productId)}
          className="hover:opacity-70 transition-opacity active:scale-95 p-2 -mr-2"
        >
          <span
            className="material-symbols-outlined text-primary"
            style={
              isInWishlist ? { fontVariationSettings: "'FILL' 1" } : undefined
            }
          >
            {isInWishlist ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>
    </header>
  )
}

function CartAppBar({
  itemCount,
  onClear,
}: {
  itemCount: number
  onClear: () => void
}) {
  const router = useRouter()

  const pluralLabel =
    itemCount === 1
      ? 'товар'
      : itemCount >= 2 && itemCount <= 4
      ? 'товара'
      : 'товаров'

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-surface-container-lowest border-b border-outline-variant">
      <button
        aria-label="Go back"
        onClick={() => router.back()}
        className="text-primary hover:opacity-70 transition-opacity active:scale-95 p-2 -ml-2"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 className="font-headline font-black text-base text-primary uppercase tracking-tight">
        КОРЗИНА ({itemCount} {pluralLabel})
      </h1>
      <button
        onClick={onClear}
        className="text-primary hover:opacity-70 transition-opacity font-body text-sm font-medium"
      >
        Очистить
      </button>
    </header>
  )
}

function CheckoutAppBar() {
  const router = useRouter()
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 h-14 bg-surface border-b border-outline-variant">
      <button
        aria-label="Go back"
        onClick={() => router.back()}
        className="p-2 -ml-2"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 className="text-center font-bold tracking-widest text-sm flex-1">
        ОФОРМЛЕНИЕ ЗАКАЗА
      </h1>
      <Link href="/cart">
        <span className="flex p-2 -mr-2">
          <span className="material-symbols-outlined">shopping_bag</span>
        </span>
      </Link>
    </header>
  )
}

export function TopAppBar(props: TopAppBarProps) {
  switch (props.variant) {
    case 'home':
      return <HomeAppBar onMenuClick={props.onMenuClick} />
    case 'catalog':
      return <CatalogAppBar title={props.title} />
    case 'product':
      return <ProductAppBar productId={props.productId} />
    case 'cart':
      return <CartAppBar itemCount={props.itemCount} onClear={props.onClear} />
    case 'checkout':
      return <CheckoutAppBar />
  }
}
