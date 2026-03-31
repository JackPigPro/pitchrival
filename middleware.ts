import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = updateSession(request)
  const { data } = await supabase.auth.getUser()
  const user = data.user
  const { pathname, search } = request.nextUrl

  if (!user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`
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
  ],
}
