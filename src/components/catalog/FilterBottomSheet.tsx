'use client'

import { useEffect, useRef, useState } from 'react'

export interface ActiveFilters {
  sort: 'popular' | 'price_asc' | 'price_desc' | 'new'
  size: string | null
  minPrice: string
  maxPrice: string
}

const SORT_OPTIONS: { value: ActiveFilters['sort']; label: string }[] = [
  { value: 'popular', label: 'Популярные' },
  { value: 'new', label: 'Новые' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
]

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']

interface FilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  filters: ActiveFilters
  onApply: (filters: ActiveFilters) => void
}

export function FilterBottomSheet({ isOpen, onClose, filters, onApply }: FilterBottomSheetProps) {
  const [local, setLocal] = useState<ActiveFilters>(filters)
  const sheetRef = useRef<HTMLDivElement>(null)

  // sync with parent when opened
  useEffect(() => {
    if (isOpen) setLocal(filters)
  }, [isOpen, filters])

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const activeCount =
    (local.sort !== 'popular' ? 1 : 0) +
    (local.size != null ? 1 : 0) +
    (local.minPrice !== '' || local.maxPrice !== '' ? 1 : 0)

  function handleApply() {
    onApply(local)
    onClose()
  }

  function handleReset() {
    const reset: ActiveFilters = { sort: 'popular', size: null, minPrice: '', maxPrice: '' }
    setLocal(reset)
    onApply(reset)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-primary/40 z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Фильтры и сортировка"
        className={`fixed bottom-0 left-0 w-full z-[60] bg-surface-container-lowest rounded-t-2xl shadow-xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-outline-variant" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-variant">
          <span className="font-headline font-bold text-base uppercase">Фильтры и сортировка</span>
          <button onClick={onClose} aria-label="Закрыть" className="text-secondary hover:text-primary p-1 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">

          {/* Sort */}
          <section>
            <p className="text-xs font-bold uppercase text-secondary tracking-wider mb-3">Сортировка</p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLocal((p) => ({ ...p, sort: opt.value }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    local.sort === opt.value
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Size */}
          <section>
            <p className="text-xs font-bold uppercase text-secondary tracking-wider mb-3">Размер</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setLocal((p) => ({ ...p, size: p.size === s ? null : s }))}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors border ${
                    local.size === s
                      ? 'bg-primary text-on-primary border-primary'
                      : 'border-outline-variant text-on-surface hover:border-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Price */}
          <section>
            <p className="text-xs font-bold uppercase text-secondary tracking-wider mb-3">Цена (сом)</p>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                placeholder="от"
                value={local.minPrice}
                onChange={(e) => setLocal((p) => ({ ...p, minPrice: e.target.value }))}
                className="flex-1 border border-outline-variant rounded px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-primary"
              />
              <span className="text-secondary text-sm">—</span>
              <input
                type="number"
                placeholder="до"
                value={local.maxPrice}
                onChange={(e) => setLocal((p) => ({ ...p, maxPrice: e.target.value }))}
                className="flex-1 border border-outline-variant rounded px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-primary"
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-surface-variant pb-safe">
          <button
            onClick={handleReset}
            className="flex-1 py-3 border border-outline-variant text-on-surface text-sm font-medium rounded hover:bg-surface-container transition-colors"
          >
            Сбросить {activeCount > 0 ? `(${activeCount})` : ''}
          </button>
          <button
            onClick={handleApply}
            className="flex-2 flex-grow-[2] py-3 bg-primary text-on-primary text-sm font-bold rounded hover:opacity-90 transition-opacity"
          >
            Применить
          </button>
        </div>
      </div>
    </>
  )
}
