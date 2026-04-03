'use client'

import { usePathname } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import Footer from './Footer'

interface ConditionalFooterProps {
  onComingSoon?: () => void
  onScrollTo?: (id: string) => void
}

export default function ConditionalFooter({ onComingSoon, onScrollTo }: ConditionalFooterProps) {
  const { isAuthenticated, authLoading, profile } = useUser()
  const pathname = usePathname()
  
  // Don't render anything while auth is loading to prevent flash, EXCEPT on landing page
  if (authLoading && pathname !== '/') {
    return null
  }
  
  // Footer visibility rules
  const isLoggedIn = isAuthenticated
  const onboardingComplete = profile?.onboarding_complete === true
  let showFooter = false
  
  if (!isLoggedIn) {
    // When logged out: show footer on every page
    showFooter = true
  } else {
    // When logged in: only show footer on specific public routes
    const publicPages = ['/', '/terms', '/privacy', '/login', '/signup']
    const isPublicPage = publicPages.includes(pathname)
    showFooter = isPublicPage
  }
  
  if (!showFooter) {
    return null
  }
  
  return <Footer onComingSoon={onComingSoon || (() => {})} onScrollTo={onScrollTo || (() => {})} />
}
