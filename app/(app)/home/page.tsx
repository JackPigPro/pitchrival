import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ padding: '28px 32px', width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>Welcome back, Jordan</h1>
        <p style={{ color: 'var(--text2)' }}>Build loud. Learn fast. Ship this week.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%)', border: '1px solid rgba(37,99,235,.18)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontWeight: 800, marginBottom: '10px', fontFamily: 'var(--font-display)', color: 'var(--blue)' }}>CONNECT</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { href: '/connect/messages', title: 'Latest Notifications', sub: '2 unread messages and 1 mention' },
                { href: '/connect/feedback', title: 'Forum Snippets', sub: '3 fresh threads from today' },
                { href: '/connect/vault', title: 'Idea Quick Drop', sub: 'Capture now, polish later' },
                { href: '/connect/marketplace', title: 'Browse Founders', sub: 'Find by role and skill' },
              ].map((item) => (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none', background: '#fff', border: '1px solid rgba(37,99,235,.15)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{item.sub}</div>
                </Link>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontWeight: 700, marginBottom: '10px', fontFamily: 'var(--font-display)' }}>YOUR RECENT IDEAS</div>
            {['ParkShare v2 pivot', 'Campus micro-gig platform'].map((idea) => (
              <Link key={idea} href="/connect/vault" style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                {idea} <span style={{ color: 'var(--purple)' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0f2a1a, #0f172a)', color: '#fff', borderRadius: '14px', padding: '22px', border: '1px solid rgba(34,197,94,.2)' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(34,197,94,.8)', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
              WEEKLY DUEL
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Status: Not submitted</div>
            <p style={{ color: 'rgba(255,255,255,.64)', marginBottom: '12px' }}>Prompt is live. Join now or load a draft from Vault.</p>
            <Link href="/compete/duel" style={{ textDecoration: 'none', color: '#fff', background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: '8px', padding: '10px 16px', display: 'inline-block', fontWeight: 700 }}>
              Go to Weekly Duel
            </Link>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontWeight: 700, marginBottom: '10px', fontFamily: 'var(--font-display)' }}>COMPETE SNAPSHOT</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', background: 'var(--surface)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>ENTRIES</div>
                <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green)' }}>342</div>
              </div>
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', background: 'var(--surface)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>YOUR RANK</div>
                <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green)' }}>#47</div>
              </div>
            </div>
            <Link href="/compete/leaderboard" style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '8px 0' }}>Open Leaderboard →</Link>
            <Link href="/compete/duel" style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '8px 0' }}>Open Duel Workspace →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}