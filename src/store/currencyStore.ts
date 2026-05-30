'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

interface CurrencyStore {
  rate: number  // 1 RUB = rate TJS
  fetchRate: () => Promise<void>
  setRate: (rate: number) => void
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      rate: 0.11,
      fetchRate: async () => {
        try {
          const res = await fetch(`${BACKEND}/api/settings/currency`)
          if (!res.ok) return
          const data = await res.json() as { rub_to_tjs: number }
          set({ rate: data.rub_to_tjs })
        } catch {}
      },
      setRate: (rate) => set({ rate }),
    }),
    { name: 'dommoda-currency' }
  )
)

export function formatTJS(rub: number, rate: number): string {
  const tjs = Math.round(rub * rate)
  return `${tjs.toLocaleString('ru-RU')} сом`
}
