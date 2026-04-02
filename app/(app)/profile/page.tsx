'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        setAuthLoading(false)
        if (currentUser) {
          redirectToUserProfile(currentUser.id)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const redirectToUserProfile = async (userId: string) => {
    try {
      // Get username from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single()

      if (profile?.username) {
        router.replace(`/profile/${profile.username}`)
      } else {
        // User doesn't have a profile/username yet, redirect to onboarding
        router.replace('/onboarding')
      }
    } catch (error) {
      console.error('Error redirecting to profile:', error)
      router.replace('/')
    }
  }

  if (authLoading) {
    return null
  }

  if (!user) {
    router.replace('/login')
    return null
  }

  return null
}
