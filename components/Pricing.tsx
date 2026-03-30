'use client'

interface PricingProps {
  onComingSoon: () => void
  onScrollTo: (id: string) => void
}

export default function Pricing({ onComingSoon, onScrollTo }: PricingProps) {
  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-inner">
        <div className="section-label" style={{ textAlign: 'center' }}>Pricing</div>
        <div className="section-title" style={{ textAlign: 'center', maxWidth: '100%' }}>
          Simple, honest pricing.
        </div>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 52px' }}>
          The real product is free forever. Premium gives you the extra tools to go further, faster.
        </p>

        <div className="pricing-grid">
          {/* FREE tier */}
          <div className="pricing-card">
            <div className="pricing-tier">Free</div>
            <div className="pricing-name">Starter</div>
            <div className="pricing-price">
              <span className="pricing-amount">$0</span>
            </div>
            <div className="pricing-yearly" style={{ color: 'var(--text3)' }}>
              Free forever · No credit card ever
            </div>
            <div className="pricing-divider"></div>

            <div style={{ marginBottom: '16px' }}>
              <div className="pricing-group-label">What you unlock</div>
              <div className="pricing-unlock-strip">
                <div className="pus-item unlocked"><div className="pus-icon">⚔️</div><div className="pus-label">All 10 Modes</div></div>
                <div className="pus-item unlocked"><div className="pus-icon">📊</div><div className="pus-label">ELO + Ranks</div></div>
                <div className="pus-item unlocked"><div className="pus-icon">📚</div><div className="pus-label">All Courses</div></div>
                <div className="pus-item unlocked"><div className="pus-icon">🤝</div><div className="pus-label">Co-founder Browse</div></div>
                <div className="pus-item locked"><div className="pus-icon">📈</div><div className="pus-label">Analytics</div></div>
                <div className="pus-item locked"><div className="pus-icon">🎯</div><div className="pus-label">Radar</div></div>
              </div>
            </div>

            <div className="pricing-feature-list">
              <div className="pf"><div className="pf-check g">✓</div><span>Full access to all 10 game modes</span></div>
              <div className="pf"><div className="pf-check g">✓</div><span>ELO rating system &amp; all 8 rank tiers</span></div>
              <div className="pf"><div className="pf-check g">✓</div><span>All 6 courses, free forever</span></div>
              <div className="pf"><div className="pf-check g">✓</div><span>Community feed &amp; co-founder browse</span></div>
              <div className="pf">
                <div className="pf-check dim">—</div>
                <span style={{ color: 'var(--text3)' }}>Up to 3 ideas on idea board</span>
              </div>
              <div className="pf">
                <div className="pf-check dim">—</div>
                <span style={{ color: 'var(--text3)' }}>Basic match history only</span>
              </div>
            </div>

            <button className="pricing-cta free" onClick={onComingSoon}>Start for Free →</button>
          </div>

          {/* PREMIUM tier */}
          <div className="pricing-card featured">
            <div className="pricing-badge">Most Popular</div>
            <div className="pricing-tier g">Premium</div>
            <div className="pricing-name">Pro Founder</div>
            <div className="pricing-price">
              <span className="pricing-amount">$8</span>
              <span className="pricing-period">/month</span>
            </div>
            <div className="pricing-yearly">or $72/year — save 25% · 7-day free trial</div>
            <div className="pricing-divider"></div>

            <div style={{ marginBottom: '16px' }}>
              <div className="pricing-group-label">Everything unlocked</div>
              <div className="pricing-unlock-strip">
                <div className="pus-item unlocked"><div className="pus-icon">⚔️</div><div className="pus-label">All 10 Modes</div></div>
                <div className="pus-item unlocked"><div className="pus-icon">📊</div><div className="pus-label">ELO + Ranks</div></div>
                <div className="pus-item unlocked"><div className="pus-icon">📚</div><div className="pus-label">All Courses</div></div>
                <div className="pus-item unlocked"><div className="pus-icon">🤝</div><div className="pus-label">Co-founder Browse</div></div>
                <div className="pus-item unlocked"><div className="pus-icon">📈</div><div className="pus-label">Analytics</div></div>
                <div className="pus-item unlocked"><div className="pus-icon">🎯</div><div className="pus-label">Radar</div></div>
              </div>
            </div>

            <div className="pricing-feature-list">
              <div className="pf"><div className="pf-check g">✓</div><span>Everything in Starter</span></div>
              <div className="pf"><div className="pf-check g">✓</div><span>Unlimited idea board</span></div>
              <div className="pf"><div className="pf-check b">✓</div><span>Advanced match analytics &amp; full replay</span></div>
              <div className="pf"><div className="pf-check b">✓</div><span>Co-founder Radar — advanced matching filters</span></div>
              <div className="pf"><div className="pf-check p">✓</div><span>Tournament priority registration</span></div>
              <div className="pf"><div className="pf-check p">✓</div><span>Schools dashboard for educators</span></div>
              <div className="pf"><div className="pf-check g">✓</div><span>Early access to new game modes</span></div>
            </div>

            <button className="pricing-cta premium" onClick={onComingSoon}>
              Start 7-Day Free Trial →
            </button>
          </div>
        </div>

        <div className="pricing-note">
          Running a class?{' '}
          <a href="#schools" onClick={(e) => { e.preventDefault(); onScrollTo('schools') }}>
            Schools &amp; Teams →
          </a>{' '}
          — class dashboards, bulk licenses, teacher controls.
        </div>
      </div>
    </section>
  )
}
