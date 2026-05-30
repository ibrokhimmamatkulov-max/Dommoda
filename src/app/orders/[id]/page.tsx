'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { usePrice } from '@/lib/usePrice'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

interface OrderItem {
  product_id: string
  product_name: string
  brand: string
  size: string
  color: string
  quantity: number
  unit_price: number
}

interface Order {
  id: string
  status: string
  delivery_method: string
  recipient_name: string
  phone: string
  city: string
  street: string
  building: string
  apartment: string | null
  subtotal: number
  promo_discount: number
  promo_code: string | null
  total: number
  items: OrderItem[]
  comment: string | null
  created_at: string
}

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Подтверждён', icon: 'check_circle' },
  { key: 'shipped',   label: 'Отправлен',   icon: 'local_shipping' },
  { key: 'delivered', label: 'Доставлен',   icon: 'home' },
]

const STATUS_ORDER = ['confirmed', 'shipped', 'delivered', 'cancelled', 'return_requested', 'returned']

const DELIVERY_LABELS: Record<string, string> = {
  courier: 'Курьером',
  pickup:  'Самовывоз',
  post:    'Почтой',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const fmt = usePrice()
  const [loading, setLoading] = useState(true)
  const [returnLoading, setReturnLoading] = useState(false)
  const [returnDone, setReturnDone] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`${BACKEND}/api/orders/${orderId}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null }
        return r.json()
      })
      .then((data) => { if (data) setOrder(data as Order) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-[40px] text-outline-variant animate-spin">progress_activity</span>
      </main>
    )
  }

  if (notFound || !order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="material-symbols-outlined text-[64px] text-outline-variant">search_off</span>
        <h1 className="text-xl font-semibold text-on-surface">Заказ не найден</h1>
        <p className="text-sm text-on-surface-variant">Проверьте номер заказа</p>
        <Link href="/" className="text-primary text-sm hover:underline">На главную</Link>
      </main>
    )
  }

  const currentStepIndex = STATUS_ORDER.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'
  const isReturnRequested = order.status === 'return_requested'
  const isReturned = order.status === 'returned'

  const handleReturn = async () => {
    if (!confirm('Вы уверены, что хотите оформить возврат?')) return
    setReturnLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/orders/${orderId}/return`, { method: 'POST' })
      if (res.ok) {
        setOrder({ ...order, status: 'return_requested' })
        setReturnDone(true)
      }
    } catch {}
    setReturnLoading(false)
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-on-surface">Заказ {order.id}</h1>
          <p className="text-xs text-on-surface-variant">{formatDate(order.created_at)}</p>
        </div>
      </div>

      {/* Status timeline */}
      {!isCancelled ? (
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Линия прогресса */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-outline-variant" />
            <div
              className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-500"
              style={{ width: currentStepIndex >= 0 ? `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` : '0%' }}
            />
            {STATUS_STEPS.map((step, i) => {
              const done = STATUS_ORDER.indexOf(order.status) >= STATUS_ORDER.indexOf(step.key)
              return (
                <div key={step.key} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    done ? 'bg-primary border-primary text-on-primary' : 'bg-surface border-outline-variant text-outline-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]"
                      style={done ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      {step.icon}
                    </span>
                  </div>
                  <span className={`text-xs text-center ${done ? 'text-primary font-medium' : 'text-on-surface-variant'}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mb-8 bg-error-container text-on-error-container rounded-lg px-4 py-3 text-sm font-medium text-center">
          Заказ отменён
        </div>
      )}

      {/* Items */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Состав заказа</h2>
        <div className="flex flex-col gap-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-start gap-4 py-3 border-b border-outline-variant last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">{item.brand}</p>
                <p className="text-sm text-on-surface leading-snug">{item.product_name}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{item.size} · {item.color} · {item.quantity} шт.</p>
              </div>
              <p className="text-sm font-semibold text-on-surface shrink-0">{fmt(item.unit_price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Price summary */}
      <section className="mb-6 bg-surface-container rounded-lg px-4 py-3 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Товары</span>
          <span>{fmt(order.subtotal)}</span>
        </div>
        {order.promo_discount > 0 && (
          <div className="flex justify-between text-sm text-primary">
            <span>Промокод {order.promo_code}</span>
            <span>−{fmt(order.promo_discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold border-t border-outline-variant pt-2 mt-1">
          <span>Итого</span>
          <span>{fmt(order.total)}</span>
        </div>
      </section>

      {/* Delivery */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Доставка</h2>
        <p className="text-sm text-on-surface">{DELIVERY_LABELS[order.delivery_method] ?? order.delivery_method}</p>
        <p className="text-sm text-on-surface-variant mt-0.5">
          {order.city}, {order.street}, д. {order.building}
          {order.apartment ? `, кв. ${order.apartment}` : ''}
        </p>
        <p className="text-sm text-on-surface-variant">{order.recipient_name} · {order.phone}</p>
        {order.comment && <p className="text-sm text-on-surface-variant mt-1">💬 {order.comment}</p>}
      </section>

      {/* Возврат */}
      {isReturnRequested && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-sm text-orange-800">
          ↩️ <strong>Возврат запрошен.</strong> Мы свяжемся с вами по телефону для уточнения деталей.
        </div>
      )}
      {isReturned && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
          ✅ <strong>Возврат оформлен.</strong> Средства будут возвращены в течение 3-5 дней.
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Link href="/" className="block w-full text-center bg-primary text-on-primary py-3 rounded font-medium hover:bg-primary-container transition-colors">
          Продолжить покупки
        </Link>

        {order.status === 'delivered' && !returnDone && (
          <button
            onClick={handleReturn}
            disabled={returnLoading}
            className="w-full text-center border border-outline-variant text-on-surface py-3 rounded font-medium hover:bg-surface-container transition-colors text-sm disabled:opacity-50"
          >
            {returnLoading ? 'Оформление...' : '↩️ Запросить возврат'}
          </button>
        )}
      </div>
    </main>
  )
}
