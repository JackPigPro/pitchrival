'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Hero from './Hero'
import Testimonials from './Testimonials'
import ConnectSection from './ConnectSection'
import CompeteSection from './CompeteSection'
import LearnSection from './LearnSection'
import Schools from './Schools'
import ConditionalFooter from './ConditionalFooter'
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
          padding: '120px 24px 86px',
          backgroundImage:
            'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ marginBottom: '10px', fontSize: '13px', letterSpacing: '2.4px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Built by founders, for founders
          </div>
          <h3
            style={{
              fontSize: '78px',
              fontWeight: 800,
              letterSpacing: '-3.5px',
              lineHeight: '.95',
              margin: '0 0 20px',
              color: 'var(--text)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Stop watching,<br />
            <span style={{ color: 'var(--green)' }}>start building.</span>
          </h3>
          <p style={{ color: 'var(--text2)', marginBottom: '28px', fontSize: '18px', lineHeight: 1.65 }}>
            Share your idea, get real feedback, and join weekly founder challenges.
            Learn how to actually start a company in one focused MVP platform.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
              Sign In →
            </Link>
          </div>
        </div>
      </section>
      <ConditionalFooter onComingSoon={handleShowComingSoon} onScrollTo={scrollToCenter} />
    </div>
  )
}

