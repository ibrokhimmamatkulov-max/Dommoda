'use client'

import { useState, useEffect } from 'react'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { NavigationDrawer } from '@/components/layout/NavigationDrawer'
import { HeroBanner } from '@/components/home/HeroBanner'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { CategoryChips } from '@/components/catalog/CategoryChips'
import type { Banner } from '@/types'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

const HOME_CATEGORIES = [
  { href: '/catalog/women', label: 'Женщинам' },
  { href: '/catalog/men', label: 'Мужчинам' },
  { href: '/catalog/kids', label: 'Детям' },
  { href: '/catalog/sport', label: 'Спорт' },
  { href: '#', label: 'Бренды' },
]

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [banner, setBanner] = useState<Banner | null>(null)

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

  return (
    <>
      <TopAppBar variant="home" onMenuClick={() => setDrawerOpen(true)} />

      <NavigationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <main className="w-full max-w-lg mx-auto pt-14 pb-20">
        {banner != null && <HeroBanner banner={banner} />}

        <CategoryChips variant="home" categories={HOME_CATEGORIES} />

        <FeaturedSection />
      </main>

      <BottomNavBar />
    </>
  )
}
