import { SpecialCatalogPageClient } from '@/components/catalog/SpecialCatalogPageClient'

export const metadata = {
  title: 'Новинки — DOMMODA',
  description: 'Последние поступления',
}

export default function NewPage() {
  return (
    <SpecialCatalogPageClient
      title="НОВИНКИ"
      defaultSort="new"
      analyticsPath="/catalog/new"
      pageLimit={100}
    />
  )
}
