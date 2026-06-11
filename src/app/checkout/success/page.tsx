'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { usePrice } from '@/lib/usePrice'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

interface OrderItem {
  product_name: string
  brand: string
  sku: string | null
  size: string
  color: string
  quantity: number
  unit_price: number
}

interface OrderData {
  id: string
  items: OrderItem[]
  subtotal: number
  promo_discount: number
  promo_code: string | null
  total: number
  delivery_method: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState<OrderData | null>(null)
  const fmt = usePrice()

  useEffect(() => {
    if (orderId) {
      localStorage.setItem('dommoda_active_order', orderId)
      fetch(`${BACKEND}/api/orders/${orderId}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) setOrder(data as OrderData) })
        .catch(() => null)
    }
  }, [orderId])

  return (
    <main className="max-w-lg mx-auto px-4 py-10 pb-20">
      {/* Success header */}
      <div className="flex flex-col items-center text-center mb-8 gap-3">
        <span
          className="material-symbols-outlined text-[72px] text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <h1 className="text-2xl font-bold text-on-surface">Заказ успешно оформлен!</h1>
        {orderId && (
          <p className="text-sm text-on-surface-variant font-mono">
            № <span className="font-semibold text-primary">{orderId}</span>
          </p>
        )}
        <div className="bg-surface-container rounded-lg px-5 py-4 text-sm text-on-surface-variant max-w-xs mt-1">
          Менеджер свяжется с вами для подтверждения заказа и уточнения адреса доставки.
        </div>
      </div>

      {/* Order items */}
      {order && order.items.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
            Ваш заказ
          </h2>
          <div className="flex flex-col divide-y divide-outline-variant border border-outline-variant rounded-lg overflow-hidden">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-start gap-4 px-4 py-3 bg-surface-container-lowest">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">{item.brand}</p>
                  <p className="text-sm text-on-surface leading-snug">{item.product_name}</p>
                  <p className="text-xs text-outline mt-0.5">
                    {item.size}{item.color ? ` · ${item.color}` : ''} · {item.quantity} шт.
                    {item.sku && <span className="font-mono ml-1">[{item.sku}]</span>}
                  </p>
                </div>
                <p className="text-sm font-semibold text-on-surface shrink-0">
                  {fmt(item.unit_price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Price summary */}
          <div className="mt-3 bg-surface-container rounded-lg px-4 py-3 flex flex-col gap-1.5">
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Товары</span>
              <span>{fmt(order.subtotal)}</span>
            </div>
            {order.promo_discount > 0 && (
              <div className="flex justify-between text-sm text-primary">
                <span>Промокод {order.promo_code}</span>
                <span>−{fmt(order.promo_discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold border-t border-outline-variant pt-2 mt-0.5">
              <span>Итого</span>
              <span>{fmt(order.total)}</span>
            </div>
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {orderId && (
          <Link
            href={`/orders/${orderId}`}
            className="block w-full text-center bg-primary text-on-primary py-3 rounded font-medium hover:opacity-90 transition-opacity"
          >
            Отслеживать заказ
          </Link>
        )}
        <Link
          href="/"
          className="block w-full text-center border border-outline-variant text-on-surface py-3 rounded font-medium hover:bg-surface-container transition-colors"
        >
          Продолжить покупки
        </Link>
      </div>
    </main>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
