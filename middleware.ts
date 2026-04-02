import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = updateSession(request)
  const { data } = await supabase.auth.getUser()
  const user = data.user
  const { pathname, search } = request.nextUrl

  // Redirect authenticated users from root to dashboard - FIRST check
  if (pathname === '/' && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // Check authentication for protected routes (except /onboarding)
  const protectedRoutes = [
    '/compete',
    '/connect',
    '/profile',
    '/settings',
    '/learn',
    '/schools',
    '/admin',
    '/dashboard',
  ]
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }
  
  // Redirect authenticated users away from /login
  if (pathname === '/login' && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect users who have completed onboarding away from /onboarding
  if (pathname === '/onboarding' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', user.id)
      .single()

    if (profile?.onboarding_complete) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/',
    '/onboarding',
    '/signout',
    '/compete/:path*',
    '/connect/:path*',
    '/profile/:path*',
    '/settings',
    '/learn',
    '/schools',
    '/admin/:path*',
    '/dashboard',
  ],
}
