'use client'

import Link from 'next/link'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { CartItem } from '@/components/cart/CartItem'
import { PromoCodeInput } from '@/components/cart/PromoCodeInput'
import { CartSummary } from '@/components/cart/CartSummary'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)

  const handleClear = () => {
    const confirmed = window.confirm('Очистить корзину?')
    if (confirmed) clearCart()
  }

  return (
    <>
      <TopAppBar
        variant="cart"
        itemCount={items.length}
        onClear={handleClear}
      />

      <main className="flex-grow container mx-auto max-w-2xl px-4 py-6 flex flex-col gap-8 pt-20 pb-24">
        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[64px] text-outline-variant"
            >
              shopping_bag
            </span>
            <h2 className="font-headline font-bold text-xl text-on-surface">
              Корзина пуста
            </h2>
            <p className="text-secondary text-sm max-w-xs">
              Добавьте товары, которые вам понравились
            </p>
            <Link
              href="/catalog/women"
              className="mt-4 px-8 py-3 bg-primary text-on-primary font-medium uppercase tracking-wide text-sm hover:bg-tertiary transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <section className="flex flex-col gap-4">
              {items.map((item) => (
                <CartItem
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  item={item}
                />
              ))}
            </section>

            {/* Promo code */}
            <PromoCodeInput />

            {/* Order summary */}
            <CartSummary />
          </>
        )}
      </main>

      <BottomNavBar />
    </>
  )
}
