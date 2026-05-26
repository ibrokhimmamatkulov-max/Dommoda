'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/formatPrice'

const DELIVERY_COST = 299

export function CartSummary() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.getTotalPrice())
  // getDiscountTotal = itemDiscount + promoDiscount — used only for finalTotal
  const discountTotal = useCartStore((s) => s.getDiscountTotal())
  // itemDiscount is the item-level markdown only (no promo) — used for the "Скидка" display row
  const itemDiscount = useCartStore((s) => s.getItemDiscountTotal())
  const promoDiscount = useCartStore((s) => s.promoDiscount)

  const itemCount = items.length
  // discountTotal already includes promoDiscount — deduct only once
  const finalTotal = Math.max(0, totalPrice - discountTotal + DELIVERY_COST)

  return (
    <section className="bg-surface-container-lowest p-5 border border-outline-variant rounded flex flex-col gap-3 mb-6">
      <h2 className="font-headline font-bold text-lg mb-2">Ваш заказ</h2>

      <div className="flex justify-between text-sm text-on-surface">
        <span>Товары ({itemCount})</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>

      {itemDiscount > 0 && (
        <div className="flex justify-between text-sm text-error font-medium">
          <span>Скидка</span>
          <span>-{formatPrice(itemDiscount)}</span>
        </div>
      )}

      {promoDiscount > 0 && (
        <div className="flex justify-between text-sm text-secondary">
          <span>Промокод</span>
          <span className="text-error">-{formatPrice(promoDiscount)}</span>
        </div>
      )}

      <div className="flex justify-between text-sm text-on-surface">
        <span>Доставка</span>
        <span>{formatPrice(DELIVERY_COST)}</span>
      </div>

      <hr className="border-outline-variant my-2" />

      <div className="flex justify-between items-end mb-4">
        <span className="font-headline font-bold text-lg">Итого</span>
        <span className="font-headline font-black text-2xl tracking-tight">
          {formatPrice(finalTotal)}
        </span>
      </div>

      <button
        disabled={itemCount === 0}
        onClick={() => router.push('/checkout')}
        className="w-full bg-primary text-on-primary py-4 rounded font-headline font-bold uppercase tracking-wider text-sm hover:bg-inverse-surface transition-colors active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ОФОРМИТЬ ЗАКАЗ
      </button>

      <p className="text-center text-[10px] text-outline mt-2">
        Нажимая на кнопку, вы соглашаетесь с{' '}
        <a className="underline" href="#">
          условиями обработки персональных данных
        </a>
      </p>
    </section>
  )
}
