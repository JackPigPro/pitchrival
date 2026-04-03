'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Hero from './Hero'
import Testimonials from './Testimonials'
import ConnectSection from './ConnectSection'
import CompeteSection from './CompeteSection'
import LearnSection from './LearnSection'
import Schools from './Schools'
import Footer from './Footer'
import ComingSoon from './ComingSoon'
import { LiveStats } from '@/utils/stats'

interface LandingProps {
  onComingSoon?: () => void
  onScrollTo?: (id: string) => void
  stats?: LiveStats
}

export default function Landing({ onComingSoon, onScrollTo, stats }: LandingProps = {}) {
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleShowComingSoon = useCallback(() => {
    setShowComingSoon(true)
    window.scrollTo(0, 0)
    onComingSoon?.()
  }, [onComingSoon])

  const handleShowLanding = useCallback(() => {
    setShowComingSoon(false)
    window.scrollTo(0, 0)
  }, [])

  const scrollToCenter = useCallback((id: string) => {
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
    onScrollTo?.(id)
  }, [onScrollTo])

  if (showComingSoon) {
    return <ComingSoon onBack={handleShowLanding} />
  }

  return (
    <div id="landing">
      <Hero onScrollTo={scrollToCenter} stats={stats} />
      <Testimonials />
      <ConnectSection onComingSoon={handleShowComingSoon} />
      <CompeteSection onComingSoon={handleShowComingSoon} />
      <LearnSection onComingSoon={handleShowComingSoon} />
      <Schools onComingSoon={handleShowComingSoon} />
      <Footer onComingSoon={handleShowComingSoon} onScrollTo={scrollToCenter} stats={stats} />
    </div>
  )
}

