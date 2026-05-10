import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  
  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
  }
  
  try {
    const supabase = await createClient()
    
    // Try to get user by email from Supabase auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (!listError && users) {
      const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase())
      if (user && user.identities && user.identities.length > 0) {
        // Check if any identity is from Google provider
        const hasGoogleIdentity = user.identities.some(identity => identity.provider === 'google')
        const hasEmailIdentity = user.identities.some(identity => identity.provider === 'email')
        
        if (hasGoogleIdentity) return NextResponse.json({ authMethod: 'google' })
        if (hasEmailIdentity) return NextResponse.json({ authMethod: 'email' })
      }
    }
    
    // Fallback: check profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('auth_method')
      .eq('email', email.toLowerCase())
      .single()
    
    if (profile?.auth_method) {
      return NextResponse.json({ authMethod: profile.auth_method })
    }
    
    return NextResponse.json({ authMethod: null })
  } catch (error) {
    console.error('Auth method check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
