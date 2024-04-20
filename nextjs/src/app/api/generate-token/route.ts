import { NextRequest, NextResponse } from 'next/server'
import { encode } from 'next-auth/jwt'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = {
    name: 'admin',
    sub: body.user_id ?? 'fe0c88fc-00a9-420a-99c0-f7fcd1162697',
  }

  const secret = process.env.NEXTAUTH_SECRET as string

  const token = await encode({
    secret,
    token: user,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
  return NextResponse.json({ token })
}
