import Link from 'next/link'
import ResetPasswordComponent from '@/components/ResetPasswordComponent'

export default function ResetPasswordPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px 24px 32px',
        marginTop: '-68px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`.nav{display:none !important}`}</style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          pointerEvents: 'none',
        }}
      />
      <div className="auth-deco auth-deco-1 hero-deco-card">
        <div className="hdc-badge b">Reset Password</div>
        <div className="hdc-text">Set your new password</div>
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <ResetPasswordForm />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', width: '100%', maxWidth: '420px' }}>
          <Link href="/" className="auth-back-link">
            Back to home
          </Link>
          <Link href="/login?mode=login" className="auth-back-link">
            Sign in instead
          </Link>
        </div>
      </div>
    </main>
  )
}

function ResetPasswordForm() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '420px',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '28px',
        background: 'var(--card)',
        boxShadow: 'var(--shadow-lg)',
        color: 'var(--text)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
        Set New Password
      </h1>
      <p style={{ color: 'var(--text2)', marginTop: '10px', marginBottom: '18px' }}>
        Enter your new password below.
      </p>
      <ResetPasswordComponent />
    </div>
  )
}
