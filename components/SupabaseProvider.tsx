'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

type SupabaseContextType = {
  user: User | null
  authLoading: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  authLoading: true,
})

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setAuthLoading(false)
      }
    )

    // Fallback: if onAuthStateChange never fires, stop loading after 1 second
    const timeout = setTimeout(() => {
      setAuthLoading(false)
    }, 1000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  return (
    <SupabaseContext.Provider value={{ user, authLoading }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  return useContext(SupabaseContext)
}
