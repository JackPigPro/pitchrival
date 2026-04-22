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
            <div className="nav-logo">B</div>
            <span className="sf-brand-name">BizYip</span>
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
            <Link href="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>About BizYip</Link>
            <Link href="/privacy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Privacy Policy</Link>
            <Link href="/terms" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Terms of Service</Link>
            <Link href="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Contact</Link>
          </div>
        </div>
      </div>

      <div className="sf-bottom">
        <div className="sf-copy">© 2026 BizYip. All rights reserved.</div>
        <div className="sf-tagline">Built by founders, for founders.</div>
        <div className="sf-socials">
          <a className="sf-social" href="#" onClick={(e) => { e.preventDefault(); onComingSoon() }} title="X">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a className="sf-social" href="#" onClick={(e) => { e.preventDefault(); onComingSoon() }} title="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
