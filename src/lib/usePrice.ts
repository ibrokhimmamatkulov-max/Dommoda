'use client'

import { useCurrencyStore, formatTJS } from '@/store/currencyStore'

export function usePrice() {
  const rate = useCurrencyStore((s) => s.rate)
  return (rub: number) => formatTJS(rub, rate)
}
