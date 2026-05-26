import { cookies } from 'next/headers'
import Link from 'next/link'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProductsTable } from '@/components/admin/ProductsTable'
import type { AdminProduct, AdminProductsResponse } from '@/types/admin'

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  'https://backanddommoda.onrender.com'

type FetchResult =
  | { ok: true; products: AdminProduct[] }
  | { ok: false; error: string }

async function fetchProducts(token: string): Promise<FetchResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/products`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      return { ok: false, error: `Ошибка сервера: ${response.status}` }
    }

    const data = (await response.json()) as AdminProductsResponse
    return { ok: true, products: data.products }
  } catch {
    return { ok: false, error: 'Не удалось подключиться к серверу' }
  }
}

export default async function AdminDashboardPage(): Promise<React.JSX.Element> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value ?? ''

  const result = await fetchProducts(token)

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AdminHeader />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-on-surface">Товары</h1>
            <Link
              href="/admin/products/new"
              className="bg-primary text-on-primary text-sm font-medium py-2 px-4 rounded hover:bg-primary-container transition-colors"
            >
              Добавить товар
            </Link>
          </div>

          {result.ok ? (
            <ProductsTable products={result.products} />
          ) : (
            <div className="bg-error-container text-on-error-container rounded p-4 text-sm">
              {result.error}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
