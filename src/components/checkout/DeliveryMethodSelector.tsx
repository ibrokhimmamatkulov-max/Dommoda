'use client'

import type { DeliveryOption } from '@/types'

const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'courier',
    label: 'Курьером',
    price: '40 сом',
    description: 'Доставим за 2–3 дня',
  },
  {
    id: 'pickup',
    label: 'Пункт выдачи',
    price: 'Бесплатно',
    description: 'Душанбе, Дехлави 1 · товар будет через 2–3 дня',
  },
]

interface DeliveryMethodSelectorProps {
  value: 'courier' | 'pickup' | 'post'
  onChange: (value: 'courier' | 'pickup' | 'post') => void
}

export function DeliveryMethodSelector({
  value,
  onChange,
}: DeliveryMethodSelectorProps) {
  return (
    <div className="space-y-4">
      {DELIVERY_OPTIONS.map((option) => {
        const isSelected = value === option.id
        return (
          <label
            key={option.id}
            className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
              isSelected
                ? 'border-primary bg-surface-container-low'
                : 'border-outline-variant hover:border-primary-fixed-dim'
            }`}
          >
            <div className="pt-1">
              <input
                type="radio"
                name="delivery"
                value={option.id}
                checked={isSelected}
                onChange={() => onChange(option.id)}
                className="form-radio"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-primary">{option.label}</span>
                <span className="font-medium text-primary">{option.price}</span>
              </div>
              <p className="text-sm text-secondary">{option.description}</p>
            </div>
          </label>
        )
      })}
    </div>
  )
}
