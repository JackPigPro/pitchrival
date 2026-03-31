'use client'

import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import Footer from './Footer'

interface ConditionalFooterProps {
  onComingSoon?: () => void
  onScrollTo?: (id: string) => void
}

export default function ConditionalFooter({ onComingSoon, onScrollTo }: ConditionalFooterProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    
    checkUser()
    
    const { data: { subscription } } = createClient().auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  // Footer visibility rules
  const isLoggedIn = Boolean(user)
  let showFooter = false
  
  if (!isLoggedIn) {
    // When logged out: show footer on every page
    showFooter = true
  } else {
    // When logged in: only show on specific pages
    showFooter = pathname === '/about' || pathname === '/privacy' || pathname === '/terms' || pathname === '/contact'
  }
  
  if (!showFooter) {
    return null
  }
  
  return <Footer onComingSoon={onComingSoon || (() => {})} onScrollTo={onScrollTo || (() => {})} />
}
