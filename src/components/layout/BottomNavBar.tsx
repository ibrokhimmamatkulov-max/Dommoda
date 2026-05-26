'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

interface NavItem {
  href: string
  icon: string
  label: string
  matchPaths?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', icon: 'home', label: 'Главная', matchPaths: ['/'] },
  {
    href: '/catalog/women',
    icon: 'search',
    label: 'Каталог',
    matchPaths: ['/catalog'],
  },
  { href: '/cart', icon: 'shopping_bag', label: 'Корзина', matchPaths: ['/cart'] },
  {
    href: '/wishlist',
    icon: 'favorite',
    label: 'Избранное',
    matchPaths: ['/wishlist'],
  },
  {
    href: '/profile',
    icon: 'person',
    label: 'Профиль',
    matchPaths: ['/profile'],
  },
]

export function BottomNavBar() {
  const pathname = usePathname()
  const totalCount = useCartStore((s) => s.getTotalCount())

  function isActive(item: NavItem): boolean {
    if (item.matchPaths) {
      return item.matchPaths.some((p) =>
        p === '/' ? pathname === '/' : pathname.startsWith(p)
      )
    }
    return pathname === item.href
  }

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface-container-lowest border-t border-outline-variant pb-safe"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0.75rem)' }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item)
        const isCart = item.href === '/cart'

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-col items-center justify-center w-16 py-2 transition-colors ${
              active ? 'text-primary font-bold' : 'text-secondary'
            }`}
          >
            <span className="relative">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[24px] mb-1 block"
                style={
                  active
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              {isCart && totalCount > 0 && (
                <span
                  aria-label={`${totalCount} товаров в корзине`}
                  className="absolute -top-1 -right-1 bg-error text-on-error text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                >
                  {totalCount > 9 ? '9+' : totalCount}
                </span>
              )}
            </span>
            <span className="font-label text-[10px] uppercase font-medium">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
