import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg)',
      backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <div style={{ 
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <div style={{ 
          fontSize: '120px', 
          fontWeight: 800, 
          fontFamily: 'var(--font-display)', 
          color: 'var(--text)',
          marginBottom: '24px',
          lineHeight: 1
        }}>
          404
        </div>
        
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 700, 
          fontFamily: 'var(--font-display)', 
          color: 'var(--text)',
          marginBottom: '16px',
          letterSpacing: '-0.5px'
        }}>
          This page doesn't exist.
        </div>
        
        <div style={{ 
          fontSize: '16px', 
          color: 'var(--text2)', 
          fontFamily: 'var(--font-body)',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          The page you're looking for may have been moved, deleted, or never existed.
        </div>
        
        <Link
          href="/"
          className="btn-cta-primary"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: 'var(--font-display)'
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
