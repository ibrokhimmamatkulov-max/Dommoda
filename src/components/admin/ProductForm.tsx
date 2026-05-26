'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminProduct, AdminProductFormData, ProductCategory, ProductSizeLabel } from '@/types/admin'
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from '@/types/admin'

interface ProductFormProps {
  /** When provided, the form is in edit mode. */
  product?: AdminProduct
}

type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'error'; message: string }

const DEFAULT_FORM: AdminProductFormData = {
  name: '',
  brand: '',
  category: 'women',
  subcategory: '',
  price: 0,
  price_original: null,
  description: '',
  sizes: [],
  in_stock: true,
  images: [],
}

function toFormData(product: AdminProduct): AdminProductFormData {
  return {
    name: product.name,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    price_original: product.price_original,
    description: product.description,
    sizes: product.sizes,
    in_stock: product.in_stock,
    images: product.images ?? [],
  }
}

export function ProductForm({ product }: ProductFormProps): React.JSX.Element {
  const router = useRouter()
  const isEditing = product !== undefined

  const [form, setForm] = useState<AdminProductFormData>(
    isEditing ? toFormData(product) : DEFAULT_FORM
  )
  const [saveState, setSaveState] = useState<SaveState>({ status: 'idle' })

  const setField = <K extends keyof AdminProductFormData>(
    key: K,
    value: AdminProductFormData[K]
  ): void => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleSize = (size: ProductSizeLabel): void => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setSaveState({ status: 'saving' })

    const url = isEditing
      ? `/api/admin/products/${product.id}`
      : '/api/admin/products/create'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        setSaveState({ status: 'error', message: 'Не удалось сохранить товар. Попробуйте снова.' })
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setSaveState({ status: 'error', message: 'Ошибка соединения. Попробуйте снова.' })
    }
  }

  const isSaving = saveState.status === 'saving'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-on-surface-variant">
          Название <span className="text-error">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          disabled={isSaving}
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary disabled:opacity-50"
        />
      </div>

      {/* Brand */}
      <div className="flex flex-col gap-1">
        <label htmlFor="brand" className="text-sm font-medium text-on-surface-variant">
          Бренд <span className="text-error">*</span>
        </label>
        <input
          id="brand"
          type="text"
          required
          disabled={isSaving}
          value={form.brand}
          onChange={(e) => setField('brand', e.target.value)}
          className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary disabled:opacity-50"
        />
      </div>

      {/* Category + Subcategory row */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="category" className="text-sm font-medium text-on-surface-variant">
            Категория <span className="text-error">*</span>
          </label>
          <select
            id="category"
            required
            disabled={isSaving}
            value={form.category}
            onChange={(e) => setField('category', e.target.value as ProductCategory)}
            className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary disabled:opacity-50"
          >
            {(Object.keys(PRODUCT_CATEGORIES) as ProductCategory[]).map((key) => (
              <option key={key} value={key}>
                {PRODUCT_CATEGORIES[key]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="subcategory" className="text-sm font-medium text-on-surface-variant">
            Подкатегория
          </label>
          <input
            id="subcategory"
            type="text"
            disabled={isSaving}
            value={form.subcategory}
            onChange={(e) => setField('subcategory', e.target.value)}
            className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>
      </div>

      {/* Price + Price original row */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="price" className="text-sm font-medium text-on-surface-variant">
            Цена <span className="text-error">*</span>
          </label>
          <input
            id="price"
            type="number"
            required
            min={0}
            step={1}
            disabled={isSaving}
            value={form.price}
            onChange={(e) => setField('price', e.target.valueAsNumber)}
            className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="price_original" className="text-sm font-medium text-on-surface-variant">
            Старая цена
          </label>
          <input
            id="price_original"
            type="number"
            min={0}
            step={1}
            disabled={isSaving}
            value={form.price_original ?? ''}
            onChange={(e) =>
              setField(
                'price_original',
                e.target.value === '' ? null : e.target.valueAsNumber
              )
            }
            className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-on-surface-variant">
          Описание
        </label>
        <textarea
          id="description"
          rows={4}
          disabled={isSaving}
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary disabled:opacity-50 resize-none"
        />
      </div>

      {/* Images */}
      <div className="flex flex-col gap-1">
        <label htmlFor="images" className="text-sm font-medium text-on-surface-variant">
          Ссылки на фото <span className="text-on-surface-variant font-normal">(каждая с новой строки)</span>
        </label>
        <textarea
          id="images"
          rows={3}
          disabled={isSaving}
          placeholder="https://example.com/image1.jpg"
          value={form.images.join('\n')}
          onChange={(e) =>
            setField(
              'images',
              e.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary disabled:opacity-50 resize-none"
        />
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-on-surface-variant">Размеры</span>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_SIZES.map((size) => {
            const isSelected = form.sizes.includes(size)
            return (
              <button
                key={size}
                type="button"
                disabled={isSaving}
                onClick={() => toggleSize(size)}
                aria-pressed={isSelected}
                className={`px-3 py-1.5 rounded text-sm border transition-colors disabled:opacity-50 ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* In stock toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={form.in_stock}
          disabled={isSaving}
          onClick={() => setField('in_stock', !form.in_stock)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none disabled:opacity-50 ${
            form.in_stock ? 'bg-primary' : 'bg-surface-variant'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
              form.in_stock ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm text-on-surface">В наличии</span>
      </div>

      {saveState.status === 'error' && (
        <p className="text-sm text-error" role="alert">
          {saveState.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-primary text-on-primary text-sm font-medium py-2 px-6 rounded hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => router.push('/admin')}
          className="text-sm font-medium py-2 px-6 rounded border border-outline-variant text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
