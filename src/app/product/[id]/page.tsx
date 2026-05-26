import type { Metadata } from 'next'
import productsData from '@/data/products.json'
import type { Product } from '@/types'
import { ProductPageClient } from './_components/ProductPageClient'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

// Pre-render every known product at build time as static HTML
export function generateStaticParams(): Array<{ id: string }> {
  return (productsData as Product[]).map((product) => ({ id: product.id }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = (productsData as Product[]).find((p) => p.id === id)

  if (product == null) {
    return { title: 'Товар не найден | DOMMODA' }
  }

  return {
    title: `${product.brand} ${product.name} | DOMMODA`,
    description: product.description ?? `${product.brand} ${product.name} — купить в DOMMODA`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  return <ProductPageClient id={id} />
}
