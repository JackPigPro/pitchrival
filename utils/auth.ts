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
  // Redirect to dedicated signout page that handles the sign out process
  window.location.href = '/signout'
}

/**
 * Hook for sign out functionality with router fallback
 * Returns a signOut function that can be called from anywhere
 */
export function useSignOut() {
  const router = useRouter()
  
  return async () => {
    // Redirect to dedicated signout page that handles the sign out process
    window.location.href = '/signout'
  }
}
