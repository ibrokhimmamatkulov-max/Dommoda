const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem('dommoda_sid')
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem('dommoda_sid', sid)
  }
  return sid
}

async function track(event_type: string, page?: string, data?: Record<string, unknown>) {
  const session_id = getSessionId()
  if (!session_id) return
  try {
    await fetch(`${BACKEND}/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type, session_id, page, data }),
    })
  } catch {
    // не блокируем пользователя если аналитика недоступна
  }
}

export const analytics = {
  visit: (page: string) => track('visit', page),
  productView: (page: string, productName: string, brand: string) =>
    track('product_view', page, { product_name: productName, brand }),
  addToCart: (productName: string, brand: string) =>
    track('add_to_cart', undefined, { product_name: productName, brand }),
  checkoutStart: (cartTotal: number) =>
    track('checkout_start', '/checkout', { cart_total: cartTotal }),
}
