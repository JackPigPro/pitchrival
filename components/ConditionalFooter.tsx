'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

interface ConditionalFooterProps {
  onComingSoon?: () => void
  onScrollTo?: (id: string) => void
}

export default function ConditionalFooter({ onComingSoon, onScrollTo }: ConditionalFooterProps) {
  const pathname = usePathname()
  
  // Only show footer on specific pages
  const showFooter = pathname === '/' || pathname === '/about' || pathname === '/privacy' || pathname === '/terms' || pathname === '/contact'
  
  if (!showFooter) {
    return null
  }
  
  return <Footer onComingSoon={onComingSoon || (() => {})} onScrollTo={onScrollTo || (() => {})} />
}
