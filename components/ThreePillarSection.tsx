'use client'

import Link from 'next/link'

export default function ThreePillarSection() {
  return (
    <div id="pillars" className="feature-section fs-pillars">
      <div className="fs-label b">🚀 Platform</div>

      {/* Three equal width columns - no left text */}
      <div className="pillar-row" style={{ display: 'flex', justifyContent: 'center', gap: '0px', maxWidth: '100%', margin: '0 auto' }}>
        
        {/* COMPETE pillar card */}
        <div className="pc compete" style={{ flex: 1, minWidth: '360px', maxWidth: '400px' }}>
          <div className="pc-top">
            <span className="pc-icon">⚔️</span>
            <span className="pc-label compete">Compete</span>
          </div>
          <div className="pc-title">Live 1v1 &amp; Daily Bellringers</div>
          <p className="pc-desc" style={{ maxWidth: '280px', margin: '0 auto 12px' }}>
            Battle in real-time competitions and submit answers to daily challenges to climb the ELO leaderboard.
          </p>
          <div className="pc-preview" style={{ margin: '0 -16px', display: 'flex', justifyContent: 'center' }}>
            <div className="pc-lb" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
              <div className="pc-lb-title">
                Live Battle Now
              </div>
              <div className="pc-lb-card">
                <div className="pc-lb-top">
                  <div className="pc-lb-av">D</div>
                  <div className="pc-lb-name">DesignWolf</div>
                </div>
                <div className="pc-lb-status">
                  <div className="pc-lb-indicator">🔴 LIVE</div>
                  <div className="pc-lb-time">2:34</div>
                </div>
                <div className="pc-lb-topic">"AI-powered study tools for teens"</div>
              </div>
            </div>
          </div>
          <Link href="/login?mode=signup" className="pc-cta compete" style={{ textDecoration: 'none' }}>
            Start Competing →
          </Link>
        </div>

        {/* CREATE pillar card */}
        <div className="pc create" style={{ flex: 1, minWidth: '360px', maxWidth: '400px' }}>
          <div className="pc-top">
            <span className="pc-icon">💡</span>
            <span className="pc-label create">Create</span>
          </div>
          <div className="pc-title">Share Ideas &amp; Find Co-Founders</div>
          <p className="pc-desc" style={{ maxWidth: '280px', margin: '0 auto 12px' }}>
            Post your startup idea, get real feedback from other builders, and find someone to build it with.
          </p>
          <div className="pc-preview" style={{ margin: '0 -16px', display: 'flex', justifyContent: 'center' }}>
            <div className="pc-cf" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
              <div className="pc-cf-title">Co-Founder Match</div>
              <div className="pc-cf-card">
                <div className="pc-cf-top">
                  <div className="pc-cf-av">M</div>
                  <div className="pc-cf-name">Marcus T.</div>
                </div>
                <div className="pc-cf-bio">Looking for a developer to create mobile apps.</div>
                <div className="pc-cf-skills">
                  <div className="pc-cf-skill">Finance</div>
                  <div className="pc-cf-skill">Design</div>
                  <div className="pc-cf-skill">Sales</div>
                </div>
              </div>
            </div>
          </div>
          <Link href="/login?mode=signup" className="pc-cta connect" style={{ textDecoration: 'none' }}>
            Share Ideas →
          </Link>
        </div>

        {/* CONNECT pillar card */}
        <div className="pc connect" style={{ flex: 1, minWidth: '360px', maxWidth: '400px' }}>
          <div className="pc-top">
            <span className="pc-icon">👋</span>
            <span className="pc-label connect">Connect</span>
          </div>
          <div className="pc-title">Join Community &amp; Network</div>
          <p className="pc-desc" style={{ maxWidth: '280px', margin: '0 auto 12px' }}>
            Join thousands of teen founders, find mentors, and build your network in the startup community.
          </p>
          <div className="pc-preview" style={{ margin: '0 -16px', display: 'flex', justifyContent: 'center' }}>
            <div className="pc-comm" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
              <div className="pc-comm-title">Community Feed</div>
              <div className="pc-comm-card">
                <div className="pc-comm-post">
                  <div className="pc-comm-header">
                    <div className="pc-comm-av">S</div>
                    <div className="pc-comm-name">Sarah K.</div>
                    <div className="pc-comm-time">2h ago</div>
                  </div>
                  <div className="pc-comm-badge">💡 New Idea</div>
                  <div className="pc-comm-text">
                    "ParkShare — Airbnb for empty driveways. Testing in Phoenix first. Thoughts?"
                  </div>
                  <div className="pc-comm-stats">
                    <span>👍 24</span>
                    <span>💬 7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link href="/login?mode=signup" className="pc-cta connect" style={{ textDecoration: 'none' }}>
            Join Community →
          </Link>
        </div>
      </div>
    </div>
  )
}
