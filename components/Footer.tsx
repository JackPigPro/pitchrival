'use client'

import Link from 'next/link'

interface FooterProps {
  onComingSoon: () => void
  onScrollTo: (id: string) => void
}

export default function Footer({ onComingSoon, onScrollTo }: FooterProps) {
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
              <div className="sf-stat-num g">48k+</div>
              <div className="sf-stat-label">Founders</div>
            </div>
            <div className="sf-stat">
              <div className="sf-stat-num b">2.4M</div>
              <div className="sf-stat-label">Matches</div>
            </div>
            <div className="sf-stat">
              <div className="sf-stat-num p">18k+</div>
              <div className="sf-stat-label">Weekly competitors active</div>
            </div>
          </div>
        </div>

        {/* Explore column */}
        <div>
          <div className="sf-col-title">Explore</div>
          <div className="sf-col-links">
            <a href="#connect" onClick={(e) => { e.preventDefault(); onScrollTo('connect') }}>Connect</a>
            <a href="#compete" onClick={(e) => { e.preventDefault(); onScrollTo('compete') }}>Compete</a>
            <a href="#learn" onClick={(e) => { e.preventDefault(); onScrollTo('learn') }}>Learn</a>
            <a href="#schools" onClick={(e) => { e.preventDefault(); onScrollTo('schools') }}>Schools</a>
          </div>
        </div>

        {/* Company column */}
        <div>
          <div className="sf-col-title">Company</div>
          <div className="sf-col-links">
            <Link href="/about">About PitchRival</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Contact</Link>
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
