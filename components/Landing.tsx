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

export default function Landing() {
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleShowComingSoon = useCallback(() => {
    setShowComingSoon(true)
    window.scrollTo(0, 0)
  }, [])

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
  }, [])

  if (showComingSoon) {
    return <ComingSoon onBack={handleShowLanding} />
  }

  return (
    <div id="landing">
      <Hero onScrollTo={scrollToCenter} />
      <Testimonials />
      <ConnectSection onComingSoon={handleShowComingSoon} />
      <CompeteSection onComingSoon={handleShowComingSoon} />
      <LearnSection onComingSoon={handleShowComingSoon} />
      <Schools onComingSoon={handleShowComingSoon} />
      <section
        style={{
          padding: '64px 24px',
          backgroundImage:
            'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      >
        <div
          style={{
            maxWidth: '980px',
            margin: '0 auto',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            padding: '34px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3
            style={{
              fontSize: '52px',
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: 1.02,
              margin: '0 0 14px',
              color: 'var(--text)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Stop watching,<br />start building.
          </h3>
          <p style={{ color: 'var(--text2)', marginBottom: '20px', fontWeight: 600 }}>
            Jump in, ship your first idea, and get real feedback in minutes.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              href="/login?mode=signup"
              className="btn-cta-primary"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ⚡ Get Started Free
            </Link>
            <Link
              href="/login?mode=login"
              className="btn-cta-ghost"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <Footer onComingSoon={handleShowComingSoon} onScrollTo={scrollToCenter} />
    </div>
  )
}

