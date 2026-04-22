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
              BizYip<br />for <em>Schools.</em>{' '}
              <span className="inline-coming-soon schools">Coming soon</span>
            </div>
            <p className="schools-sub">
              Bring the energy of real entrepreneurship into your classroom. Create lessons, run
              competitions, track every student&apos;s growth — and watch them actually show up to do the work.
            </p>
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

        <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '13px' }}>
          Built for classrooms, clubs, and incubators that want founder-level practice.
        </div>
      </div>
    </section>
  )
}
