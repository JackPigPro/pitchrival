'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Testimonials from '../components/Testimonials'
import ConnectSection from '../components/ConnectSection'
import CompeteSection from '../components/CompeteSection'
import LearnSection from '../components/LearnSection'
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
        onScrollTo={scrollToCenter}
      />
      <Hero
        onScrollTo={scrollToCenter}
      />
      <Testimonials />
      <ConnectSection onComingSoon={handleShowComingSoon} />
      <CompeteSection onComingSoon={handleShowComingSoon} />
      <LearnSection onComingSoon={handleShowComingSoon} />
      <Schools onComingSoon={handleShowComingSoon} />
      <section style={{ padding: '64px 24px', backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)', backgroundSize: '48px 48px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', background: 'linear-gradient(135deg, var(--dark2), #1a2e40)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '34px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(34,197,94,.8)', marginBottom: '10px', fontFamily: 'var(--font-display)' }}>
            Final Call To Action
          </div>
          <h3 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 10px', fontFamily: 'var(--font-display)' }}>
            Ready to find your founder match?
          </h3>
          <p style={{ color: 'rgba(255,255,255,.65)', marginBottom: '18px' }}>
            Jump in, ship your first idea, and get real feedback in minutes.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/login?mode=signup" className="nav-signup" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>Sign Up Free</Link>
            <Link href="/login?mode=login" className="nav-login" style={{ textDecoration: 'none', background: 'rgba(255,255,255,.08)', color: '#fff', borderColor: 'rgba(255,255,255,.22)' }}>Sign In</Link>
          </div>
        </div>
      </section>
      <Footer
        onComingSoon={handleShowComingSoon}
        onScrollTo={scrollToCenter}
      />
    </div>
  )
}