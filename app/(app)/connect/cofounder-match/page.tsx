import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CofounderMatchClient from './CofounderMatchClient'

type Profile = {
  id: string
  username: string
  display_name?: string
  status_tags?: string[]
  created_at: string
  bio?: string
  skills?: string[]
  cofounder_stage?: string
}

type CofounderRequest = {
  id: string
  sender_id: string
  receiver_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export default async function CoFounderMatchPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch profiles where open_to_cofounder is true
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .eq('open_to_cofounder', true)

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
  }

  // Fetch cofounder requests where user is sender or receiver
  const { data: requests, error: requestsError } = await supabase
    .from('cofounder_requests')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

  if (requestsError) {
    console.error('Error fetching cofounder requests:', requestsError)
  }

  // Build a Set of user IDs who have ANY request (pending or accepted) with current user
  const allRequestedUserIds = new Set<string>()
  requests?.forEach(request => {
    if (request.sender_id === user.id) {
      allRequestedUserIds.add(request.receiver_id)
    } else {
      allRequestedUserIds.add(request.sender_id)
    }
  })

  // Filter out users with any requests from profiles array (but keep current user)
  const filteredProfiles = profiles?.filter(profile => 
    !allRequestedUserIds.has(profile.id)
  ) || []

  // Fetch current user's profile to check if they are listed
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('open_to_cofounder')
    .eq('id', user.id)
    .single()

  // Fetch accepted cofounder connections
  const { data: connections } = await supabase
    .from('cofounder_requests')
    .select('sender_id, receiver_id')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .eq('status', 'accepted')

  // Extract partner IDs from connections
  const partnerIds = connections?.map(conn => 
    conn.sender_id === user.id ? conn.receiver_id : conn.sender_id
  ).filter(Boolean) || []

  // Fetch profiles for connected partners
  let connectedProfiles: Profile[] = []
  if (partnerIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', partnerIds)
    connectedProfiles = profiles || []
  }

  // Fetch profiles for incoming request senders (they might be filtered out from main profiles)
  const incomingRequestSenderIds = requests
    ?.filter(req => req.receiver_id === user.id && req.status === 'pending')
    .map(req => req.sender_id) || []
  
  let incomingRequestProfiles: Profile[] = []
  if (incomingRequestSenderIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', incomingRequestSenderIds)
    incomingRequestProfiles = profiles || []
  }

  return (
    <CofounderMatchClient 
      profiles={filteredProfiles}
      requests={requests || []}
      isListed={currentUserProfile?.open_to_cofounder || false}
      connectedProfiles={connectedProfiles}
      incomingRequestProfiles={incomingRequestProfiles}
      currentUserId={user.id}
    />
  )
}
