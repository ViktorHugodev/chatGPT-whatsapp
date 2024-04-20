import { JWT, getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
type Config = any
type RouteHandler = (
  request: NextRequest,
  token: JWT,
  config: Config,
) => Promise<NextResponse | Response> | NextResponse | Response
export function withAuth(routeHandler: RouteHandler) {
  // console.log('🚀 ~ withAuth ~ routeHandler:', routeHandler)

  return async function (req: NextRequest, config: Config) {
    console.log('🚀 ~ config:', config)
    const token = await getToken({ req })
    console.log('🚀 ~ token:', token)
    if (!token) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }
    return routeHandler(req, token, config)
  }
}
