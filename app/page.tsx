'use client'

import { useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ConnectSection from '../components/ConnectSection'
import CompeteSection from '../components/CompeteSection'
import LearnSection from '../components/LearnSection'
import Testimonials from '../components/Testimonials'
import Pricing from '../components/Pricing'
import Schools from '../components/Schools'
import Footer from '../components/Footer'
import ComingSoon from '../components/ComingSoon'

export default function Home() {
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleShowComingSoon = useCallback(() => {
    setShowComingSoon(true)
    window.scrollTo(0, 0)
  }, [])

  const handleShowLanding = useCallback(() => {
    setShowComingSoon(false)
    window.scrollTo(0, 0)
  }, [])

  // Scrolls a section element to the vertical center of the viewport
  const scrollToCenter = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const elRect = el.getBoundingClientRect()
    const elCenter = elRect.top + window.scrollY + elRect.height / 2
    const viewportCenter = window.innerHeight / 2
    window.scrollTo({ top: elCenter - viewportCenter, behavior: 'smooth' })
  }, [])

  if (showComingSoon) {
    return <ComingSoon onBack={handleShowLanding} />
  }

  return (
    <div id="landing">
      <Navbar
        onComingSoon={handleShowComingSoon}
        onScrollTo={scrollToCenter}
      />
      <Hero
        onComingSoon={handleShowComingSoon}
        onScrollTo={scrollToCenter}
      />
      <ConnectSection onComingSoon={handleShowComingSoon} />
      <CompeteSection onComingSoon={handleShowComingSoon} />
      <LearnSection onComingSoon={handleShowComingSoon} />
      <Testimonials />
      <Pricing
        onComingSoon={handleShowComingSoon}
        onScrollTo={scrollToCenter}
      />
      <Schools onComingSoon={handleShowComingSoon} />
      <Footer
        onComingSoon={handleShowComingSoon}
        onScrollTo={scrollToCenter}
      />
    </div>
  )
}