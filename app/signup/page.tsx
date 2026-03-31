import Link from 'next/link'
import LoginForm from '@/app/login/LoginForm'

export default function SignupPage() {
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
        <div className="hdc-badge b">Connect</div>
        <div className="hdc-val b">94%</div>
        <div className="hdc-text">Co-founder match score</div>
      </div>
      <div className="auth-deco auth-deco-2 hero-deco-card">
        <div className="hdc-badge g">Compete</div>
        <div className="hdc-val g">+18 ELO</div>
        <div className="hdc-text">Won last weekly duel</div>
      </div>
      <div className="auth-deco auth-deco-3 hero-deco-card">
        <div className="hdc-badge p">Learn</div>
        <div className="hdc-val p">Lesson 3</div>
        <div className="hdc-text">35% complete</div>
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <LoginForm mode="signup" />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <Link href="/" className="auth-back-link">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
