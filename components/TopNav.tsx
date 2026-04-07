import { createClient } from '@/utils/supabase/server'
import TopNavClient from './TopNavClient'

export default async function TopNav({ forceLoggedOut }: { forceLoggedOut?: boolean } = {}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  let name = null
  let showLoggedOutNav = forceLoggedOut
  
  if (user && !forceLoggedOut) {
    // Try to get username and onboarding status from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, onboarding_complete')
      .eq('id', user.id)
      .single()
    
    // Only use username from profile if onboarding is complete
    // If onboarding is not complete or profile doesn't exist, show logged out navbar
    if (profile?.onboarding_complete && profile.username) {
      name = profile.username
      showLoggedOutNav = false
    } else {
      // User exists but hasn't completed onboarding or profile doesn't exist - show logged out navbar
      showLoggedOutNav = true
    }
  }

  return <TopNavClient user={user ? { email: user.email, name, username: name } : null} forceLoggedOut={showLoggedOutNav} />
}

