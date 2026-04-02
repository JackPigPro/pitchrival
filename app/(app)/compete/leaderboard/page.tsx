import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LeaderboardClient from './LeaderboardClient'

const getRankLabel = (elo: number) => {
  if (elo < 500) return 'Trainee'
  if (elo < 750) return 'Builder'
  if (elo < 1000) return 'Creator'
  if (elo < 1250) return 'Founder'
  if (elo < 1500) return 'Visionary'
  if (elo < 1750) return 'Icon'
  if (elo < 2000) return 'Titan'
  return 'Unicorn'
}

export default async function LeaderboardPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Step 1: Fetch all rows from user_stats
  const { data: userStats, error: statsError } = await supabase
    .from('user_stats')
    .select('user_id, elo, rank, weekly_duel_entered')
    .order('elo', { ascending: false })

  if (statsError) {
    console.error('Error fetching user stats:', statsError)
  }


  // Step 2: Fetch all rows from profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username')

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
  }


  // Step 3: Manual JavaScript join - match by user_stats.user_id === profiles.id
  const transformedAllUsers = (userStats || []).map(stat => {
    const profile = (profiles || []).find(p => p.id === stat.user_id)
    return {
      elo: stat.elo || 0,
      user_id: stat.user_id,
      rank_label: getRankLabel(stat.elo || 0),
      profiles: {
        username: profile?.username || 'Unknown'
      }
    }
  })


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


  // Create user lookup map from allUsers
  const userLookup = new Map(transformedAllUsers.map(user => [user.user_id, user]))

  // Build complete daily list - start with all users, then calculate their daily gains
  const completeDailyList = transformedAllUsers.map(user => {
    const dailyEntries = (dailyHistory || []).filter(entry => entry.user_id === user.user_id)
    const totalDailyGain = dailyEntries.reduce((sum, entry) => sum + (entry.elo_change || 0), 0)
    
    return {
      elo_change: totalDailyGain,
      new_elo: totalDailyGain, // Use period gain, not total ELO
      user_id: user.user_id,
      rank_label: user.rank_label, // Include rank label from all-time ELO
      created_at: new Date().toISOString(),
      profiles: user.profiles
    }
  }).sort((a, b) => b.new_elo - a.new_elo) // Sort by period gain descending

  // Build complete weekly list - start with all users, then calculate their weekly gains
  const completeWeeklyList = transformedAllUsers.map(user => {
    const weeklyEntries = (weeklyHistory || []).filter(entry => entry.user_id === user.user_id)
    const totalWeeklyGain = weeklyEntries.reduce((sum, entry) => sum + (entry.elo_change || 0), 0)
    
    return {
      elo_change: totalWeeklyGain,
      new_elo: totalWeeklyGain, // Use period gain, not total ELO
      user_id: user.user_id,
      rank_label: user.rank_label, // Include rank label from all-time ELO
      created_at: new Date().toISOString(),
      profiles: user.profiles
    }
  }).sort((a, b) => b.new_elo - a.new_elo) // Sort by period gain descending


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