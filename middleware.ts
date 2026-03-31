import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

const AUTH_ROUTES = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { supabase, response } = updateSession(request)
  const { data } = await supabase.auth.getUser()
  const user = data.user
  const { pathname } = request.nextUrl

  if (!user && !AUTH_ROUTES.includes(pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  if (user && AUTH_ROUTES.includes(pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard',
    '/home',
    '/learn',
    '/profile',
    '/settings',
    '/connect/:path*',
    '/compete/:path*',
    '/login',
    '/signup',
  ],
}
