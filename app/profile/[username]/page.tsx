import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ProfilePage from '@/components/ProfilePage'
import ProfileLoading from '@/components/ProfileLoading'
import ProfileNotFound from '@/components/ProfileNotFound'
import { Suspense } from 'react'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

async function ProfileContent({ username }: { username: string }) {
  const supabase = await createClient()

  // Fetch profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (profileError || !profile) {
    return <ProfileNotFound username={username} />
  }

  // Fetch user stats
  const { data: userStats, error: statsError } = await supabase
    .from('user_stats')
    .select('elo, rank, weekly_duel_entered')
    .eq('user_id', profile.id)
    .single()

  // Fetch user's ideas
  const { data: ideas, error: ideasError } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  // Fetch all-time rank (count users with higher ELO)
  const { count: allTimeRankCount } = await supabase
    .from('user_stats')
    .select('*', { count: 'exact', head: true })
    .gt('elo', userStats?.elo || 0)
  const allTimeRank = allTimeRankCount !== null ? allTimeRankCount + 1 : null

  // Fetch daily rank from elo_history (last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: dailyHistory, error: dailyError } = await supabase
    .from('elo_history')
    .select('user_id, elo_change, new_elo')
    .gte('created_at', oneDayAgo)
    .eq('user_id', profile.id)

  // Calculate daily rank position (simplified approach)
  let dailyRank = null
  if (dailyHistory && dailyHistory.length > 0) {
    const totalDailyEloGain = dailyHistory.reduce((sum, entry) => sum + (entry.elo_change || 0), 0)
    
    // For now, we'll fetch all daily history and calculate rank on the client side
    // This is less efficient but works with Supabase limitations
    const { data: allDailyHistory } = await supabase
      .from('elo_history')
      .select('user_id, elo_change')
      .gte('created_at', oneDayAgo)
    
    if (allDailyHistory) {
      // Group by user and calculate total gains
      const userGains = new Map<string, number>()
      allDailyHistory.forEach(entry => {
        const currentGain = userGains.get(entry.user_id) || 0
        userGains.set(entry.user_id, currentGain + (entry.elo_change || 0))
      })
      
      // Count users with higher gains
      let usersWithHigherGain = 0
      userGains.forEach(gain => {
        if (gain > totalDailyEloGain) {
          usersWithHigherGain++
        }
      })
      
      dailyRank = usersWithHigherGain + 1
    }
  }

  // Fetch weekly duels entered count
  const { count: weeklyDuelsCount } = await supabase
    .from('duel_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile.id)

  // Get current user to check if this is their own profile
  const { data: { user } } = await supabase.auth.getUser()
  const isOwnProfile = user?.id === profile.id

  return (
    <ProfilePage
      profile={profile}
      userStats={userStats || undefined}
      ideas={ideas || []}
      isOwnProfile={isOwnProfile}
      allTimeRank={allTimeRank}
      dailyRank={dailyRank}
      weeklyDuelsCount={weeklyDuelsCount || 0}
    />
  )
}

export default async function ProfilePageRoute({ params }: ProfilePageProps) {
  const { username } = await params

  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent username={username} />
    </Suspense>
  )
}