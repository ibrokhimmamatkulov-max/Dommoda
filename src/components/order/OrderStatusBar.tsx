'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'
const STORAGE_KEY = 'dommoda_active_order'

interface OrderStatus {
  id: string
  status: string
}

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  confirmed:  { label: 'Подтверждён',  icon: 'check_circle',    color: 'bg-blue-600' },
  shipped:    { label: 'В пути',        icon: 'local_shipping',  color: 'bg-purple-600' },
  delivered:  { label: 'Доставлен',    icon: 'home',            color: 'bg-green-600' },
  cancelled:  { label: 'Отменён',      icon: 'cancel',          color: 'bg-red-600' },
  pending:    { label: 'Обрабатывается', icon: 'schedule',      color: 'bg-gray-600' },
}

export function OrderStatusBar() {
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const orderId = localStorage.getItem(STORAGE_KEY)
    if (!orderId) return

    fetch(`${BACKEND}/api/orders/${orderId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data) return
        setOrder({ id: data.id, status: data.status })
        // Убираем из хранилища только если доставлен или отменён
        if (data.status === 'delivered' || data.status === 'cancelled') {
          localStorage.removeItem(STORAGE_KEY)
        }
      })
      .catch(() => {})
  }, [])

  if (!order || dismissed) return null

  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending

  return (
    <div className={`fixed bottom-16 left-0 right-0 z-40 ${cfg.color} text-white shadow-lg`}>
      <Link href={`/orders/${order.id}`} className="flex items-center justify-between px-4 py-3 hover:opacity-90 transition-opacity">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            {cfg.icon}
          </span>
          <div>
            <p className="text-xs opacity-80">Заказ {order.id}</p>
            <p className="text-sm font-semibold leading-tight">{cfg.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-80 underline">Подробнее</span>
          <button
            onClick={(e) => { e.preventDefault(); setDismissed(true) }}
            className="p-1 hover:opacity-70"
            aria-label="Закрыть"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </Link>
    </div>
  )
}
