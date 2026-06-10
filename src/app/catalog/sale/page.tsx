import { SpecialCatalogPageClient } from '@/components/catalog/SpecialCatalogPageClient'

export const metadata = {
  title: 'Акции — DOMMODA',
  description: 'Товары со скидкой',
}

export default function SalePage() {
  return (
    <SpecialCatalogPageClient
      title="АКЦИИ"
      hasDiscount={true}
      defaultSort="popular"
      analyticsPath="/catalog/sale"
    />
  )
}
