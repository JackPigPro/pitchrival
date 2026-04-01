import Link from 'next/link'

export default function ProfileNotFound({ username }: { username: string }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '48px 32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--border2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '32px',
            color: 'var(--text3)'
          }}>
            👤
          </div>

          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            fontFamily: 'var(--font-display)', 
            marginBottom: '12px',
            color: 'var(--text)'
          }}>
            Profile Not Found
          </h1>

          <p style={{ 
            color: 'var(--text2)', 
            fontSize: '16px', 
            lineHeight: '1.6',
            marginBottom: '24px'
          }}>
            The profile <strong>@{username}</strong> doesn't exist or has been removed.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                borderRadius: '8px',
                background: 'var(--green)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ← Back to Home
            </Link>
            
            <Link
              href="/connect"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid var(--border2)',
                background: 'var(--card2)',
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Find Co-founders
            </Link>
          </div>

          <div style={{ 
            marginTop: '32px', 
            padding: '16px',
            background: 'var(--card2)',
            borderRadius: '8px',
            fontSize: '14px',
            color: 'var(--text3)'
          }}>
            <p style={{ margin: 0 }}>
              Looking for someone specific? Check the spelling or try searching for them in the Connect section.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
