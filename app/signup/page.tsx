import { redirect } from 'next/navigation'
import SignupForm from './SignupForm'
import { createClient } from '@/utils/supabase/server'

export default async function SignupPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (data.user) {
    redirect('/dashboard')
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '20px' }}>
      <SignupForm />
    </main>
  )
}
