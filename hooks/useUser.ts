'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  username: string
  display_name?: string
  status_tags?: string[]
  created_at: string
}

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
  const isAuthenticated = !!user

  // Convenience properties
  const username = profile?.username
  const display_name = profile?.display_name
  const status_tags = profile?.status_tags

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    // Add timeout to prevent authLoading from getting stuck
    const authTimeout = setTimeout(() => {
      if (mounted && authLoading) {
        console.log('⏰ [useUser] Auth check timeout, setting authLoading to false')
        setAuthLoading(false)
        setLoading(false)
      }
    }, 8000) // 8 second timeout

    // Get initial session immediately
    console.log('🔍 [useUser] Getting initial session...')
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        console.log('📡 [useUser] Session received:', { 
          hasSession: !!session, 
          userId: session?.user?.id 
        })
        
        const user = session?.user ?? null
        setUser(user)
        setAuthLoading(false)
        
        if (user) {
          console.log('🚀 [useUser] User authenticated, fetching user data...')
          fetchUserData(user.id)
        } else {
          console.log('🚫 [useUser] No user session')
          setLoading(false)
        }
        
        // Clear timeout if session resolves
        clearTimeout(authTimeout)
      }
    }).catch((err) => {
      console.error('❌ [useUser] Error getting session:', err)
      if (mounted) {
        setAuthLoading(false)
        setLoading(false)
        clearTimeout(authTimeout)
      }
    })

    // Listen for future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        console.log('🔄 [useUser] Auth state changed:', { event, hasSession: !!session })
        
        const user = session?.user ?? null
        setUser(user)
        setAuthLoading(false)
        
        if (user && event !== 'INITIAL_SESSION') {
          console.log('🚀 [useUser] User authenticated, fetching user data...')
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
      clearTimeout(authTimeout)
      subscription.unsubscribe()
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
      const [profileResult, eloResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, username, display_name, status_tags, created_at')
          .eq('id', userId)
          .single(),
        supabase
          .from('user_stats')
          .select('elo')
          .eq('user_id', userId)
          .single()
      ])

      // Debug both query results
      console.log('Profile result - data:', profileResult.data, 'error:', profileResult.error)
      console.log('ELO result - data:', eloResult.data, 'error:', eloResult.error)

      // Log errors for debugging
      if (profileResult.error) {
        console.error('Error fetching profile:', profileResult.error)
      }
      if (eloResult.error) {
        console.error('Error fetching user stats/ELO:', eloResult.error)
      }

      const newProfile = profileResult.data || null
      const newElo = eloResult.data || null

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
