'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface DrawerCategory {
  href: string
  icon: string
  label: string
}

const DRAWER_CATEGORIES: DrawerCategory[] = [
  { href: '/catalog/women', icon: 'female', label: 'Женщинам' },
  { href: '/catalog/men', icon: 'male', label: 'Мужчинам' },
  { href: '/catalog/kids', icon: 'child_care', label: 'Детям' },
  { href: '/catalog/sport', icon: 'sports_basketball', label: 'Спорт' },
  { href: '#', icon: 'sell', label: 'Бренды' },
]

interface NavigationDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeCategory?: string
}

export function NavigationDrawer({
  isOpen,
  onClose,
  activeCategory,
}: NavigationDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Move focus to close button when drawer opens
      closeButtonRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-primary/40 z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <nav
        aria-label="Main Navigation"
        aria-modal="true"
        role="dialog"
        className={`fixed inset-y-0 left-0 z-[60] flex flex-col bg-surface-container-lowest h-full w-80 max-w-[80vw] border-r border-outline-variant shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-variant">
          <span className="font-body uppercase text-sm tracking-wide text-primary font-bold">
            Категории
          </span>
          <button
            ref={closeButtonRef}
            aria-label="Close Menu"
            onClick={onClose}
            className="text-primary hover:bg-surface-container-low rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-fixed"
          >
            <span aria-hidden="true" className="material-symbols-outlined">
              close
            </span>
          </button>
        </div>

        {/* Category List */}
        <ul className="flex-1 overflow-y-auto py-2">
          {DRAWER_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.href.split('/').pop()
            return (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  onClick={onClose}
                  className={`flex items-center px-6 py-4 gap-4 transition-colors group ${
                    isActive
                      ? 'text-primary bg-surface-container font-bold'
                      : 'text-secondary hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined"
                    style={
                      isActive
                        ? { fontVariationSettings: "'FILL' 1" }
                        : undefined
                    }
                  >
                    {cat.icon}
                  </span>
                  <span className="font-body uppercase text-sm tracking-wide">
                    {cat.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Footer */}
        <div className="p-6 border-t border-surface-variant">
          <div className="text-xl font-black text-primary font-headline">
            DOMMODA
          </div>
          <p className="text-xs text-secondary mt-1">v.2.4.1</p>
        </div>
      </nav>
    </>
  )
}
