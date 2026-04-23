export default function VerifiedPage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      margin: 0,
      background: 'var(--background)',
      color: 'var(--text)',
      fontFamily: 'var(--font-display)',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'var(--card)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '400px',
        width: '100%',
      }}>
        {/* Checkmark icon */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #34d399)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(16,185,129,.28)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        </div>
        
        <h1 style={{
          margin: '0 0 12px',
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.5px',
          fontFamily: 'var(--font-display)',
        }}>
          Email verified!
        </h1>
        
        <p style={{
          margin: 0,
          color: 'var(--text2)',
          fontSize: '16px',
          lineHeight: '1.5',
        }}>
          You can close this tab.
        </p>
      </div>
    </div>
  )
}
