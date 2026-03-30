'use client'

import Link from 'next/link' // 1. Added the Link import

interface HeroProps {
  onScrollTo: (id: string) => void
}

export default function Hero({ onScrollTo }: HeroProps) {
  return (
    <section className="hero" id="top">
      <div className="hero-bg"></div>

      {/* Floating decoration cards */}
      <div className="hero-deco-card hdc-1">
        <div className="hdc-badge b">🤝 Connect</div>
        <div className="hdc-val b">94%</div>
        <div className="hdc-text">Marcus T. — Co-founder match</div>
        <div className="hdc-chip b">Full-stack Dev · ELO 1,340</div>
      </div>

      <div className="hero-deco-card hdc-2">
        <div className="hdc-badge g">⚔️ Compete</div>
        <div className="hdc-val g">+18 ELO</div>
        <div className="hdc-text">Won vs. DesignWolf</div>
        <div className="hdc-chip g">Now: Founder rank 🏅</div>
      </div>

      <div className="hero-deco-card hdc-3">
        <div className="hdc-badge p">📚 Learn</div>
        <div className="hdc-val p">Lesson 3</div>
        <div className="hdc-text">How to Market With No Money</div>
        <div className="hdc-meta">35% complete · 22 min left</div>
      </div>

      <div className="hero-deco-card hdc-4">
        <div className="hdc-badge o">💡 Idea</div>
        <div className="hdc-val o">7 replies</div>
        <div className="hdc-text">&ldquo;ParkShare — Airbnb for driveways&rdquo;</div>
        <div className="hdc-meta">2 co-founder requests received</div>
      </div>

      {/* Main headline */}
      <div style={{ marginBottom: '8px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)' }}>
        Built by founders, for founders
      </div>
      <h1 className="hero-h1">
        Stop watching,<br /><em>start building.</em>
      </h1>

      {/* Subtitle */}
      <p className="hero-sub">
        Share your idea, get real feedback, and join weekly founder challenges.
        Learn how to actually start a company in one focused MVP platform.
      </p>

      {/* CTA buttons - UPDATED TO USE LINK */}
      <div className="hero-actions">
        <Link 
          href="/home" 
          className="btn-cta-primary" 
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ⚡ Get Started Free
        </Link>
        <Link 
          href="/home" 
          className="btn-cta-ghost" 
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          Sign In →
        </Link>
      </div>

      {/* Social proof */}
      <div className="hero-proof">
        <span><strong>48,200</strong> founders</span>
        <span className="proof-dot"></span>
        <span><strong>2.4M</strong> founder matches</span>
        <span className="proof-dot"></span>
        <span className="live"><strong>2.4M</strong> Founder matches</span>
      </div>

      {/* Pillar cards */}
      <div className="pillar-wrapper">
        <div className="pillar-header">
          <div
            className="pillar-header-item connect"
            onClick={() => onScrollTo('connect')}
            style={{ cursor: 'pointer' }}
          >
            🤝 Connect
          </div>
          <div className="pillar-header-arrow"></div>
          <div
            className="pillar-header-item compete"
            onClick={() => onScrollTo('compete')}
            style={{ cursor: 'pointer' }}
          >
            ⚔️ Compete
          </div>
          <div className="pillar-header-arrow"></div>
          <div
            className="pillar-header-item learn"
            onClick={() => onScrollTo('learn')}
            style={{ cursor: 'pointer' }}
          >
            📚 Learn
          </div>
        </div>

        <div className="pillar-row">
          {/* CONNECT pillar card */}
          <div className="pc connect" onClick={() => onScrollTo('connect')}>
            <div className="pc-top">
              <span className="pc-icon">🤝</span>
              <span className="pc-label connect">Connect</span>
            </div>
            <div className="pc-title">Share Ideas &amp; Find Co-Founders</div>
            <p className="pc-desc">
              Post your idea, get honest feedback from other builders, and find someone to build it with.
            </p>
            <button
              className="pc-cta connect"
              onClick={(e) => { e.stopPropagation(); onScrollTo('connect') }}
            >
              Learn more →
            </button>
            <div className="pc-preview">
              <div className="pc-cf">
                <div className="pc-cf-title">Co-Founder Match · 94%</div>
                <div className="pc-cf-card">
                  <div className="pc-cf-top">
                    <div className="pc-cf-av">M</div>
                    <div className="pc-cf-name">Marcus T.</div>
                    <div className="pc-cf-tag">ELO 1,340</div>
                  </div>
                  <div className="pc-cf-match">94% skill compatibility</div>
                  <div className="pc-cf-bio">Full-stack dev looking to build in fintech or edtech.</div>
                  <div className="pc-cf-skills">
                    <div className="pc-cf-skill">React</div>
                    <div className="pc-cf-skill) skill">Python</div>
                    <div className="pc-cf-skill">Fintech</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COMPETE pillar card */}
          <div className="pc compete" onClick={() => onScrollTo('compete')}>
            <div className="pc-top">
              <span className="pc-icon">⚔️</span>
              <span className="pc-label compete">Compete</span>
            </div>
            <div className="pc-title">Ranked 1v1 Battles</div>
            <p className="pc-desc">
              Same prompt. Same clock. Community judges pick the winner. Build a rank that actually means something.
            </p>
            <button
              className="pc-cta compete"
              onClick={(e) => { e.stopPropagation(); onScrollTo('compete') }}
            >
              Learn more →
            </button>
            <div className="pc-preview">
              <div className="pc-lb">
                <div className="pc-lb-title">
                  Weekly Leaderboard
                  <div className="pc-lb-live">
                    <div className="pc-lb-dot"></div>342 live
                  </div>
                </div>
                <div className="pc-lb-row">
                  <div className="pc-lb-rank">🥇</div>
                  <div className="pc-lb-av">D</div>
                  <div className="pc-lb-name">DesignWolf</div>
                  <div className="pc-lb-elo">1,891</div>
                  <div className="pc-lb-delta">↑3</div>
                </div>
                <div className="pc-lb-row">
                  <div className="pc-lb-rank">🥈</div>
                  <div className="pc-lb-av">N</div>
                  <div className="pc-lb-name">NeonBrush</div>
                  <div className="pc-lb-elo">1,756</div>
                  <div className="pc-lb-delta">↑1</div>
                </div>
                <div className="pc-lb-row you-row">
                  <div className="pc-lb-rank" style={{ color: 'var(--green)', fontSize: '10px' }}>#47</div>
                  <div className="pc-lb-av" style={{ background: 'var(--green-mid)' }}>J</div>
                  <div className="pc-lb-name" style={{ color: 'var(--green)', fontWeight: 700 }}>you</div>
                  <div className="pc-lb-elo">1,240</div>
                  <div className="pc-lb-delta">↑4</div>
                </div>
              </div>
            </div>
          </div>

          {/* LEARN pillar card */}
          <div className="pc learn" onClick={() => onScrollTo('learn')}>
            <div className="pc-top">
              <span className="pc-icon">📚</span>
              <span className="pc-label learn">Learn</span>
            </div>
            <div className="pc-title">Free Startup Courses</div>
            <p className="pc-desc">
              Structured courses with real exercises. For the person with their first idea and no idea what to do next.
            </p>
            <button
              className="pc-cta learn"
              onClick={(e) => { e.stopPropagation(); onScrollTo('learn') }}
            >
              Learn more →
            </button>
            <div className="pc-preview">
              <div className="pc-learn">
                <div className="pc-learn-title">Current Course</div>
                <div className="pc-learn-course">
                  <div className="pc-learn-cn">How to Market With No Money</div>
                  <div className="pc-learn-bar"><div className="pc-learn-fill"></div></div>
                  <div className="pc-learn-pct">35% complete · Lesson 3 of 9</div>
                </div>
                <div className="pc-ll">
                  <div className="pc-ll-check done">✓</div>
                  <div className="pc-ll-name">Why paid ads don&apos;t work first</div>
                  <div className="pc-ll-meta">Done</div>
                </div>
                <div className="pc-ll">
                  <div className="pc-ll-check active">▶</div>
                  <div className="pc-ll-name" style={{ color: 'var(--purple)', fontWeight: 600 }}>Content that gets shared</div>
                  <div className="pc-ll-meta" style={{ color: 'var(--purple)' }}>Now</div>
                </div>
                <div className="pc-ll">
                  <div className="pc-ll-check lock">🔒</div>
                  <div className="pc-ll-name">Community-led growth</div>
                  <div className="pc-ll-meta">Locked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}