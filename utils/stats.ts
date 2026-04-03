import { createClient } from '@/utils/supabase/server'

export interface LiveStats {
  totalUsers: number
  acceptedMatches: number
  totalIdeas: number
}

export async function getLiveStats(): Promise<LiveStats> {
  const supabase = await createClient()

  // Get total users from profiles table
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Get accepted cofounder requests
  const { count: acceptedMatches } = await supabase
    .from('cofounder_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'accepted')

  // Get total ideas (both public and private)
  const { count: totalIdeas } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true })

  return {
    totalUsers: totalUsers || 0,
    acceptedMatches: acceptedMatches || 0,
    totalIdeas: totalIdeas || 0,
  }
}
