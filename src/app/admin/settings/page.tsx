'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

interface BannerForm {
  imageUrl: string
  badgeText: string
  headline: string
  ctaText: string
  ctaUrl: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function AdminSettingsPage(): React.JSX.Element {
  const [form, setForm] = useState<BannerForm>({
    imageUrl: '',
    badgeText: '',
    headline: '',
    ctaText: '',
    ctaUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  // Currency
  const [rate, setRate] = useState<string>('0.11')
  const [rateSave, setRateSave] = useState<SaveState>('idle')

  useEffect(() => {
    fetch(`${BACKEND}/api/settings/currency`)
      .then((r) => r.json())
      .then((d: { rub_to_tjs: number }) => setRate(String(d.rub_to_tjs)))
      .catch(() => {})
  }, [])

  const handleRateSave = async () => {
    setRateSave('saving')
    try {
      const res = await fetch('/api/admin/settings/currency', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rub_to_tjs: parseFloat(rate) }),
      })
      setRateSave(res.ok ? 'saved' : 'error')
    } catch {
      setRateSave('error')
    }
    setTimeout(() => setRateSave('idle'), 3000)
  }

  useEffect(() => {
    fetch(`${BACKEND}/api/settings/banner`)
      .then((r) => r.json())
      .then((data: BannerForm) => {
        setForm(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const setField = (key: keyof BannerForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveState('saving')
    try {
      const res = await fetch('/api/admin/settings/banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSaveState(res.ok ? 'saved' : 'error')
    } catch {
      setSaveState('error')
    }
    setTimeout(() => setSaveState('idle'), 3000)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-on-surface mb-6">Настройки баннера</h1>

          {/* Курс валюты */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 mb-6">
            <h2 className="text-base font-semibold text-on-surface mb-1">Курс валюты</h2>
            <p className="text-sm text-on-surface-variant mb-4">Цены на сайте показываются в сомони. Укажите актуальный курс: сколько сомони стоит 1 рубль.</p>
            <div className="flex items-end gap-4">
              <div className="flex flex-col gap-1 flex-1 max-w-xs">
                <label className="text-sm font-medium text-on-surface-variant">1 RUB =</label>
                <div className="flex items-center border border-outline-variant rounded focus-within:border-primary">
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm text-on-surface bg-transparent focus:outline-none"
                  />
                  <span className="px-3 py-2 text-sm text-on-surface-variant border-l border-outline-variant bg-surface-container">TJS</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  Пример: если 1 руб = 0.11 сомони, товар за 5 000 руб будет стоить <strong>{Math.round(5000 * parseFloat(rate || '0'))} сом</strong>
                </p>
              </div>
              <button
                onClick={handleRateSave}
                disabled={rateSave === 'saving'}
                className="bg-primary text-on-primary text-sm font-medium py-2 px-5 rounded hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {rateSave === 'saving' ? 'Сохранение...' : rateSave === 'saved' ? '✓ Сохранено' : 'Сохранить'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-sm text-on-surface-variant">Загрузка...</div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col gap-5">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface-variant">Ссылка на фото баннера</label>
                <input
                  type="text"
                  required
                  value={form.imageUrl}
                  onChange={(e) => setField('imageUrl', e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-on-surface-variant">HTTPS ссылка на изображение. Рекомендуемый размер: квадрат 600×600 или 800×800</p>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-on-surface-variant">Бейдж (напр. -70%)</label>
                  <input
                    type="text"
                    value={form.badgeText}
                    onChange={(e) => setField('badgeText', e.target.value)}
                    className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-on-surface-variant">Заголовок</label>
                  <input
                    type="text"
                    value={form.headline}
                    onChange={(e) => setField('headline', e.target.value)}
                    className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-on-surface-variant">Текст кнопки</label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => setField('ctaText', e.target.value)}
                    className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-on-surface-variant">Ссылка кнопки</label>
                  <input
                    type="text"
                    value={form.ctaUrl}
                    onChange={(e) => setField('ctaUrl', e.target.value)}
                    placeholder="/catalog/women"
                    className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {saveState === 'error' && (
                <p className="text-sm text-error">Не удалось сохранить. Попробуйте снова.</p>
              )}
              {saveState === 'saved' && (
                <p className="text-sm text-primary">Сохранено!</p>
              )}

              <button
                type="submit"
                disabled={saveState === 'saving'}
                className="bg-primary text-on-primary text-sm font-medium py-2.5 px-6 rounded hover:bg-primary-container transition-colors disabled:opacity-50 w-max"
              >
                {saveState === 'saving' ? 'Сохранение...' : 'Сохранить'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
