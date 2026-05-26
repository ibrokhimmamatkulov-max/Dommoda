import { type NextRequest, NextResponse } from 'next/server'
import type { AdminLoginRequest, AdminLoginResponse } from '@/types/admin'

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  'https://backanddommoda.onrender.com'
const COOKIE_NAME = 'admin_token'
// 7 days in seconds
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: AdminLoginRequest
  try {
    body = (await request.json()) as AdminLoginRequest
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  let backendResponse: Response
  try {
    backendResponse = await fetch(`${BACKEND_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 })
  }

  if (!backendResponse.ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  let data: AdminLoginResponse
  try {
    data = (await backendResponse.json()) as AdminLoginResponse
  } catch {
    return NextResponse.json({ error: 'Malformed backend response' }, { status: 502 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, (data as unknown as { access_token: string }).access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })

  return response
}
