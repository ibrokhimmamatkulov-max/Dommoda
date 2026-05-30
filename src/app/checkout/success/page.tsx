'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5">
      <span className="material-symbols-outlined text-[72px] text-primary"
        style={{ fontVariationSettings: "'FILL' 1" }}>
        check_circle
      </span>
      <h1 className="text-2xl font-bold text-on-surface">Заказ оформлен!</h1>
      {orderId && (
        <p className="text-on-surface-variant text-sm">
          Номер заказа:{' '}
          <span className="font-mono font-semibold text-primary">{orderId}</span>
        </p>
      )}
      <p className="text-on-surface-variant text-sm max-w-xs">
        Мы свяжемся с вами для подтверждения доставки
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
        {orderId && (
          <Link
            href={`/orders/${orderId}`}
            className="bg-primary text-on-primary px-8 py-3 rounded font-medium hover:bg-primary-container transition-colors text-center"
          >
            Отслеживать заказ
          </Link>
        )}
        <Link
          href="/"
          className="border border-outline-variant text-on-surface px-8 py-3 rounded font-medium hover:bg-surface-container transition-colors text-center"
        >
          На главную
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
