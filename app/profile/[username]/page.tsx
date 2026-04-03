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
    .select('new_elo, user_id')
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

  if (dailyHistory && allTimeStats) {
    // Get unique users with their best daily ELO
    const dailyUsers = new Map()
    dailyHistory.forEach(entry => {
      const current = dailyUsers.get(entry.user_id) || 0
      if (entry.new_elo > current) {
        dailyUsers.set(entry.user_id, entry.new_elo)
      }
    })

    // Sort by ELO descending and find rank
    const sortedDaily = Array.from(dailyUsers.entries())
      .sort(([,a], [,b]) => b - a)
    
    dailyRank = sortedDaily.findIndex(([userId]) => userId === profile.id) + 1
  }

  if (allTimeStats) {
    alltimeRank = allTimeStats.findIndex(stat => stat.user_id === profile.id) + 1
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
