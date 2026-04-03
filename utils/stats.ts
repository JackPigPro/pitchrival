import { createAdminClient } from '@/utils/supabase/admin'

export interface LiveStats {
  totalUsers: number
  acceptedMatches: number
  totalIdeas: number
}

export async function getLiveStats(): Promise<LiveStats> {
  const supabase = createAdminClient()
  
  console.log('Starting getLiveStats...')

  // Test basic connection first
  const { data: testData, error: testError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
  
  console.log('Test query result:', { testData, testError })

  // Get total users from profiles table
  const { count: totalUsers, error: usersError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
  
  console.log('Users query result:', { totalUsers, usersError })

  // Get accepted cofounder requests
  const { count: acceptedMatches, error: matchesError } = await supabase
    .from('cofounder_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'accepted')
  
  console.log('Matches query result:', { acceptedMatches, matchesError })

  // Get total ideas (both public and private)
  const { count: totalIdeas, error: ideasError } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true })
  
  console.log('Ideas query result:', { totalIdeas, ideasError })
  
  if (usersError) console.error('Error fetching users:', usersError)
  if (matchesError) console.error('Error fetching matches:', matchesError)
  if (ideasError) console.error('Error fetching ideas:', ideasError)

  const stats = {
    totalUsers: totalUsers || 0,
    acceptedMatches: acceptedMatches || 0,
    totalIdeas: totalIdeas || 0,
  }
  
  console.log('Final stats:', stats)
  return stats
}
