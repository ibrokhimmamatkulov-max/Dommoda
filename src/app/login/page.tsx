'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length < 9) { setError('Введите корректный номер'); return }
    setLoading(true)
    setError('')
    const ok = await login(`+992${phone}`, name || undefined)
    if (ok) {
      const back = new URLSearchParams(window.location.search).get('back')
      router.push(back ?? '/profile')
    } else {
      setError('Ошибка входа. Попробуйте снова.')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <button onClick={() => router.back()} className="text-on-surface-variant mb-6 flex items-center gap-1 hover:text-primary">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="text-sm">Назад</span>
        </button>

        <h1 className="text-2xl font-bold text-on-surface mb-2">Войти</h1>
        <p className="text-sm text-on-surface-variant mb-8">Введите номер телефона — мы найдём ваши заказы</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-on-surface-variant">Имя (необязательно)</label>
            <input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-outline-variant rounded px-3 py-2.5 text-sm text-on-surface bg-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-on-surface-variant">Номер телефона</label>
            <div className="flex items-center border border-outline-variant rounded focus-within:border-primary">
              <span className="px-3 py-2.5 text-sm text-on-surface-variant border-r border-outline-variant bg-surface-container">+992</span>
              <input
                type="tel"
                placeholder="000 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={9}
                required
                className="flex-1 px-3 py-2.5 text-sm text-on-surface bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary py-3 rounded font-medium text-sm hover:bg-primary-container transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </main>
  )
}
