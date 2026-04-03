import { createClient } from '@/utils/supabase/server'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  username: string
  display_name?: string
  status_tags?: string[]
  onboarding_complete?: boolean
  created_at: string
}

export interface AuthResult {
  user: User | null
  profile: UserProfile | null
  isFullyAuthenticated: boolean
  needsOnboarding: boolean
}

/**
 * Shared authentication logic that works consistently across server and client
 * Returns user data and authentication state based on onboarding completion
 */
export async function getAuthState(): Promise<AuthResult> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return {
      user: null,
      profile: null,
      isFullyAuthenticated: false,
      needsOnboarding: false
    }
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, display_name, status_tags, onboarding_complete, created_at')
    .eq('id', user.id)
    .single()

  const isFullyAuthenticated = !!(profile?.onboarding_complete === true)
  const needsOnboarding = !!(user && (!profile || profile.onboarding_complete !== true))

  return {
    user,
    profile: profile || null,
    isFullyAuthenticated,
    needsOnboarding
  }
}

/**
 * Server-side function to check if user should be redirected to onboarding
 */
export async function shouldRedirectToOnboarding(): Promise<boolean> {
  const { needsOnboarding } = await getAuthState()
  return needsOnboarding
}

/**
 * Server-side function to check if user is fully authenticated (completed onboarding)
 */
export async function isUserFullyAuthenticated(): Promise<boolean> {
  const { isFullyAuthenticated } = await getAuthState()
  return isFullyAuthenticated
}
