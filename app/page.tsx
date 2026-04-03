import LandingPage from '@/components/LandingPage'
import Footer from '@/components/Footer'
import { redirect } from 'next/navigation'
import { getLiveStats } from '@/utils/stats'
import { getAuthState } from '@/utils/auth'

export default async function HomePage() {
  // Fetch live stats for the landing page
  const stats = await getLiveStats()

  // Get consistent auth state
  const authState = await getAuthState()
  const { user, profile, isFullyAuthenticated, needsOnboarding } = authState

  // If user exists but needs onboarding, redirect to onboarding
  if (needsOnboarding) {
    redirect('/onboarding')
  }

  // Only show dashboard if user is fully authenticated (completed onboarding)
  if (isFullyAuthenticated && profile && user) {
    // Use username from profile
    const name = profile?.username || (
      (user.user_metadata?.name as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined) ??
      (user.email ? user.email.split('@')[0] : 'Founder')
    )

    return (
      <main style={{ padding: '28px 32px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--green)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
          Dashboard
        </div>
        <h1 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
          Welcome, {name}
        </h1>
        <p style={{ color: 'var(--text2)', marginTop: '8px' }}>
          You're signed in. Use the navigation above to explore.
        </p>
      </main>
    )
  }

  // Otherwise show landing page (logged out or no auth)
  return (
    <>
      <LandingPage stats={stats} />
      <Footer onComingSoon={() => {}} onScrollTo={(id) => {}} stats={stats} />
    </>
  )
}