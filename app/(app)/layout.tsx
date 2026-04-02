'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [authLoading, setAuthLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      await supabase.auth.getUser()
      setAuthLoading(false)
    }
    init()
  }, [])

  if (authLoading) return null

  return <>{children}</>
}