import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  'https://backanddommoda.onrender.com'

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/settings/banner`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update banner' }, { status: response.status })
    }

    const data: unknown = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 })
  }
}
