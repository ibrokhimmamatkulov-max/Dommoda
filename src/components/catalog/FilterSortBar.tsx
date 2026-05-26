'use client'

interface FilterSortBarProps {
  activeFiltersCount: number
  sortLabel: string
  total: number
  shown: number
}

export function FilterSortBar({
  activeFiltersCount,
  sortLabel,
  total,
  shown,
}: FilterSortBarProps) {
  const handleSortClick = () => {
    window.alert('Сортировка — coming soon')
  }

  return (
    <div>
      <section className="flex items-center justify-between px-4 py-3 bg-surface-bright border-b border-surface-container text-sm font-label">
        <div className="flex items-center gap-1 text-on-surface-variant font-medium">
          <span>Фильтры ({activeFiltersCount})</span>
        </div>
        <button
          onClick={handleSortClick}
          className="flex items-center gap-1 text-on-surface-variant font-medium hover:text-primary transition-colors"
        >
          <span>Сортировка: {sortLabel}</span>
          <span aria-hidden="true" className="material-symbols-outlined text-sm">
            expand_more
          </span>
        </button>
      </section>
      <p className="text-sm text-secondary px-4 py-2">
        Показано {shown} из {total} товаров
      </p>
    </div>
  )
}
