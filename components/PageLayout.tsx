'use client'

interface PageLayoutProps {
  children: React.ReactNode
  onComingSoon?: () => void
  onScrollTo?: (id: string) => void
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      {children}
    </>
  )
}
