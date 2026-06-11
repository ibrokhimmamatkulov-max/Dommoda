'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { AdminProduct } from '@/types/admin'
import { PRODUCT_CATEGORIES } from '@/types/admin'

interface ProductsTableProps {
  products: AdminProduct[]
}

type DeleteState =
  | { status: 'idle' }
  | { status: 'confirming'; productId: string; productName: string }
  | { status: 'deleting'; productId: string }
  | { status: 'error'; message: string }

export function ProductsTable({ products }: ProductsTableProps): React.JSX.Element {
  const router = useRouter()
  const [deleteState, setDeleteState] = useState<DeleteState>({ status: 'idle' })

  const handleDeleteRequest = (productId: string, productName: string): void => {
    setDeleteState({ status: 'confirming', productId, productName })
  }

  const handleDeleteConfirm = async (): Promise<void> => {
    if (deleteState.status !== 'confirming') return
    const { productId } = deleteState
    setDeleteState({ status: 'deleting', productId })

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        setDeleteState({ status: 'error', message: 'Не удалось удалить товар. Попробуйте снова.' })
        return
      }

      setDeleteState({ status: 'idle' })
      router.refresh()
    } catch {
      setDeleteState({ status: 'error', message: 'Ошибка соединения. Попробуйте снова.' })
    }
  }

  const handleDeleteCancel = (): void => {
    setDeleteState({ status: 'idle' })
  }

  if (products.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-8 text-center text-on-surface-variant text-sm">
        Товаров пока нет. <Link href="/admin/products/new" className="text-primary underline">Добавить первый</Link>
      </div>
    )
  }

  return (
    <>
      {deleteState.status === 'error' && (
        <div className="mb-4 bg-error-container text-on-error-container rounded p-3 text-sm flex items-center justify-between">
          <span>{deleteState.message}</span>
          <button
            onClick={() => setDeleteState({ status: 'idle' })}
            className="ml-4 underline text-xs"
          >
            Закрыть
          </button>
        </div>
      )}

      {(deleteState.status === 'confirming' || deleteState.status === 'deleting') && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-base font-semibold text-on-surface mb-2">Удалить товар?</h2>
            {deleteState.status === 'confirming' && (
              <p className="text-sm text-on-surface-variant mb-4">
                Вы собираетесь удалить &ldquo;{deleteState.productName}&rdquo;. Это действие нельзя отменить.
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                disabled={deleteState.status === 'deleting'}
                className="text-sm px-4 py-2 border border-outline-variant rounded text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteState.status === 'deleting'}
                className="text-sm px-4 py-2 bg-error text-on-error rounded hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {deleteState.status === 'deleting' ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left px-4 py-3 text-on-surface-variant font-medium w-16">Фото</th>
                <th className="text-left px-4 py-3 text-on-surface-variant font-medium">Название</th>
                <th className="text-left px-4 py-3 text-on-surface-variant font-medium">Артикул</th>
                <th className="text-left px-4 py-3 text-on-surface-variant font-medium">Бренд</th>
                <th className="text-left px-4 py-3 text-on-surface-variant font-medium">Категория</th>
                <th className="text-left px-4 py-3 text-on-surface-variant font-medium">Цена</th>
                <th className="text-left px-4 py-3 text-on-surface-variant font-medium">В наличии</th>
                <th className="text-left px-4 py-3 text-on-surface-variant font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low'}
                >
                  <td className="px-4 py-3">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-10 h-10 bg-surface-container rounded flex items-center justify-center text-outline text-xs">
                        —
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-on-surface font-medium max-w-48 truncate">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant font-mono text-xs">
                    {product.sku ?? <span className="text-outline">—</span>}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{product.brand}</td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {PRODUCT_CATEGORIES[product.category] ?? product.category}
                  </td>
                  <td className="px-4 py-3 text-on-surface">
                    {product.price.toLocaleString('ru-RU')} ₸
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        product.in_stock
                          ? 'bg-surface-container text-on-surface'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {product.in_stock ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-primary hover:text-primary-fixed transition-colors"
                      >
                        Редактировать
                      </Link>
                      <button
                        onClick={() => handleDeleteRequest(product.id, product.name)}
                        className="text-error hover:opacity-70 transition-opacity"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
