'use client'

import type { ProductSize } from '@/types'

interface SizeSelectorProps {
  sizes: ProductSize[]
  selectedSize: string | null
  onSelect: (size: string) => void
  hasError?: boolean
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  hasError,
}: SizeSelectorProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-label text-sm font-bold uppercase tracking-wider">
          Размер
        </span>
        <button
          onClick={() => window.alert('Таблица размеров — coming soon')}
          className="text-sm text-outline underline underline-offset-4"
        >
          Таблица размеров
        </button>
      </div>

      <div
        className={`flex flex-wrap gap-2 rounded p-1 transition-colors ${
          hasError ? 'ring-2 ring-error' : ''
        }`}
      >
        {sizes.map((size) => {
          const isSelected = selectedSize === size.label
          const isUnavailable = !size.available

          return (
            <button
              key={size.label}
              disabled={isUnavailable}
              onClick={() => !isUnavailable && onSelect(size.label)}
              aria-pressed={isSelected}
              aria-disabled={isUnavailable}
              className={`h-10 px-4 rounded font-label text-sm transition-colors ${
                isSelected
                  ? 'border border-primary bg-primary text-on-primary font-bold shadow-md'
                  : isUnavailable
                  ? 'border border-outline-variant opacity-50 cursor-not-allowed text-outline-variant'
                  : 'border border-outline-variant hover:border-primary'
              }`}
            >
              {size.label}
            </button>
          )
        })}
      </div>

      {hasError && (
        <p className="text-error text-xs mt-2">Выберите размер</p>
      )}
    </div>
  )
}
