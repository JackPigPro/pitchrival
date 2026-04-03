'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LiveStats } from '@/utils/stats'
import { useLiveStats } from '@/hooks/useLiveStats'

interface FooterProps {
  onComingSoon: () => void
  onScrollTo: (id: string) => void
  stats?: LiveStats
}

export default function Footer({ onComingSoon, onScrollTo, stats: serverStats }: FooterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { stats: clientStats } = useLiveStats()
  
  // Use server stats if available (SSR), otherwise use client stats
  const stats = serverStats || clientStats

  const handleLandingNavigation = (sectionId: string) => {
    if (pathname === '/') {
      // Already on landing page, just scroll with center alignment like nav
      const el = document.getElementById(sectionId)
      if (!el) return
      const elRect = el.getBoundingClientRect()
      const navOffset = 76
      if (sectionId === 'schools') {
        window.scrollTo({ top: Math.max(0, elRect.top + window.scrollY - navOffset), behavior: 'smooth' })
        return
      }
      const elCenter = elRect.top + window.scrollY + elRect.height / 2
      const viewportCenter = window.innerHeight / 2
      window.scrollTo({ top: elCenter - viewportCenter, behavior: 'smooth' })
    } else {
      // Navigate to landing page first, then scroll
      router.push(`/#${sectionId}`)
    }
  }

  return (
    <footer className="site-footer">
      <div className="sf-top">
        {/* Brand column */}
        <div className="sf-brand">
          <div className="sf-brand-row">
            <div className="nav-logo">P</div>
            <span className="sf-brand-name">PitchRival</span>
          </div>
          <div className="sf-brand-desc">
            Share your idea. Build your rank. Find your co-founder. Learn how to do it all — free.
          </div>
          <div className="sf-stats-row">
            <div className="sf-stat">
              <div className="sf-stat-num g">{stats?.totalUsers.toLocaleString() || '48k+'}</div>
              <div className="sf-stat-label">Founders</div>
            </div>
            <div className="sf-stat">
              <div className="sf-stat-num b">{stats?.acceptedMatches.toLocaleString() || '2.4M'}</div>
              <div className="sf-stat-label">Matches</div>
            </div>
            <div className="sf-stat">
              <div className="sf-stat-num p">{stats?.totalIdeas.toLocaleString() || '18k+'}</div>
              <div className="sf-stat-label">Ideas posted</div>
            </div>
          </div>
        </div>

        {/* Explore column */}
        <div>
          <div className="sf-col-title">Explore</div>
          <div className="sf-col-links">
            <a href="#connect" onClick={(e) => { e.preventDefault(); handleLandingNavigation('connect') }}>Connect</a>
            <a href="#compete" onClick={(e) => { e.preventDefault(); handleLandingNavigation('compete') }}>Compete</a>
            <a href="#learn" onClick={(e) => { e.preventDefault(); handleLandingNavigation('learn') }}>Learn</a>
            <a href="#schools" onClick={(e) => { e.preventDefault(); handleLandingNavigation('schools') }}>Schools</a>
          </div>
        </div>

        {/* Company column */}
        <div>
          <div className="sf-col-title">Company</div>
          <div className="sf-col-links">
            <Link href="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>About PitchRival</Link>
            <Link href="/privacy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Privacy Policy</Link>
            <Link href="/terms" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Terms of Service</Link>
            <Link href="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Contact</Link>
          </div>
        </div>
      </div>

      <div className="sf-bottom">
        <div className="sf-copy">© 2026 PitchRival. All rights reserved.</div>
        <div className="sf-tagline">Built by founders, for founders.</div>
        <div className="sf-socials">
          <a className="sf-social" href="#" onClick={(e) => { e.preventDefault(); onComingSoon() }} title="X">𝕏</a>
          <a className="sf-social" href="#" onClick={(e) => { e.preventDefault(); onComingSoon() }} title="Instagram">📸</a>
          <a className="sf-social" href="#" onClick={(e) => { e.preventDefault(); onComingSoon() }} title="LinkedIn">in</a>
          <a className="sf-social" href="#" onClick={(e) => { e.preventDefault(); onComingSoon() }} title="TikTok">♪</a>
        </div>
      </div>
    </footer>
  )
}
