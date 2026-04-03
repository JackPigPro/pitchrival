export default function Testimonials() {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="t-inner">
        <div className="t-header">
          <div className="t-header-label">Community voices</div>
          <div className="t-header-title">What founders say<br />after shipping.</div>
          <div className="t-header-sub">
            Real feedback from students, founders, and builders using PitchRival.
          </div>
        </div>

        {/* Featured testimonial */}
        <div className="t-featured">
          <div className="t-featured-icon">🎓</div>
          <div>
            <p className="t-featured-quote">
              &ldquo;I used to have students write business plans that nobody read. Now they compete in
              PitchRival tournaments every week. They actually practice startup skills instead of just
              talking about them. The engagement is completely different.&rdquo;
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
              &ldquo;Honestly, I used to just scroll TikTok watching startup videos. Now I actually
              build stuff every week. My rank went from 800 to 1,400 and I found my co-founder here.&rdquo;
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
              &ldquo;Found my co-founder on here. We competed against each other for a few weeks first,
              then decided to build together. Would've never happened on LinkedIn — everyone's so fake there.&rdquo;
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
              &ldquo;The anonymous judging is fire. No names, no bias, just honest feedback. Way better
              than those accelerator programs where everyone's just trying to network.&rdquo;
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
        <div className="testimonial">
          <p className="t-quote" style={{ marginBottom: 0 }}>
            "This place actually lets you practice building stuff, not just talk about it. It's like
            a gym for startup skills."
          </p>
        </div>
      </div>
    </section>
  )
}
