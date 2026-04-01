import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LeaderboardClient from './LeaderboardClient'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch all users with their current ELO and rank
  const { data: allUsers, error: usersError } = await supabase
    .from('user_stats')
    .select(`
      elo,
      user_id,
      profiles!inner(
        username
      )
    `)
    .order('elo', { ascending: false })

  if (usersError) {
    console.error('Error fetching users:', usersError)
  }

  // Fetch daily leaderboard (last 24 hours)
  const { data: dailyHistory, error: dailyError } = await supabase
    .from('elo_history')
    .select(`
      elo_change,
      new_elo,
      user_id,
      created_at,
      profiles!inner(
        username
      )
    `)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('new_elo', { ascending: false })

  if (dailyError) {
    console.error('Error fetching daily history:', dailyError)
  }

  // Fetch weekly leaderboard (last 7 days)
  const { data: weeklyHistory, error: weeklyError } = await supabase
    .from('elo_history')
    .select(`
      elo_change,
      new_elo,
      user_id,
      created_at,
      profiles!inner(
        username
      )
    `)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('new_elo', { ascending: false })

  if (weeklyError) {
    console.error('Error fetching weekly history:', weeklyError)
  }

  // Get current user's stats
  const { data: currentUserStats } = await supabase
    .from('user_stats')
    .select('elo, rank')
    .eq('user_id', user.id)
    .single()

  return (
    <LeaderboardClient 
      allUsers={allUsers || []}
      dailyHistory={dailyHistory || []}
      weeklyHistory={weeklyHistory || []}
      currentUserId={user.id}
      currentUserStats={currentUserStats}
    />
  )
}