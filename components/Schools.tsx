'use client'

interface SchoolsProps {
  onComingSoon: () => void
}

export default function Schools({ onComingSoon }: SchoolsProps) {
  return (
    <section className="schools-section" id="schools">
      <div className="schools-glow"></div>
      <div className="schools-glow-2"></div>
      <div className="schools-inner">
        <div className="schools-top">
          {/* Left: copy */}
          <div className="schools-left">
            <div className="schools-label">For Educators</div>
            <div className="schools-title">
              PitchRival<br />for <em>Schools.</em>
            </div>
            <p className="schools-sub">
              Bring the energy of real entrepreneurship into your classroom. Create lessons, run
              competitions, track every student&apos;s growth — and watch them actually show up to do the work.
            </p>
            <div className="schools-cta-row">
              <button className="schools-btn-p" onClick={onComingSoon}>🏫 Request Early Access</button>
              <button className="schools-btn-g" onClick={onComingSoon}>Learn more →</button>
            </div>
          </div>

          {/* Right: feature cards grid */}
          <div className="schools-features">
            <div className="sf-feat">
              <div className="sf-feat-icon">🏫</div>
              <div className="sf-feat-title">Create Classrooms</div>
              <div className="sf-feat-desc">Set up your class in minutes. Students join with a code — no setup friction.</div>
            </div>
            <div className="sf-feat">
              <div className="sf-feat-icon">📅</div>
              <div className="sf-feat-title">Schedule Lessons</div>
              <div className="sf-feat-desc">Assign challenges, set due dates, and queue up competitions for your schedule.</div>
            </div>
            <div className="sf-feat">
              <div className="sf-feat-icon">🏆</div>
              <div className="sf-feat-title">Class Leaderboards</div>
              <div className="sf-feat-desc">Live class rankings. Students compete against each other — anonymously and fairly.</div>
            </div>
            <div className="sf-feat">
              <div className="sf-feat-icon">🌍</div>
              <div className="sf-feat-title">School Leaderboards</div>
              <div className="sf-feat-desc">See how your school stacks up against others. Build real school-wide competition culture.</div>
            </div>
            <div className="sf-feat">
              <div className="sf-feat-icon">📊</div>
              <div className="sf-feat-title">Teacher Dashboard</div>
              <div className="sf-feat-desc">Track every student&apos;s ELO growth, completed lessons, and participation in one place.</div>
            </div>
            <div className="sf-feat">
              <div className="sf-feat-icon">🎯</div>
              <div className="sf-feat-title">Custom Challenges</div>
              <div className="sf-feat-desc">Create your own prompts. Run competitions built around your curriculum.</div>
            </div>
          </div>
        </div>

        {/* Bottom stat bar */}
        <div className="schools-stats">
          <div className="ss-stat">
            <div className="ss-num g">4k+</div>
            <div className="ss-label">Students on platform</div>
          </div>
          <div className="ss-stat">
            <div className="ss-num b">120+</div>
            <div className="ss-label">Classrooms active</div>
          </div>
          <div className="ss-stat">
            <div className="ss-num p">18</div>
            <div className="ss-label">States represented</div>
          </div>
          <div className="ss-stat">
            <div className="ss-num">Free</div>
            <div className="ss-label">For teachers to start</div>
          </div>
        </div>
      </div>
    </section>
  )
}
