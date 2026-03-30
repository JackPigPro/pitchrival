export default function Testimonials() {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="t-inner">
        <div className="t-header">
          <div className="t-header-label">Real people. Real results.</div>
          <div className="t-header-title">48,000 founders<br />can&apos;t be wrong.</div>
          <div className="t-header-sub">
            From DECA students to AP Business classrooms to first-time founders building in stealth.
          </div>
        </div>

        {/* Featured testimonial */}
        <div className="t-featured">
          <div className="t-featured-icon">🎓</div>
          <div>
            <p className="t-featured-quote">
              &ldquo;I replaced written business reports with PitchRival challenges this semester.
              Students compete anonymously, get honest peer feedback, and retain the skills because
              they&apos;re actually using them under pressure. My top student went from a struggling
              presenter to ranked #12 in her state. I&apos;m never going back.&rdquo;
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

        {/* Testimonial grid */}
        <div className="t-grid">
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
      </div>
    </section>
  )
}
