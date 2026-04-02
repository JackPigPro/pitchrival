import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: userStats } = await supabase
    .from('user_stats')
    .select('elo, rank')
    .eq('user_id', user.id)
    .single()

  return (
    <DashboardClient
      initialProfile={profile}
      initialStats={userStats}
      userId={user.id}
    />
  )
}
