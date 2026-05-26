'use client'

import { useState } from 'react'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { NavigationDrawer } from '@/components/layout/NavigationDrawer'
import { HeroBanner } from '@/components/home/HeroBanner'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { CategoryChips } from '@/components/catalog/CategoryChips'
import bannersData from '@/data/banners.json'
import type { Banner } from '@/types'

const banners = bannersData as Banner[]

const HOME_CATEGORIES = [
  { href: '/catalog/women', label: 'Женщинам' },
  { href: '/catalog/men', label: 'Мужчинам' },
  { href: '/catalog/kids', label: 'Детям' },
  { href: '/catalog/sport', label: 'Спорт' },
  { href: '#', label: 'Бренды' },
]

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const banner = banners[0]

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
