import Link from 'next/link'
import ForgotPasswordComponent from '@/components/ForgotPasswordComponent'

export default function ForgotPasswordPage() {
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
        <div className="hdc-badge b">Forgot Password</div>
        <div className="hdc-text">Reset your password</div>
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <ForgotPasswordForm />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', width: '100%', maxWidth: '512px' }}>
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

function ForgotPasswordForm() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '512px',
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
        Reset Password
      </h1>
      <p style={{ color: 'var(--text2)', marginTop: '10px', marginBottom: '18px' }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <ForgotPasswordComponent />
    </div>
  )
}
