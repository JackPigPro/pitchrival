import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ padding: '40px 48px', maxWidth: '1000px', width: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          YOUR HUD
        </div>
        <h1 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
          Welcome back, Jordan. 👋
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text2)', margin: 0 }}>
          You&apos;re on a <strong style={{ color: 'var(--green)' }}>4-day streak</strong>. The Weekly Duel resets in <strong style={{ color: 'var(--text)' }}>6h 14m</strong>.
        </p>
      </div>

      {/* ELO stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '32px' }}>
        {[
          { label: 'ELO Rating',   value: '1,240', sub: '+18 today',    color: 'var(--green)' },
          { label: 'Win Rate',     value: '62%',   sub: '47 matches',   color: 'var(--blue)' },
          { label: 'Global Rank',  value: '#47',   sub: '↑4 this week', color: 'var(--gold)' },
          { label: 'Day Streak',   value: '4',     sub: 'Keep going 🔥', color: 'var(--purple)' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px 22px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1.5px', color: stat.color, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>

        {/* Left — Weekly Duel CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f2a1a 0%, #0f172a 100%)',
            border: '1px solid rgba(34,197,94,.18)',
            borderRadius: '16px',
            padding: '32px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(34,197,94,.8)', fontFamily: 'var(--font-display)' }}>
                  ⚡ THIS WEEK&apos;S DUEL
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,.6)', animation: 'lpulse 1.5s infinite' }}></div>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.4)', fontFamily: 'var(--font-display)' }}>342 competing</span>
                </div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
                THIS WEEK&apos;S PROMPT
              </div>
              <p style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1.25, letterSpacing: '-.5px', marginBottom: '8px' }}>
                &ldquo;Brand a sustainable fashion startup targeting Gen Z in a single tagline.&rdquo;
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.38)', marginBottom: '24px' }}>
                Mode: Branding · Submissions close Sunday · All skill levels compete
              </p>
              <Link href="/compete/duel" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 30px', borderRadius: '9px',
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                color: '#fff', textDecoration: 'none',
                fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)',
                boxShadow: '0 4px 18px rgba(21,128,61,.4)',
              }}>
                ⚔️ Enter the Arena
              </Link>
            </div>
          </div>

          {/* Your active idea */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>💡 Your Top Idea</span>
              <Link href="/connect/feedback" style={{ fontSize: '12px', color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>See all feedback →</Link>
            </div>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '5px', background: 'var(--blue-tint)', color: 'var(--blue)', border: '1px solid rgba(37,99,235,.2)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
                🔍 Seeking Feedback
              </div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '6px', lineHeight: 1.35 }}>
                ParkShare — Airbnb for empty driveways
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '14px', lineHeight: 1.55 }}>
                Homeowners rent their spots during peak hours. Testing in Phoenix first.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '4px' }}>👍 <strong style={{ color: 'var(--text2)' }}>24</strong> upvotes</span>
                <span style={{ fontSize: '12px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '4px' }}>💬 <strong style={{ color: 'var(--text2)' }}>7</strong> replies</span>
                <span style={{ fontSize: '12px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '4px' }}>🤝 <strong style={{ color: 'var(--text2)' }}>2</strong> co-founder requests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Quick nav */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>QUICK NAV</span>
            </div>
            {[
              { href: '/compete/duel',        icon: '⚔️', label: 'Enter the Arena',   color: 'var(--green)',  bg: 'var(--green-tint)',  border: 'rgba(22,163,74,.2)' },
              { href: '/connect/feedback',    icon: '💡', label: 'Brain Trust',        color: 'var(--blue)',   bg: 'var(--blue-tint)',   border: 'rgba(37,99,235,.2)' },
              { href: '/connect/marketplace', icon: '🏪', label: 'Find a Partner',    color: 'var(--blue)',   bg: 'var(--blue-tint)',   border: 'rgba(37,99,235,.2)' },
              { href: '/connect/vault',       icon: '🔐', label: 'Open The Vault',    color: 'var(--purple)', bg: 'var(--purple-tint)', border: 'rgba(124,58,237,.2)' },
            ].map((a) => (
              <Link key={a.href} href={a.href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                transition: 'background .15s',
              }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: a.bg, border: `1px solid ${a.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                  {a.icon}
                </div>
                <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{a.label}</span>
                <span style={{ fontSize: '13px', color: 'var(--text3)' }}>→</span>
              </Link>
            ))}
            <Link href="/learn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', textDecoration: 'none' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'var(--purple-tint)', border: '1px solid rgba(124,58,237,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>📚</div>
              <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>The Syllabus</span>
              <span style={{ fontSize: '13px', color: 'var(--text3)' }}>→</span>
            </Link>
          </div>

          {/* Leaderboard peek */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>🏆 LEADERBOARD</span>
              <Link href="/compete/leaderboard" style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Full rankings →</Link>
            </div>
            {[
              { rank: '🥇', name: 'DesignWolf',  elo: '1,891' },
              { rank: '🥈', name: 'NeonBrush',   elo: '1,756' },
              { rank: '🥉', name: 'StartupSage', elo: '1,698' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '14px', width: '20px' }}>{row.rank}</span>
                <span style={{ flex: 1, fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>{row.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>{row.elo}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', background: 'var(--green-tint)', borderLeft: '3px solid var(--green)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', width: '20px' }}>#47</span>
              <span style={{ flex: 1, fontSize: '13px', color: 'var(--green)', fontWeight: 700 }}>You</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>1,240</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}