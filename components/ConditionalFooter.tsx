'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

interface ConditionalFooterProps {
  onComingSoon?: () => void
  onScrollTo?: (id: string) => void
}

export default function ConditionalFooter({ onComingSoon, onScrollTo }: ConditionalFooterProps) {
  const pathname = usePathname()
  
  // Footer visibility rules based on pathname only
  const publicPages = ['/', '/terms', '/privacy', '/login', '/signup']
  const showFooter = publicPages.some(page => pathname.startsWith(page))
  
  if (!showFooter) {
    return null
  }
  
  return <Footer onComingSoon={onComingSoon || (() => {})} onScrollTo={onScrollTo || (() => {})} />
}
