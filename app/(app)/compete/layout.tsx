export default function CompeteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ padding: '28px 32px 20px', background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--green)', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
          ⚔️ COMPETE
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-.8px', color: 'var(--text)', fontFamily: 'var(--font-display)', margin: 0 }}>
          Prove your skills. Every single week.
        </h1>
      </div>
      <div style={{ flex: 1, padding: '24px 32px' }}>
        {children}
      </div>
    </div>
  )
}
