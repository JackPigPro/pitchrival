import Landing from '@/components/Landing'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    return <Landing />
  }

  // Check if user has completed onboarding
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', user.id)
    .single()

  // Only redirect to onboarding if profile exists but onboarding is not complete
  // If profile doesn't exist (error), let the user see the landing page
  if (profile && !profile.onboarding_complete) {
    redirect('/onboarding')
  }

  const name =
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    (user.email ? user.email.split('@')[0] : 'Founder')

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