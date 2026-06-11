'use client'

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'

interface OrderItem {
  product_name: string
  brand: string
  sku: string | null
  size: string
  color: string
  quantity: number
  unit_price: number
}

interface Order {
  id: string
  status: string
  recipient_name: string | null
  phone: string
  email: string | null
  city: string | null
  street: string | null
  building: string | null
  apartment: string | null
  delivery_method: string
  total: number
  subtotal: number
  promo_code: string | null
  promo_discount: number
  items: OrderItem[]
  comment: string | null
  created_at: string
}

interface AddressForm {
  recipient_name: string
  city: string
  street: string
  building: string
  apartment: string
  comment: string
}

const STATUS_LABELS: Record<string, string> = {
  received: 'Поступил',
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
  return_requested: '↩️ Возврат запрошен',
  returned: 'Возвращён',
}

const STATUS_COLORS: Record<string, string> = {
  received: 'bg-amber-100 text-amber-800',
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  return_requested: 'bg-orange-100 text-orange-800',
  returned: 'bg-gray-100 text-gray-800',
}

const DELIVERY_LABELS: Record<string, string> = {
  courier: 'Курьер',
  pickup: 'Самовывоз',
  post: 'Почта',
}

const ALL_STATUSES = ['received', 'confirmed', 'shipped', 'delivered', 'cancelled', 'return_requested', 'returned']

function formatPrice(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminOrdersPage(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [addressForms, setAddressForms] = useState<Record<string, AddressForm>>({})
  const [savingAddress, setSavingAddress] = useState<string | null>(null)
  const [addressSaved, setAddressSaved] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((data: Order[]) => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleToggleExpand = (orderId: string) => {
    if (expanded === orderId) {
      setExpanded(null)
      return
    }
    setExpanded(orderId)
    if (!addressForms[orderId]) {
      const order = orders.find((o) => o.id === orderId)
      if (order) {
        setAddressForms((prev) => ({
          ...prev,
          [orderId]: {
            recipient_name: order.recipient_name ?? '',
            city: order.city ?? '',
            street: order.street ?? '',
            building: order.building ?? '',
            apartment: order.apartment ?? '',
            comment: order.comment ?? '',
          },
        }))
      }
    }
  }

  const setAddressField = (orderId: string, field: keyof AddressForm, value: string) => {
    setAddressForms((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value },
    }))
  }

  const saveAddress = async (orderId: string) => {
    setSavingAddress(orderId)
    const form = addressForms[orderId]
    const res = await fetch(`/api/admin/orders/${orderId}/address`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                recipient_name: form.recipient_name || null,
                city: form.city || null,
                street: form.street || null,
                building: form.building || null,
                apartment: form.apartment || null,
                comment: form.comment || null,
              }
            : o
        )
      )
      setAddressSaved(orderId)
      setTimeout(() => setAddressSaved(null), 2500)
    }
    setSavingAddress(null)
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
    setUpdating(null)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-semibold text-on-surface mb-6">
            Заказы {!loading && <span className="text-on-surface-variant font-normal text-base">({orders.length})</span>}
          </h1>

          {loading ? (
            <p className="text-sm text-on-surface-variant">Загрузка...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <p className="text-lg">Заказов пока нет</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-outline-variant rounded-lg bg-surface-container-lowest overflow-hidden">
                  {/* Header row */}
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-container transition-colors text-left"
                    onClick={() => handleToggleExpand(order.id)}
                  >
                    <span className="font-mono text-sm font-semibold text-primary w-28 shrink-0">{order.id}</span>
                    <span className="text-sm text-on-surface flex-1">{order.recipient_name ?? order.phone}</span>
                    <span className="text-sm text-on-surface-variant hidden sm:block">{order.phone}</span>
                    <span className="text-sm font-semibold text-on-surface w-24 text-right shrink-0">{formatPrice(order.total)}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="text-xs text-on-surface-variant shrink-0 hidden md:block">{formatDate(order.created_at)}</span>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">
                      {expanded === order.id ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {/* Expanded details */}
                  {expanded === order.id && (
                    <div className="border-t border-outline-variant px-5 py-4 flex flex-col gap-5">
                      {/* Items */}
                      <div>
                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Состав заказа</p>
                        <div className="flex flex-col gap-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm gap-4">
                              <span>
                                {item.brand} {item.product_name}
                                {item.sku != null && (
                                  <span className="ml-1 font-mono text-xs text-outline">[{item.sku}]</span>
                                )}
                                {' '}— {item.size}{item.color ? `, ${item.color}` : ''} × {item.quantity}
                              </span>
                              <span className="font-medium shrink-0">{formatPrice(item.unit_price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        {order.promo_code && (
                          <p className="text-sm text-primary mt-1">Промокод {order.promo_code}: -{formatPrice(order.promo_discount)}</p>
                        )}
                      </div>

                      {/* Address editor */}
                      <div className="border border-outline-variant rounded-lg p-4 bg-surface-container-low">
                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
                          Адрес доставки
                          {order.status === 'received' && (
                            <span className="ml-2 text-amber-700 normal-case font-normal">— уточните у клиента</span>
                          )}
                        </p>
                        {addressForms[order.id] && (
                          <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs text-on-surface-variant">Получатель</label>
                                <input
                                  type="text"
                                  value={addressForms[order.id].recipient_name}
                                  onChange={(e) => setAddressField(order.id, 'recipient_name', e.target.value)}
                                  placeholder="Имя получателя"
                                  className="border border-outline-variant rounded px-3 py-1.5 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs text-on-surface-variant">Город</label>
                                <input
                                  type="text"
                                  value={addressForms[order.id].city}
                                  onChange={(e) => setAddressField(order.id, 'city', e.target.value)}
                                  placeholder="Душанбе"
                                  className="border border-outline-variant rounded px-3 py-1.5 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-2 flex flex-col gap-1">
                                <label className="text-xs text-on-surface-variant">Улица</label>
                                <input
                                  type="text"
                                  value={addressForms[order.id].street}
                                  onChange={(e) => setAddressField(order.id, 'street', e.target.value)}
                                  placeholder="ул. Рудаки"
                                  className="border border-outline-variant rounded px-3 py-1.5 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs text-on-surface-variant">Дом</label>
                                <input
                                  type="text"
                                  value={addressForms[order.id].building}
                                  onChange={(e) => setAddressField(order.id, 'building', e.target.value)}
                                  placeholder="15"
                                  className="border border-outline-variant rounded px-3 py-1.5 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs text-on-surface-variant">Квартира / офис</label>
                                <input
                                  type="text"
                                  value={addressForms[order.id].apartment}
                                  onChange={(e) => setAddressField(order.id, 'apartment', e.target.value)}
                                  placeholder="необязательно"
                                  className="border border-outline-variant rounded px-3 py-1.5 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs text-on-surface-variant">Комментарий</label>
                                <input
                                  type="text"
                                  value={addressForms[order.id].comment}
                                  onChange={(e) => setAddressField(order.id, 'comment', e.target.value)}
                                  placeholder="ориентир, этаж..."
                                  className="border border-outline-variant rounded px-3 py-1.5 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <button
                                onClick={() => saveAddress(order.id)}
                                disabled={savingAddress === order.id}
                                className="text-sm px-4 py-2 bg-primary text-on-primary rounded hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
                              >
                                {savingAddress === order.id ? 'Сохранение...' : 'Сохранить адрес'}
                              </button>
                              {addressSaved === order.id && (
                                <span className="text-sm text-green-700 font-medium">✓ Адрес сохранён</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status change */}
                      <div>
                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Изменить статус</p>
                        <div className="flex flex-wrap gap-2">
                          {ALL_STATUSES.map((s) => (
                            <button
                              key={s}
                              disabled={order.status === s || updating === order.id}
                              onClick={() => updateStatus(order.id, s)}
                              className={`text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                                ${order.status === s
                                  ? 'bg-primary text-on-primary border-primary'
                                  : 'border-outline-variant text-on-surface hover:border-primary'}`}
                            >
                              {STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
