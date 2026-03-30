import ConnectNav from '../../../components/ConnectNav'

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Section header */}
      <div style={{ padding: '28px 48px 20px', background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--blue)', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
          🤝 CONNECT
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-.8px', color: 'var(--text)', fontFamily: 'var(--font-display)', margin: 0 }}>
          Share your idea. Find your people.
        </h1>
      </div>
      <ConnectNav />
      <div style={{ flex: 1, padding: '32px 48px' }}>
        {children}
      </div>
    </div>
  )
}
