import Link from 'next/link'

const COURSES = [
  { icon: '📢', title: 'How to Market With No Money',         lessons: 9,  status: 'in-progress', progress: 35 },
  { icon: '✅', title: 'How to Validate Your Idea in 48 Hours', lessons: 7,  status: 'locked' },
  { icon: '💰', title: 'Fundraising for First-Time Founders',   lessons: 11, status: 'locked' },
  { icon: '🏗️', title: 'Building an MVP Without Engineers',     lessons: 8,  status: 'locked' },
  { icon: '🤝', title: 'How to Find a Co-Founder',              lessons: 6,  status: 'locked' },
  { icon: '📊', title: 'Pitch Deck Masterclass',                lessons: 10, status: 'locked' },
]

export default function LearnPage() {
  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 180px)' }}>

      {/* Actual content underneath */}
      <div style={{ padding: '40px 48px', maxWidth: '860px', filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--purple)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          📚 THE SYLLABUS
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
          The Founder&apos;s Roadmap
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text2)', marginBottom: '32px' }}>
          Structured courses with real exercises — not videos you forget.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {COURSES.map((course, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '22px',
              borderLeft: course.status === 'in-progress' ? '3px solid var(--purple)' : '3px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '18px',
            }}>
              <div style={{ fontSize: '28px', flexShrink: 0 }}>{course.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{course.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{course.lessons} lessons</div>
                {course.status === 'in-progress' && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(124,58,237,.15)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${course.progress}%`, background: 'var(--purple)', borderRadius: '2px' }}></div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--purple)', fontFamily: 'var(--font-display)' }}>{course.progress}%</span>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ fontSize: '16px' }}>{course.status === 'locked' ? '🔒' : '▶'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(247,247,246,.7)',
        backdropFilter: 'blur(2px)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--dark2) 0%, #1a1040 100%)',
          border: '1px solid rgba(124,58,237,.25)',
          borderRadius: '20px',
          padding: '52px 56px',
          textAlign: 'center',
          maxWidth: '480px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,.3)',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '400px', height: '300px', background: 'radial-gradient(ellipse, rgba(124,58,237,.15) 0%, transparent 65%)', pointerEvents: 'none' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(167,139,250,.8)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
              COMING SOON
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-1px', color: '#fff', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
              The Syllabus is<br /><em style={{ fontStyle: 'normal', color: '#a78bfa' }}>almost ready.</em>
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.48)', lineHeight: 1.65, marginBottom: '28px' }}>
              We&apos;re building structured courses with real exercises — not videos you forget. Built for first-time founders who want to actually do the thing.
            </p>

            {/* Teasers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
              {['How to Market With No Money', 'Fundraising for First-Time Founders', 'Building an MVP Without Engineers'].map((c) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(167,139,250,.07)', border: '1px solid rgba(167,139,250,.15)', borderRadius: '8px', textAlign: 'left' }}>
                  <span style={{ fontSize: '14px' }}>📗</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{c}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: 'rgba(167,139,250,.12)', color: '#a78bfa', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Soon</span>
                </div>
              ))}
            </div>

            <Link href="/home" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', borderRadius: '9px',
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.15)',
              color: 'rgba(255,255,255,.8)', textDecoration: 'none',
              fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)',
              transition: 'all .15s',
            }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}