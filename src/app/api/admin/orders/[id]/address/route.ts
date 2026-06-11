import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  'https://backanddommoda.onrender.com'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/orders/${id}/address`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: res.status })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 })
  }
}
