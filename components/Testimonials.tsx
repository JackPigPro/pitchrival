export default function Testimonials() {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="t-inner">
        <div className="t-header">
          <div className="t-header-label">Builders are shipping daily.</div>
          <div className="t-header-title">Proof from the community,<br />plus what&apos;s happening now.</div>
          <div className="t-header-sub">
            Social proof up front: real testimonials and a recent activity mini-feed from inside the platform.
          </div>
        </div>

        {/* Featured testimonial */}
        <div className="t-featured">
          <div className="t-featured-icon">🎓</div>
          <div>
            <p className="t-featured-quote">
              &ldquo;I replaced written business reports with PitchRival challenges this semester.
              Students compete anonymously, get honest peer feedback, and actually stay engaged.
              This feels like a real startup lab, not just another worksheet.&rdquo;
            </p>
            <div className="t-featured-author">
              <div className="t-featured-av">R</div>
              <div>
                <div className="t-featured-name">
                  Ms. Rivera <span className="t-featured-badge">🏫 Educator</span>
                </div>
                <div className="t-featured-meta">
                  AP Business &amp; Entrepreneurship Teacher, Phoenix, AZ · 4 classes using PitchRival
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="t-grid" style={{ marginBottom: '20px' }}>
          <div className="testimonial">
            <div className="t-stars">★★★★★</div>
            <p className="t-quote">
              &ldquo;I used to scroll X watching people talk about startups. Now I actually practice the
              skills every single day. My ELO went from 800 to 1,400 in two months.&rdquo;
            </p>
            <div className="t-author">
              <div className="t-av g">M</div>
              <div>
                <div className="t-name">Marcus T., 17</div>
                <div className="t-meta">DECA National Qualifier · Disruptor rank</div>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="t-stars">★★★★★</div>
            <p className="t-quote">
              &ldquo;Found my co-founder here. We matched on skills, competed against each other first,
              then decided to build together. That never would&apos;ve happened on LinkedIn.&rdquo;
            </p>
            <div className="t-author">
              <div className="t-av b">P</div>
              <div>
                <div className="t-name">Priya K., 21</div>
                <div className="t-meta">Founder, building in stealth · Visionary rank</div>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="t-stars">★★★★★</div>
            <p className="t-quote">
              &ldquo;The anonymous judging is the best part. No names. No bias. Most honest feedback I&apos;ve
              ever gotten — better than any accelerator workshop I&apos;ve attended.&rdquo;
            </p>
            <div className="t-author">
              <div className="t-av p">J</div>
              <div>
                <div className="t-name">Jordan R., 16</div>
                <div className="t-meta">DECA member · Innovator rank · 3 tournament wins</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr .75fr', gap: '16px' }}>
          <div className="testimonial">
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(34,197,94,.75)', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
              Recent Activity Mini-Feed
            </div>
            {[
              'Jordan sent a Vault draft to Weekly Duel',
              'Aisha posted feedback request in the forum',
              'Marcus opened 2 new co-founder conversations',
              'Priya won Weekly Duel and moved up 3 ranks',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: '8px', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.08)', color: 'rgba(255,255,255,.72)', fontSize: '13px' }}>
                <span style={{ color: '#22c55e' }}>•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="testimonial">
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(96,165,250,.8)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
              Right Now
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>2.4M</div>
            <div style={{ color: 'rgba(255,255,255,.6)', marginBottom: '12px' }}>Founder matches made</div>
            <div style={{ color: 'rgba(255,255,255,.65)', fontSize: '13px', lineHeight: 1.6 }}>
              The feedback loop is active before users even scroll into Connect/Compete/Learn.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
