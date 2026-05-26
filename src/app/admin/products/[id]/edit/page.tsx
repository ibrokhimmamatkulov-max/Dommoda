import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProductForm } from '@/components/admin/ProductForm'
import type { AdminProduct } from '@/types/admin'

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  'https://backanddommoda.onrender.com'

interface PageProps {
  params: Promise<{ id: string }>
}

type FetchResult =
  | { ok: true; product: AdminProduct }
  | { ok: false; notFound: true }
  | { ok: false; notFound: false; error: string }

async function fetchProduct(id: string, token: string): Promise<FetchResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (response.status === 404) {
      return { ok: false, notFound: true }
    }

    if (!response.ok) {
      return { ok: false, notFound: false, error: `Ошибка сервера: ${response.status}` }
    }

    const product = (await response.json()) as AdminProduct
    return { ok: true, product }
  } catch {
    return { ok: false, notFound: false, error: 'Не удалось подключиться к серверу' }
  }
}

export default async function EditProductPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value ?? ''

  const result = await fetchProduct(id, token)

  if (!result.ok && result.notFound) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AdminHeader />

      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-on-surface mb-6">Редактировать товар</h1>

          <div className="bg-surface-container-lowest border border-outline-variant rounded p-6">
            {result.ok ? (
              <ProductForm product={result.product} />
            ) : (
              <div className="bg-error-container text-on-error-container rounded p-4 text-sm">
                {result.error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
