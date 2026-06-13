'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { NavigationDrawer } from '@/components/layout/NavigationDrawer'
import { HeroBanner } from '@/components/home/HeroBanner'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { getBrands } from '@/lib/api'
import type { Banner } from '@/types'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [banner, setBanner] = useState<Banner | null>(null)
  const [brands, setBrands] = useState<{ name: string; count: number }[]>([])

  useEffect(() => {
    fetch(`${BACKEND}/api/settings/banner`)
      .then((r) => r.json())
      .then((data) =>
        setBanner({
          id: 'main',
          imageUrl: data.imageUrl,
          alt: data.headline,
          badgeText: data.badgeText,
          headline: data.headline,
          ctaText: data.ctaText,
          ctaUrl: data.ctaUrl,
        })
      )
      .catch(() => {})
  }, [])

  useEffect(() => {
    getBrands().then(setBrands).catch(() => {})
  }, [])

  return (
    <>
      <TopAppBar variant="home" onMenuClick={() => setDrawerOpen(true)} />

      <NavigationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <main className="w-full max-w-lg mx-auto pt-header pb-nav">
        {banner != null && <HeroBanner banner={banner} />}

        {/* Бренды */}
        <section className="px-4 py-6">
          <h2 className="font-headline font-bold uppercase text-primary text-xl mb-4">
            Бренды
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {brands.map((b) => (
              <Link
                key={b.name}
                href={`/catalog/brands/${encodeURIComponent(b.name)}`}
                className="flex flex-col justify-between p-4 border border-outline-variant rounded hover:border-primary hover:bg-surface-container-low transition-colors active:scale-95"
              >
                <span className="font-headline font-bold text-sm text-primary uppercase leading-tight">
                  {b.name}
                </span>
                <span className="text-xs text-secondary mt-2">
                  {b.count} {b.count === 1 ? 'товар' : b.count < 5 ? 'товара' : 'товаров'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <FeaturedSection />
      </main>

      <BottomNavBar />
    </>
  )
}
