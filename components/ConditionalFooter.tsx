'use client'

import { usePathname } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import Footer from './Footer'

interface ConditionalFooterProps {
  onComingSoon?: () => void
  onScrollTo?: (id: string) => void
}

export default function ConditionalFooter({ onComingSoon, onScrollTo }: ConditionalFooterProps) {
  const { isAuthenticated, authLoading } = useUser()
  const pathname = usePathname()
  
  // Don't render anything while auth is loading to prevent flash
  if (authLoading) {
    return null
  }
  
  // Footer visibility rules
  const isLoggedIn = isAuthenticated
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
