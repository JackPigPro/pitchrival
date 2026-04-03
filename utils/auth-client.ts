import { createClient } from '@/utils/supabase/client'
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

// Track ongoing auth requests to prevent duplicates
let ongoingAuthRequest: Promise<AuthResult> | null = null

/**
 * Client-side authentication logic that matches server-side behavior
 * Returns user data and authentication state based on onboarding completion
 */
export async function getAuthStateClient(): Promise<AuthResult> {
  // If there's already an ongoing request, return it
  if (ongoingAuthRequest) {
    return ongoingAuthRequest
  }

  // Create new request and store it
  ongoingAuthRequest = (async () => {
    try {
      const supabase = createClient()
      
      // Get current user with retry logic for lock conflicts
      let user: User | null = null
      let userError: any = null
      let retries = 0
      const maxRetries = 3

      while (retries < maxRetries) {
        try {
          const result = await supabase.auth.getUser()
          user = result.data.user
          userError = result.error
          break
        } catch (err: any) {
          retries++
          if (err.message?.includes('lock') && retries < maxRetries) {
            // Lock conflict, wait and retry
            await new Promise(resolve => setTimeout(resolve, 100 * retries))
            continue
          }
          throw err
        }
      }
      
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
    } finally {
      // Clear the ongoing request when done
      ongoingAuthRequest = null
    }
  })()

  return ongoingAuthRequest
}
