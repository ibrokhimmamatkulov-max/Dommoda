'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { useAuthStore } from '@/store/authStore'
import { usePrice } from '@/lib/usePrice'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Подтверждён',
  shipped: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
  pending: 'Обрабатывается',
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'text-blue-600',
  shipped: 'text-purple-600',
  delivered: 'text-green-600',
  cancelled: 'text-red-600',
  pending: 'text-gray-500',
}

interface Order {
  id: string
  status: string
  total: number
  items_count: number
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { token, phone, name, logout } = useAuthStore()
  const fmt = usePrice()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(`${BACKEND}/api/auth/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: Order[]) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  if (!token) {
    return (
      <>
        <header className="sticky top-0 z-50 flex items-center px-4 h-14 bg-surface-container-lowest border-b border-outline-variant">
          <button onClick={() => router.back()} className="text-primary p-2 -ml-2">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-bold uppercase tracking-tight text-primary flex-1 text-center text-base">ПРОФИЛЬ</h1>
          <div className="w-10" />
        </header>

        <main className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
          <span className="material-symbols-outlined text-[64px] text-outline-variant">account_circle</span>
          <h2 className="text-lg font-semibold text-on-surface">Войдите в аккаунт</h2>
          <p className="text-sm text-on-surface-variant max-w-xs">Введите номер телефона чтобы видеть свои заказы</p>
          <Link
            href="/login?back=/profile"
            className="mt-2 bg-primary text-on-primary px-8 py-3 rounded font-medium text-sm hover:bg-primary-container transition-colors"
          >
            Войти по номеру телефона
          </Link>
        </main>
        <BottomNavBar />
      </>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center px-4 h-14 bg-surface-container-lowest border-b border-outline-variant">
        <button onClick={() => router.back()} className="text-primary p-2 -ml-2">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline font-bold uppercase tracking-tight text-primary flex-1 text-center text-base">ПРОФИЛЬ</h1>
        <button onClick={logout} className="text-xs text-on-surface-variant hover:text-error p-2">
          Выйти
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* User info */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-surface-container rounded-lg">
          <span className="material-symbols-outlined text-[40px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          <div>
            <p className="font-semibold text-on-surface">{name ?? 'Клиент'}</p>
            <p className="text-sm text-on-surface-variant">{phone}</p>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Мои заказы</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined text-[32px] text-outline-variant animate-spin">progress_activity</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px]">receipt_long</span>
            <p className="text-sm mt-2">Заказов пока нет</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between p-4 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
              >
                <div>
                  <p className="font-mono text-sm font-semibold text-primary">{order.id}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')} · {order.items_count} товар(а)
                  </p>
                  <p className={`text-xs font-medium mt-0.5 ${STATUS_COLORS[order.status] ?? 'text-gray-500'}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{fmt(order.total)}</p>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <BottomNavBar />
    </>
  )
}
