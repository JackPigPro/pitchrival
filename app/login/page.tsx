import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'
import { createClient } from '@/utils/supabase/server'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (data.user) {
    redirect('/dashboard')
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '20px' }}>
      <LoginForm />
    </main>
  )
}
