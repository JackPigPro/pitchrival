'use client'

import Footer from '@/components/Footer'
import { LiveStats } from '@/utils/stats'

interface LandingFooterProps {
  stats?: LiveStats
}

export default function LandingFooter({ stats }: LandingFooterProps) {
  const handleComingSoon = () => {
    // Handle coming soon functionality
    console.log('Coming soon clicked')
  }

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const elRect = el.getBoundingClientRect()
    const navOffset = 76
    if (id === 'schools') {
      window.scrollTo({ top: Math.max(0, elRect.top + window.scrollY - navOffset), behavior: 'smooth' })
      return
    }
    const elCenter = elRect.top + window.scrollY + elRect.height / 2
    const viewportCenter = window.innerHeight / 2
    window.scrollTo({ top: elCenter - viewportCenter, behavior: 'smooth' })
  }

  return (
    <Footer 
      onComingSoon={handleComingSoon} 
      onScrollTo={handleScrollTo} 
      stats={stats} 
    />
  )
}
