import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: profile }, { data: stats }] = await Promise.all([
    supabase.from('profiles').select('username, display_name, created_at').eq('id', user.id).single(),
    supabase.from('user_stats').select('elo, rank').eq('user_id', user.id).single()
  ])

  return (
    <DashboardClient
      initialProfile={profile}
      initialStats={stats}
    />
  )
}
