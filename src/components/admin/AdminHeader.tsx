'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export function AdminHeader(): React.JSX.Element {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant px-6 py-3 flex items-center justify-between">
      <Link href="/admin" className="text-base font-semibold text-on-surface hover:text-primary-fixed transition-colors">
        DOMMODA Admin
      </Link>

      <nav className="flex items-center gap-4">
        <Link href="/admin" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
          Товары
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-sm text-on-surface-variant hover:text-error transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? 'Выход...' : 'Выйти'}
        </button>
      </nav>
    </header>
  )
}
