import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Админ-панель — DOMMODA',
}

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return <>{children}</>
}
