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
    .select('elo, leaderboard_rank')
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

  return (
    <ProfilePage
      profile={profile}
      userStats={userStats}
      ideas={ideas || []}
      isOwnProfile={isOwnProfile}
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
