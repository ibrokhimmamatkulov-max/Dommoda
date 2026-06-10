import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { OrderStatusBar } from '@/components/order/OrderStatusBar'
import { CurrencyInit } from '@/components/CurrencyInit'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DOMMODA — Модная одежда с доставкой в Таджикистан',
  description:
    'Заказывайте одежду ведущих мировых брендов с доставкой в Душанбе и другие города Таджикистана.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={inter.className}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="antialiased bg-background text-on-background">
        {children}
        <CurrencyInit />
        <OrderStatusBar />
      </body>
    </html>
  )
}
