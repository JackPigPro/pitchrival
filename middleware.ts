import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = updateSession(request)
  const { data } = await supabase.auth.getUser()
  const user = data.user
  const { pathname, search } = request.nextUrl

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
    '/onboarding',
  ],
}
