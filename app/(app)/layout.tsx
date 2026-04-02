'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [authLoading, setAuthLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthLoading(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  if (authLoading) return null

  return <>{children}</>
}