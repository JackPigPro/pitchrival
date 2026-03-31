import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div style={{ padding: '28px 32px', width: '100%' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
        Feed
      </h1>
      <p style={{ color: 'var(--text2)' }}>
        You are logged in. Your main feed is ready.
      </p>
      <Link href="/profile" style={{ color: 'var(--green)' }}>
        Go to Profile
      </Link>
    </div>
  )
}
