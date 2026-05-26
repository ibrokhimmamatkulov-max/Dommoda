import { NextResponse } from 'next/server'

const COOKIE_NAME = 'admin_token'

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
