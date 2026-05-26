'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }

export default function AdminLoginPage(): React.JSX.Element {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formState, setFormState] = useState<FormState>({ status: 'idle' })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setFormState({ status: 'loading' })

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: username, password }),
      })

      if (!response.ok) {
        setFormState({ status: 'error', message: 'Неверный логин или пароль' })
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setFormState({ status: 'error', message: 'Ошибка соединения. Попробуйте снова.' })
    }
  }

  const isLoading = formState.status === 'loading'

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-lg p-8">
        <h1 className="text-xl font-semibold text-on-surface mb-6">Вход в админ-панель</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm text-on-surface-variant">
              Логин
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-on-surface-variant">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          {formState.status === 'error' && (
            <p className="text-sm text-error" role="alert">
              {formState.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 bg-primary text-on-primary text-sm font-medium py-2.5 px-4 rounded hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
