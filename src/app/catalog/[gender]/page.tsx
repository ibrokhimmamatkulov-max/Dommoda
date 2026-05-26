import type { Metadata } from 'next'
import categoriesData from '@/data/categories.json'
import type { Category } from '@/types'
import { CatalogPageClient } from './_components/CatalogPageClient'

interface CatalogPageProps {
  params: Promise<{ gender: string }>
}

const categories = categoriesData as Category[]

// Human-readable display labels per category slug
const CATEGORY_LABELS: Record<string, string> = {
  women: 'Женщинам',
  men: 'Мужчинам',
  kids: 'Детям',
  sport: 'Спорт',
}

// Pre-render all known category pages at build time
export function generateStaticParams(): Array<{ gender: string }> {
  return categories.map((category) => ({ gender: category.id }))
}

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const { gender } = await params
  const label = CATEGORY_LABELS[gender] ?? gender

  return {
    title: `${label} | DOMMODA`,
    description: `Каталог одежды — ${label.toLowerCase()} в DOMMODA. Широкий выбор брендов и стилей.`,
  }
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { gender } = await params
  return <CatalogPageClient gender={gender} />
}
