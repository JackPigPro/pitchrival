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

  // Get current user to check if this is their own profile
  const { data: { user } } = await supabase.auth.getUser()
  const isOwnProfile = user?.id === profile.id

  // Calculate daily rank (last 24 hours)
  const { data: dailyHistory } = await supabase
    .from('elo_history')
    .select('elo_change, user_id')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  // Calculate all-time rank
  const { data: allTimeStats } = await supabase
    .from('user_stats')
    .select('elo, user_id')
    .order('elo', { ascending: false })

  // Calculate weekly duels count
  const { data: weeklyDuels } = await supabase
    .from('duel_submissions')
    .select('id')
    .eq('user_id', profile.id)

  // Calculate ranks
  let dailyRank = null
  let alltimeRank = null

  // Calculate all-time rank first (we need this for fallback)
  if (allTimeStats) {
    alltimeRank = allTimeStats.findIndex(stat => stat.user_id === profile.id) + 1
  }

  // Calculate daily rank based on ELO gained today
  if (dailyHistory) {
    // Calculate total ELO gained today for each user
    const dailyGains = new Map<string, number>()
    
    dailyHistory.forEach(entry => {
      const currentGain = dailyGains.get(entry.user_id) || 0
      dailyGains.set(entry.user_id, currentGain + (entry.elo_change || 0))
    })

    // Sort by daily ELO gained descending and find rank
    const sortedDailyGains = Array.from(dailyGains.entries())
      .sort(([,a], [,b]) => b - a)
      .filter(([,gain]) => gain > 0) // Only include users who gained ELO today
    
    if (sortedDailyGains.length > 0) {
      dailyRank = sortedDailyGains.findIndex(([userId]) => userId === profile.id) + 1
    }
  }

  // If no daily rank (no ELO gained today or no daily history), use all-time rank
  if (!dailyRank && alltimeRank) {
    dailyRank = alltimeRank
  }

  const weeklyDuelsCount = weeklyDuels?.length || 0

  return (
    <ProfilePage
      profile={profile}
      userStats={userStats || undefined}
      ideas={ideas || []}
      isOwnProfile={isOwnProfile}
      dailyRank={dailyRank || undefined}
      alltimeRank={alltimeRank || undefined}
      weeklyDuelsCount={weeklyDuelsCount}
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
