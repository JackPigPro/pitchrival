'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'

interface Profile {
  id: string
  username: string
  display_name?: string
  status_tags?: string[]
  created_at: string
}

interface CofounderRequest {
  id: string
  sender_id: string
  receiver_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export default function CofounderMatchClient() {
  const { user, authLoading } = useSupabase()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [requests, setRequests] = useState<CofounderRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const response = await fetch('/connect/cofounder-match/api')
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const data = await response.json()
      setProfiles(data.profiles || [])
      setRequests(data.requests || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data')
      setLoading(false)
    }
  }

  const handleSendRequest = async (receiverId: string) => {
    try {
      const response = await fetch('/connect/cofounder-match/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver_id: receiverId }),
      })

      if (!response.ok) {
        throw new Error('Failed to send request')
      }

      const newRequest = await response.json()
      setRequests(prev => [...prev, newRequest])
    } catch (err) {
      console.error('Error sending request:', err)
      alert('Failed to send request. Please try again.')
    }
  }

  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch('/connect/cofounder-match/api', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, action }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`)
      }

      const status = action === 'accept' ? 'accepted' : 'rejected'
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status } : req
        )
      )
    } catch (err) {
      console.error(`Error ${action}ing request:`, err)
      alert(`Failed to ${action} request. Please try again.`)
    }
  }

  const getProfileById = (id: string) => {
    return profiles.find(p => p.id === id)
  }

  const hasPendingRequest = (profileId: string) => {
    return requests.some(req => 
      req.sender_id === user?.id && 
      req.receiver_id === profileId && 
      req.status === 'pending'
    )
  }

  const hasAnyRequest = (profileId: string) => {
    return requests.some(req => 
      (req.sender_id === user?.id && req.receiver_id === profileId) ||
      (req.receiver_id === user?.id && req.sender_id === profileId)
    )
  }

  const getIncomingRequests = () => {
    return requests.filter(req => 
      req.receiver_id === user?.id && 
      req.status === 'pending'
    )
  }

  // Remove auth loading blocker - UI shell always renders

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
          Please log in to find co-founders
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
          You need to be signed in to connect with potential co-founders.
        </p>
        <a 
          href="/login" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'var(--green)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600,
          }}
        >
          Log In
        </a>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
          Error
        </h2>
        <p style={{ color: 'var(--text2)' }}>{error}</p>
      </div>
    )
  }

  const incomingRequests = getIncomingRequests()
  const visibleProfiles = profiles.filter(profile => 
    profile.id !== user?.id && !hasAnyRequest(profile.id)
  )

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
      {/* Left side - User cards */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 700, 
          marginBottom: '24px', 
          fontFamily: 'var(--font-display)' 
        }}>
          Find Co-founders
        </h2>

        {loading && profiles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text2)',
            fontSize: '16px'
          }}>
            Finding co-founders...
          </div>
        ) : !loading && visibleProfiles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '12px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)',
            }}>
              No profiles found
            </h3>
            <p style={{ color: 'var(--text2)', fontSize: '16px' }}>
              No users are currently open to co-founding.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            {visibleProfiles.map((profile) => {
              const hasPending = hasPendingRequest(profile.id)
              return (
                <div
                  key={profile.id}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      marginBottom: '4px',
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text)',
                    }}>
                      {profile.display_name || profile.username}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--text2)',
                      marginBottom: '8px',
                    }}>
                      @{profile.username}
                    </p>
                    {profile.status_tags && profile.status_tags.length > 0 && (
                      <p style={{
                        fontSize: '12px',
                        color: 'var(--text2)',
                        fontStyle: 'italic',
                      }}>
                        {profile.status_tags.join(', ')}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleSendRequest(profile.id)}
                    disabled={hasPending}
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      background: hasPending ? 'var(--card2)' : 'var(--green)',
                      color: hasPending ? 'var(--text2)' : 'white',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: hasPending ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font-body)',
                      opacity: hasPending ? 0.6 : 1,
                    }}
                  >
                    {hasPending ? 'Request Sent' : 'Send Request'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Right side - Incoming requests */}
      <div style={{ width: '320px', flexShrink: 0 }}>
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '16px',
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
          }}>
            Incoming Requests
          </h3>

          {incomingRequests.length === 0 ? (
            <p style={{
              color: 'var(--text2)',
              fontSize: '14px',
              textAlign: 'center',
              padding: '20px 0',
            }}>
              No pending requests
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {incomingRequests.map((request) => {
                const senderProfile = getProfileById(request.sender_id)
                if (!senderProfile) return null

                return (
                  <div
                    key={request.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: 'var(--card2)',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '16px',
                    }}>
                      {(senderProfile.display_name || senderProfile.username).charAt(0).toUpperCase()}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--text)',
                        marginBottom: '2px',
                      }}>
                        {senderProfile.display_name || senderProfile.username}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: 'var(--text2)',
                      }}>
                        @{senderProfile.username}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleRequestAction(request.id, 'accept')}
                        style={{
                          padding: '6px 12px',
                          background: 'var(--green)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, 'reject')}
                        style={{
                          padding: '6px 12px',
                          background: 'var(--card2)',
                          color: 'var(--text2)',
                          border: '1px solid var(--border)',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
