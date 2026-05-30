'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

interface AuthStore {
  token: string | null
  phone: string | null
  name: string | null
  login: (phone: string, name?: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      phone: null,
      name: null,

      login: async (phone, name) => {
        try {
          const res = await fetch(`${BACKEND}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, name }),
          })
          if (!res.ok) return false
          const data = await res.json() as { access_token: string; phone: string; name: string | null }
          set({ token: data.access_token, phone: data.phone, name: data.name })
          return true
        } catch {
          return false
        }
      },

      logout: () => set({ token: null, phone: null, name: null }),
    }),
    { name: 'dommoda-auth' }
  )
)
