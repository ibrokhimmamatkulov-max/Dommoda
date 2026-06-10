'use client'

interface FilterSortBarProps {
  activeFiltersCount: number
  sortLabel: string
  total: number
  shown: number
  onFilterClick?: () => void
}

export function FilterSortBar({
  activeFiltersCount,
  sortLabel,
  total,
  shown,
  onFilterClick,
}: FilterSortBarProps) {
  return (
    <div>
      <section className="flex items-center justify-between px-4 py-3 bg-surface-bright border-b border-surface-container text-sm font-label">
        <button
          onClick={onFilterClick}
          className="flex items-center gap-1 text-on-surface-variant font-medium hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          <span>
            Фильтры{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
          </span>
        </button>
        <button
          onClick={onFilterClick}
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
