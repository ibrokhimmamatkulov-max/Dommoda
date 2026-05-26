import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AdminHeader />

      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-on-surface mb-6">Добавить товар</h1>
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-6">
            <ProductForm />
          </div>
        </div>
      </main>
    </div>
  )
}
