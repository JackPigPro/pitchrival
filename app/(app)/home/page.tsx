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
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontWeight: 700, marginBottom: '10px', fontFamily: 'var(--font-display)' }}>Connect</div>
            {[
              { href: '/connect/messages', text: 'Latest notifications and messages' },
              { href: '/connect/feedback', text: 'Latest forum snippets' },
              { href: '/connect/vault', text: 'Have an idea? Drop it quickly in Vault' },
              { href: '/connect/marketplace', text: 'Browse founders by role and skills' },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                {item.text} →
              </Link>
            ))}
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontWeight: 700, marginBottom: '10px', fontFamily: 'var(--font-display)' }}>Your recent ideas</div>
            {['ParkShare v2 pivot', 'Campus micro-gig platform'].map((idea) => (
              <Link key={idea} href="/connect/vault" style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '8px 0' }}>
                {idea} →
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0f2a1a, #0f172a)', color: '#fff', borderRadius: '12px', padding: '22px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(34,197,94,.8)', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
              Weekly Duel
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Status: Not submitted</div>
            <p style={{ color: 'rgba(255,255,255,.64)', marginBottom: '12px' }}>Prompt is live. Join now or load a draft from Vault.</p>
            <Link href="/compete/duel" style={{ textDecoration: 'none', color: '#fff', background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: '8px', padding: '10px 16px', display: 'inline-block', fontWeight: 700 }}>
              Go to Weekly Duel
            </Link>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontWeight: 700, marginBottom: '10px', fontFamily: 'var(--font-display)' }}>Compete quick links</div>
            <Link href="/compete/leaderboard" style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '8px 0' }}>Open leaderboard →</Link>
            <Link href="/compete/duel" style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '8px 0' }}>Open duel workspace →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}