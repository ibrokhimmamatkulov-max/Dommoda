'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'

export function PromoCodeInput() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const { applyPromoCode, removePromoCode, promoCode } = useCartStore()
  // Read promoDiscount via selector so React re-renders when the value updates.
  // This also fixes the stale-closure in handleApply: after await applyPromoCode()
  // the store has already committed the new value, and getState() reads it synchronously.
  const promoDiscount = useCartStore((s) => s.promoDiscount)

  const handleApply = async () => {
    if (!code.trim()) return
    setStatus('loading')
    setMessage('')

    const success = await applyPromoCode(code.trim().toUpperCase())

    if (success) {
      // Read the freshly-committed value directly from the store — the selector
      // subscription above will trigger a re-render, but we also need the value
      // right now to compose the message string before the next render cycle.
      const freshDiscount = useCartStore.getState().promoDiscount
      setStatus('success')
      setMessage(`Промокод применён. Скидка ${freshDiscount} ₽`)
      setCode('')
    } else {
      setStatus('error')
      setMessage('Промокод не найден')
    }
  }

  const handleRemovePromo = () => {
    removePromoCode()
    setStatus('idle')
    setMessage('')
    setCode('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApply()
    }
  }

  if (promoCode != null) {
    return (
      <section className="bg-surface-container-lowest p-4 border border-outline-variant rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">
              local_offer
            </span>
            <span className="text-sm font-medium text-on-surface">{promoCode}</span>
          </div>
          <button
            onClick={handleRemovePromo}
            aria-label="Удалить промокод"
            className="text-on-surface-variant hover:text-error transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <p className="text-xs text-secondary mt-1">
          ✓ Промокод применён. Скидка {promoDiscount} ₽
        </p>
      </section>
    )
  }

  return (
    <section className="bg-surface-container-lowest p-4 border border-outline-variant rounded">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите промокод"
          className="flex-grow bg-transparent border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline font-body"
        />
        <button
          onClick={handleApply}
          disabled={status === 'loading' || !code.trim()}
          className="px-4 py-2 border border-primary text-primary rounded text-sm font-medium hover:bg-surface-container-low transition-colors active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Проверяем...' : 'Применить'}
        </button>
      </div>

      {message && (
        <p
          className={`text-xs mt-2 ${
            status === 'success' ? 'text-secondary' : 'text-error'
          }`}
        >
          {status === 'success' ? '✓ ' : ''}{message}
        </p>
      )}
    </section>
  )
}
