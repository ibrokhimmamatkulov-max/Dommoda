'use client'

import { useEffect } from 'react'
import { useCurrencyStore } from '@/store/currencyStore'

export function CurrencyInit() {
  const fetchRate = useCurrencyStore((s) => s.fetchRate)
  useEffect(() => { fetchRate() }, [fetchRate])
  return null
}
