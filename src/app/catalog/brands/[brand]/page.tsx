import { SpecialCatalogPageClient } from '@/components/catalog/SpecialCatalogPageClient'

interface BrandPageProps {
  params: { brand: string }
}

export function generateMetadata({ params }: BrandPageProps) {
  const name = decodeURIComponent(params.brand)
  return { title: `${name} — DOMMODA` }
}

export default function BrandPage({ params }: BrandPageProps) {
  const name = decodeURIComponent(params.brand)
  return (
    <SpecialCatalogPageClient
      title={name.toUpperCase()}
      brand={name}
      analyticsPath={`/catalog/brands/${params.brand}`}
    />
  )
}
