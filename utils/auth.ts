'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

/**
 * Sign out the current user and redirect to the landing page.
 * This function handles the complete sign out flow including:
 * - Calling Supabase signOut
 * - Clearing any local state/caches
 * - Redirecting to the landing page
 * 
 * Use this function instead of directly calling supabase.auth.signOut()
 * to ensure consistent sign out behavior across the app.
 */
export async function signOutUser() {
  console.log('Starting sign out process...')
  try {
    const supabase = createClient()
    
    // Add timeout so it never hangs
    await Promise.race([
      supabase.auth.signOut(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ])
  } catch (error) {
    console.error('Sign out error:', error)
  } finally {
    // Always redirect regardless of whether signOut succeeded
    window.location.href = '/'
  }
}

/**
 * Hook for sign out functionality with router fallback
 * Returns a signOut function that can be called from anywhere
 */
export function useSignOut() {
  const router = useRouter()
  
  return async () => {
    const supabase = createClient()
    
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Full page refresh to ensure middleware sees updated auth state
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      // Fallback to router navigation
      router.push('/')
      router.refresh()
    }
  }
}
