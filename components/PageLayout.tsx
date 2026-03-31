'use client'

import ConditionalFooter from './ConditionalFooter'

interface PageLayoutProps {
  children: React.ReactNode
  onComingSoon?: () => void
  onScrollTo?: (id: string) => void
}

export default function PageLayout({ children, onComingSoon, onScrollTo }: PageLayoutProps) {
  return (
    <>
      {children}
      <ConditionalFooter onComingSoon={onComingSoon} onScrollTo={onScrollTo} />
    </>
  )
}
