'use client'

import { useState, useEffect } from 'react'
import { getAuthStateClient, type UserProfile } from '@/utils/auth-client'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserElo {
  elo?: number
}

interface UserCache {
  profile: UserProfile | null
  elo: UserElo | null
  timestamp: number
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const userCache = new Map<string, UserCache>()

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [elo, setElo] = useState<UserElo | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Combined loading state for convenience
  const isLoading = loading || authLoading
  // Use the same logic as server-side - user is only authenticated if onboarding is complete
  const isAuthenticated = !!user && !!profile && profile.onboarding_complete === true

  // Convenience properties
  const username = profile?.username
  const display_name = profile?.display_name
  const status_tags = profile?.status_tags

  useEffect(() => {
    let mounted = true
    let retryCount = 0
    const maxRetries = 3
    const supabase = createClient()

    // Listen for auth state changes from other tabs
    const broadcastChannel = new BroadcastChannel('auth-sync')
    
    broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'AUTH_STATE_CHANGED' && mounted) {
        // Force refresh when another tab changes auth state
        getSessionWithRetry()
      }
    }

    const getSessionWithRetry = async () => {
      try {
        console.log('🔍 [useUser] Getting auth state...')
        // Use shared auth logic to get consistent state
        const authState = await getAuthStateClient()
        console.log('🔍 [useUser] Auth state received:', { 
          hasUser: !!authState.user, 
          hasProfile: !!authState.profile, 
          onboardingComplete: authState.profile?.onboarding_complete 
        })
        
        if (mounted) {
          setUser(authState.user)
          setProfile(authState.profile)
          setAuthLoading(false)
          console.log('🔍 [useUser] authLoading set to false')
          
          if (authState.user) {
            fetchUserData(authState.user.id)
          } else {
            setLoading(false)
          }
        }
      } catch (err: any) {
        // Don't log lock conflicts as errors - they're expected with multiple tabs
        if (!err.message?.includes('lock')) {
          console.error('❌ [useUser] Error getting auth state:', err)
        }
        
        retryCount++
        console.log('🔍 [useUser] Retry count:', retryCount, 'Max retries:', maxRetries)
        
        if (retryCount < maxRetries && mounted) {
            setTimeout(getSessionWithRetry, 1000 * retryCount) // Exponential backoff
        } else {
          if (mounted) {
            // On auth errors, ensure user is treated as logged out
            setUser(null)
            setProfile(null)
            setAuthLoading(false)
            setLoading(false)
            console.log('🔍 [useUser] Max retries reached, setting authLoading to false')
          }
        }
      }
    }

    // Initial session check
    getSessionWithRetry()

    // Listen for future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (mounted) {
        const user = session?.user ?? null
        setUser(user)
        setAuthLoading(false)
        
        // Notify other tabs of auth state change
        broadcastChannel.postMessage({ type: 'AUTH_STATE_CHANGED' })
        
        if (user && event !== 'INITIAL_SESSION') {
          await fetchUserData(user.id)
        } else if (!user) {
          // Clear user data on logout
          setProfile(null)
          setElo(null)
          setLoading(false)
          // Clear all cache on logout
          userCache.clear()
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
      broadcastChannel.close()
    }
  }, [])

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Check cache first - only use if all values are non-null
      const cached = userCache.get(userId)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL && cached.profile && cached.elo) {
        setProfile(cached.profile)
        setElo(cached.elo)
        setLoading(false)
        return
      }

      // Fetch fresh data
      const profileResult = await supabase
        .from('profiles')
        .select('id, username, display_name, status_tags, onboarding_complete, is_teacher, teacher_verified, created_at')
        .eq('id', userId)
        .single()

      let eloResult = null
      try {
        eloResult = await supabase
          .from('user_stats')
          .select('elo')
          .eq('user_id', userId)
          .single()
      } catch (err) {
        // user_stats table doesn't exist, that's okay
        console.log('user_stats table not found, skipping ELO fetch')
      }

      const newProfile = profileResult.data || null
      const newElo = eloResult?.data || null

      // Update cache
      userCache.set(userId, {
        profile: newProfile,
        elo: newElo,
        timestamp: Date.now()
      })

      // Update state
      setProfile(newProfile)
      setElo(newElo)
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    if (user) {
      // Clear cache for this user
      userCache.delete(user.id)
      await fetchUserData(user.id)
    }
  }

  const invalidateCache = () => {
    if (user) {
      userCache.delete(user.id)
    }
  }

  return {
    // Core data
    user,
    profile,
    elo,
    
    // Convenience properties
    username,
    display_name,
    status_tags,
    
    // State
    loading,
    authLoading,
    isLoading,
    isAuthenticated,
    error,
    
    // Actions
    refresh,
    invalidateCache
  }
}

// Helper functions for cache management
export function clearUserCache() {
  userCache.clear()
}

export function invalidateUserCache(userId: string) {
  userCache.delete(userId)
}
