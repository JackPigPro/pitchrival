import { createClient } from '@/utils/supabase/server'
import TopNavClient from './TopNavClient'

export default async function TopNav() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  let name = null
  if (user) {
    // Try to get username and onboarding status from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, onboarding_complete')
      .eq('id', user.id)
      .single()
    
    // Only use username from profile if onboarding is complete
    if (profile?.onboarding_complete && profile.username) {
      name = profile.username
    }
  }

  return <TopNavClient user={user ? { email: user.email, name } : null} />
}

