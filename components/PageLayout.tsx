'use client'

import ConditionalFooter from './ConditionalFooter'
import { useRouter, usePathname } from 'next/navigation'

interface PageLayoutProps {
  children: React.ReactNode
  onComingSoon?: () => void
  onScrollTo?: (id: string) => void
}

export default function PageLayout({ children, onComingSoon, onScrollTo }: PageLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLandingNavigation = (sectionId: string) => {
    if (pathname === '/') {
      // Already on landing page, just scroll
      onScrollTo?.(sectionId)
    } else {
      // Navigate to landing page first, then scroll
      router.push(`/#${sectionId}`)
    }
  }

  return (
    <>
      {children}
      <ConditionalFooter 
        onComingSoon={onComingSoon || (() => {})} 
        onScrollTo={handleLandingNavigation}
      />
    </>
  )
}
