'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { usePrice } from '@/lib/usePrice'
import { useCurrencyStore } from '@/store/currencyStore'
import { analytics } from '@/lib/analytics'

const DELIVERY_TJS = 40

export function CartSummary() {
  const router = useRouter()
  const fmt = usePrice()
  const rate = useCurrencyStore((s) => s.rate)
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.getTotalPrice())
  const discountTotal = useCartStore((s) => s.getDiscountTotal())
  const itemDiscount = useCartStore((s) => s.getItemDiscountTotal())
  const promoDiscount = useCartStore((s) => s.promoDiscount)

  const itemCount = items.length
  const subtotalTJS = Math.round(Math.max(0, totalPrice - discountTotal) * rate)
  const finalTotalTJS = subtotalTJS + DELIVERY_TJS

  return (
    <section className="bg-surface-container-lowest p-5 border border-outline-variant rounded flex flex-col gap-3 mb-6">
      <h2 className="font-headline font-bold text-lg mb-2">Ваш заказ</h2>

      <div className="flex justify-between text-sm text-on-surface">
        <span>Товары ({itemCount})</span>
        <span>{fmt(totalPrice)}</span>
      </div>

      {itemDiscount > 0 && (
        <div className="flex justify-between text-sm text-error font-medium">
          <span>Скидка</span>
          <span>-{fmt(itemDiscount)}</span>
        </div>
      )}

      {promoDiscount > 0 && (
        <div className="flex justify-between text-sm text-secondary">
          <span>Промокод</span>
          <span className="text-error">-{fmt(promoDiscount)}</span>
        </div>
      )}

      <div className="flex justify-between text-sm text-on-surface">
        <span>Доставка</span>
        <span>{DELIVERY_TJS} сом</span>
      </div>

      <hr className="border-outline-variant my-2" />

      <div className="flex justify-between items-end mb-4">
        <span className="font-headline font-bold text-lg">Итого</span>
        <span className="font-headline font-black text-2xl tracking-tight">
          {finalTotalTJS.toLocaleString('ru-RU')} сом
        </span>
      </div>

      <button
        disabled={itemCount === 0}
        onClick={() => { analytics.checkoutStart(finalTotalTJS); router.push('/checkout') }}
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
