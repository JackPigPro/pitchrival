export default function Testimonials() {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="t-inner">
        <div className="t-header">
          <div className="t-header-label">Community voices</div>
          <div className="t-header-title">What early users are saying</div>
          <div className="t-header-sub">
            Real feedback from students, founders, and builders using BizYip.
          </div>
        </div>

        {/* Featured testimonial */}
        <div className="t-featured">
          <div className="t-featured-icon">🎓</div>
          <div>
            <p className="t-featured-quote">
              &ldquo;Awaiting feedback from educators 🎓&rdquo;
            </p>
            <div className="t-featured-author">
              <div className="t-featured-av">E</div>
              <div>
                <div className="t-featured-name">
                  Educator Slot <span className="t-featured-badge">🏫 Waiting for feedback</span>
                </div>
                <div className="t-featured-meta">
                  Be one of the first educators to share your experience
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="t-grid" style={{ marginBottom: '20px' }}>
          <div className="testimonial">
            <div className="t-stars">★★★★★</div>
            <p className="t-quote">
              &ldquo;Awaiting feedback from founders 🚀&rdquo;
            </p>
            <div className="t-author">
              <div className="t-av g">F</div>
              <div>
                <div className="t-name">Founder Slot 1</div>
                <div className="t-meta">Waiting for early user feedback</div>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="t-stars">★★★★★</div>
            <p className="t-quote">
              &ldquo;Awaiting feedback from founders 🚀&rdquo;
            </p>
            <div className="t-author">
              <div className="t-av b">F</div>
              <div>
                <div className="t-name">Founder Slot 2</div>
                <div className="t-meta">Waiting for early user feedback</div>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="t-stars">★★★★★</div>
            <p className="t-quote">
              &ldquo;Awaiting feedback from founders 🚀&rdquo;
            </p>
            <div className="t-author">
              <div className="t-av p">F</div>
              <div>
                <div className="t-name">Founder Slot 3</div>
                <div className="t-meta">Waiting for early user feedback</div>
              </div>
            </div>
          </div>
        </div>
        <div className="testimonial">
          <p className="t-quote" style={{ marginBottom: 0 }}>
            &ldquo;Feedback coming soon — be one of the first to share yours.&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}
