'use client'

import { useRouter } from 'next/navigation'
import { BottomNavBar } from '@/components/layout/BottomNavBar'

export default function ProfilePage() {
  const router = useRouter()

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center px-4 h-14 bg-surface-container-lowest border-b border-outline-variant">
        <button
          aria-label="Go back"
          onClick={() => router.back()}
          className="text-primary hover:opacity-80 p-2 -ml-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline font-bold uppercase tracking-tight text-primary flex-1 text-center text-base">
          ПРОФИЛЬ
        </h1>
        <div className="w-10" />
      </header>

      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <span
          aria-hidden="true"
          className="material-symbols-outlined text-[64px] text-outline-variant mb-4"
        >
          person
        </span>
        <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
          Личный кабинет
        </h2>
        <p className="text-secondary text-sm">в разработке</p>
      </main>

      <BottomNavBar />
    </>
  )
}
