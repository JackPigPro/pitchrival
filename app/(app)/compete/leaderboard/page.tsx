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
      profiles (
        username
      )
    `)
    .order('elo', { ascending: false })

  if (usersError) {
    console.error('Error fetching users:', usersError)
  }

  console.log('All users raw:', allUsers)

  // Transform the data to match expected interface
  const transformedAllUsers = (allUsers || []).map(user => {
    const profile = Array.isArray(user.profiles) ? user.profiles[0] : user.profiles
    return {
      elo: user.elo || 0,
      user_id: user.user_id,
      profiles: {
        username: profile?.username || 'Unknown'
      }
    }
  })

  console.log('All users transformed:', transformedAllUsers)

  // Fetch daily leaderboard (last 24 hours)
  const { data: dailyHistory, error: dailyError } = await supabase
    .from('elo_history')
    .select(`
      elo_change,
      new_elo,
      user_id,
      created_at
    `)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('new_elo', { ascending: false })

  if (dailyError) {
    console.error('Error fetching daily history:', dailyError)
  }

  console.log('Daily history raw:', dailyHistory)

  // Fetch weekly leaderboard (last 7 days)
  const { data: weeklyHistory, error: weeklyError } = await supabase
    .from('elo_history')
    .select(`
      elo_change,
      new_elo,
      user_id,
      created_at
    `)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('new_elo', { ascending: false })

  if (weeklyError) {
    console.error('Error fetching weekly history:', weeklyError)
  }

  console.log('Weekly history raw:', weeklyHistory)

  // Create user lookup map from allUsers
  const userLookup = new Map(transformedAllUsers.map(user => [user.user_id, user]))

  // Build complete daily list - start with all users, then add their daily gains
  const completeDailyList = transformedAllUsers.map(user => {
    const dailyEntries = (dailyHistory || []).filter(entry => entry.user_id === user.user_id)
    const totalDailyGain = dailyEntries.reduce((sum, entry) => sum + (entry.elo_change || 0), 0)
    
    return {
      elo_change: totalDailyGain,
      new_elo: user.elo || 0,
      user_id: user.user_id,
      created_at: new Date().toISOString(),
      profiles: user.profiles
    }
  }).sort((a, b) => b.new_elo - a.new_elo)

  // Build complete weekly list - start with all users, then add their weekly gains
  const completeWeeklyList = transformedAllUsers.map(user => {
    const weeklyEntries = (weeklyHistory || []).filter(entry => entry.user_id === user.user_id)
    const totalWeeklyGain = weeklyEntries.reduce((sum, entry) => sum + (entry.elo_change || 0), 0)
    
    return {
      elo_change: totalWeeklyGain,
      new_elo: user.elo || 0,
      user_id: user.user_id,
      created_at: new Date().toISOString(),
      profiles: user.profiles
    }
  }).sort((a, b) => b.new_elo - a.new_elo)

  console.log('Complete daily list:', completeDailyList)
  console.log('Complete weekly list:', completeWeeklyList)

  // Get current user's stats
  const { data: currentUserStats } = await supabase
    .from('user_stats')
    .select('elo, rank')
    .eq('user_id', user.id)
    .single()

  return (
    <LeaderboardClient 
      allUsers={transformedAllUsers}
      dailyHistory={completeDailyList}
      weeklyHistory={completeWeeklyList}
      currentUserId={user.id}
      currentUserStats={currentUserStats}
    />
  )
}