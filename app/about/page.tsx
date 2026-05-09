'use client'

import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <>
      <main className="content-page">
        <div className="content-container">
          <div className="content-header">
            <h1 className="content-title">About BizYip</h1>
            <p className="content-subtitle">A competitive entrepreneurship platform for teens aged 13–18.</p>
          </div>
          
          <div className="legal-content">
            <div className="legal-section">
              <h3>The Story</h3>
              <p>
                It started in piano class. DECA kids were presenting in the back and I was like — I could make a better logo than that.
              </p>
              <p>
                My teacher gave a business prompt and 10 minutes. I opened Canva. She judged it. I was hooked.
              </p>
              <p>
                But that was once. Nobody built the daily version.
              </p>
              <p>
                In middle school I used to wake up at 3am to grind vocabulary.com leaderboards with a friend. No reason. No grade. Just because losing the ranking felt unacceptable.
              </p>
              <p>
                That's BizYip. Not education. Competition.
              </p>
            </div>

            <div className="legal-section">
              <h3>BizYip</h3>
              <p>
                Most entrepreneurship education is passive. Watch a video. Fill out a worksheet. Present once a year at DECA. None of it feels real, and none of it sticks.
              </p>
              <p>
                BizYip is different. Users compete in daily bellringers, weekly pitch duels, and live 1v1s — all earning ELO on a global leaderboard. The judging is done by the community, not a teacher. The stakes are real because the ranking is real.
              </p>
              <p>
                The platform also has an Idea Board for posting what you're building, and co-founder matching through profiles and social links.
              </p>
            </div>

            <div className="legal-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <p>
                    BizYip was built by Jack Segal, a 17-year-old founder from Raleigh, North Carolina. Launching July 20th, 2026.
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <img 
                    src="/jack-segal.jpg" 
                    alt="Jack Segal" 
                    style={{ 
                      width: '180px', 
                      height: '180px', 
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="legal-footer">
              <p>BizYip • Raleigh, North Carolina</p>
            </div>
          </div>
        </div>
      </main>
      <Footer onScrollTo={(id) => {}} />
    </>
  )
}
