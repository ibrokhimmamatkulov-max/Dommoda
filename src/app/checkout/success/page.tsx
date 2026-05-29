'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
      <span className="material-symbols-outlined text-[72px] text-primary">check_circle</span>
      <h1 className="text-2xl font-bold text-on-surface">Заказ оформлен!</h1>
      {orderId && (
        <p className="text-on-surface-variant text-sm">Номер заказа: <span className="font-mono font-semibold text-primary">{orderId}</span></p>
      )}
      <p className="text-on-surface-variant text-sm max-w-xs">
        Мы свяжемся с вами для подтверждения доставки
      </p>
      <Link
        href="/"
        className="mt-4 bg-primary text-on-primary px-8 py-3 rounded font-medium hover:bg-primary-container transition-colors"
      >
        На главную
      </Link>
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
