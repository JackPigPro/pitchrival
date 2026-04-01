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

  console.log('Daily history raw:', dailyHistory)

  // Transform daily history data
  const transformedDailyHistory = (dailyHistory || []).map(entry => {
    const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles
    return {
      elo_change: entry.elo_change,
      new_elo: entry.new_elo || 0,
      user_id: entry.user_id,
      created_at: entry.created_at,
      profiles: {
        username: profile?.username || 'Unknown'
      }
    }
  })

  console.log('Daily history transformed:', transformedDailyHistory)

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

  console.log('Weekly history raw:', weeklyHistory)

  // Transform weekly history data
  const transformedWeeklyHistory = (weeklyHistory || []).map(entry => {
    const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles
    return {
      elo_change: entry.elo_change,
      new_elo: entry.new_elo || 0,
      user_id: entry.user_id,
      created_at: entry.created_at,
      profiles: {
        username: profile?.username || 'Unknown'
      }
    }
  })

  console.log('Weekly history transformed:', transformedWeeklyHistory)

  // Get all user IDs that have history entries
  const usersWithHistory = new Set([
    ...transformedDailyHistory.map(entry => entry.user_id),
    ...transformedWeeklyHistory.map(entry => entry.user_id)
  ])

  console.log('Users with history:', Array.from(usersWithHistory))

  // Create a complete user list for daily/weekly that includes users without history
  const getCompleteUserList = (historyUsers: any[]) => {
    const historyUserMap = new Map(historyUsers.map(user => [user.user_id, user]))
    
    // Add users without history (with 0 ELO for that period)
    transformedAllUsers.forEach(user => {
      if (!historyUserMap.has(user.user_id)) {
        historyUserMap.set(user.user_id, {
          elo_change: 0,
          new_elo: user.elo || 0,
          user_id: user.user_id,
          created_at: new Date().toISOString(),
          profiles: user.profiles
        })
      }
    })
    
    return Array.from(historyUserMap.values()).sort((a, b) => b.new_elo - a.new_elo)
  }

  const completeDailyList = getCompleteUserList(transformedDailyHistory)
  const completeWeeklyList = getCompleteUserList(transformedWeeklyHistory)

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