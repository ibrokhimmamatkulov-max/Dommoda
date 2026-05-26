'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HomeCategoryChip {
  href: string
  label: string
}

interface CatalogSubcategoryChip {
  id: string
  label: string
}

interface HomeCategoryChipsProps {
  variant: 'home'
  categories: HomeCategoryChip[]
}

interface CatalogCategoryChipsProps {
  variant: 'catalog'
  subcategories: CatalogSubcategoryChip[]
  activeSubcategory: string | null
  onSelect: (id: string | null) => void
}

type CategoryChipsProps = HomeCategoryChipsProps | CatalogCategoryChipsProps

export function CategoryChips(props: CategoryChipsProps) {
  const pathname = usePathname()

  if (props.variant === 'home') {
    return (
      <section className="w-full py-6 px-4">
        <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2 snap-x">
          {props.categories.map((cat) => {
            const isActive = pathname.startsWith(cat.href) || pathname === cat.href
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`snap-start shrink-0 px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border border-primary text-primary bg-surface-container-lowest'
                    : 'border border-outline-variant text-secondary bg-surface-container-lowest hover:bg-surface hover:text-primary'
                }`}
              >
                {cat.label}
              </Link>
            )
          })}
        </div>
      </section>
    )
  }

  // catalog variant
  return (
    <section className="w-full overflow-x-auto no-scrollbar py-3 px-4 border-b border-surface-container">
      <div className="flex items-center gap-2 w-max">
        <button
          onClick={() => props.onSelect(null)}
          className={`px-4 py-1.5 rounded-full font-label text-sm font-medium whitespace-nowrap active:scale-95 transition-all ${
            props.activeSubcategory === null
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          Все
        </button>
        {props.subcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => props.onSelect(sub.id)}
            className={`px-4 py-1.5 rounded-full font-label text-sm font-medium whitespace-nowrap active:scale-95 transition-all ${
              props.activeSubcategory === sub.id
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>
    </section>
  )
}
