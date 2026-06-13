import { SpecialCatalogPageClient } from '@/components/catalog/SpecialCatalogPageClient'

interface BrandPageProps {
  params: Promise<{ brand: string }>
}

export async function generateMetadata({ params }: BrandPageProps) {
  const { brand } = await params
  const name = decodeURIComponent(brand)
  return { title: `${name} — DOMMODA` }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params
  const name = decodeURIComponent(brand)
  return (
    <SpecialCatalogPageClient
      title={name.toUpperCase()}
      brand={name}
      showSubcategoryChips
      analyticsPath={`/catalog/brands/${brand}`}
    />
  )
}
