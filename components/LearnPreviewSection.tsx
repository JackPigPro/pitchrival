'use client'

import TeacherEmailForm from './TeacherEmailForm'

export default function LearnPreviewSection() {
  return (
    <div id="learn" className="feature-section fs-learn">
      <div className="fs-label b">🎓 Learn</div>

      {/* Text side */}
      <div className="feature-text">
        <div className="ft-label b">🎓 Learn</div>
        <h2 className="ft-h2">The perfect entrepreneurship<br />platform for schools.</h2>
        <p className="ft-desc">
          Daily bellringers, class leaderboards, and head-to-head duels. 
          The ideal platform to integrate into your entrepreneurship curriculum.
        </p>
        <div className="ft-bullets">
          <div className="ft-b">
            <div className="ft-b-dot b"></div>
            <span>Daily bellringers — 5-minute entrepreneurial challenges</span>
          </div>
          <div className="ft-b">
            <div className="ft-b-dot b"></div>
            <span>Class leaderboards — foster friendly competition</span>
          </div>
          <div className="ft-b">
            <div className="ft-b-dot b"></div>
            <span>Class duels — head-to-head knowledge battles</span>
          </div>
          <div className="ft-b">
            <div className="ft-b-dot b"></div>
            <span>Curriculum integration — standards-aligned content</span>
          </div>
        </div>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '12px', 
          background: 'var(--gold)', 
          color: 'white', 
          padding: '8px 16px', 
          borderRadius: '20px', 
          fontSize: '14px', 
          fontWeight: 700, 
          fontFamily: 'var(--font-display)', 
          marginBottom: '20px' 
        }}>
          🚀 Coming September
        </div>
      </div>

      {/* Interactive visual side */}
      <div className="feature-visual v-b">
        <div className="learn-demo">
          <div className="demo-badge">Demo</div>
          
          {/* Teacher signup form */}
          <TeacherEmailForm />
          
          {/* Feature preview */}
          <div className="learn-features" style={{ marginTop: '24px' }}>
            <div className="learn-feature-card" style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔔</span>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)',
                  margin: 0
                }}>
                  Daily Bellringer
                </h4>
              </div>
              <p style={{
                fontSize: '12px',
                color: 'var(--text2)',
                margin: 0,
                lineHeight: 1.4
              }}>
                Quick 5-minute challenges covering business concepts and creative problem-solving.
              </p>
            </div>
            
            <div className="learn-feature-card" style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🏫</span>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)',
                  margin: 0
                }}>
                  Class Leaderboards
                </h4>
              </div>
              <p style={{
                fontSize: '12px',
                color: 'var(--text2)',
                margin: 0,
                lineHeight: 1.4
              }}>
                School-specific rankings that foster friendly competition and track progress.
              </p>
            </div>
            
            <div className="learn-feature-card" style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>⚔️</span>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)',
                  margin: 0
                }}>
                  Class Duels
                </h4>
              </div>
              <p style={{
                fontSize: '12px',
                color: 'var(--text2)',
                margin: 0,
                lineHeight: 1.4
              }}>
                Head-to-head competitions where students test their knowledge against peers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
