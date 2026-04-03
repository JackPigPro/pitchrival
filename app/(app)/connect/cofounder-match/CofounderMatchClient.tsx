'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Profile {
  id: string
  username: string
  display_name?: string
  status_tags?: string[]
  created_at: string
  bio?: string
  skills?: string[]
  cofounder_stage?: string
}

interface CofounderRequest {
  id: string
  sender_id: string
  receiver_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

interface CofounderMatchClientProps {
  profiles: Profile[]
  requests: CofounderRequest[]
  isListed: boolean
  connectedProfiles: Profile[]
  currentUserId: string
}

export default function CofounderMatchClient({ 
  profiles, 
  requests, 
  isListed, 
  connectedProfiles,
  currentUserId 
}: CofounderMatchClientProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleToggleListing = async () => {
    try {
      const response = await fetch('/connect/cofounder-match/api', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ open_to_cofounder: !isListed }),
      })

      if (!response.ok) {
        throw new Error('Failed to update listing status')
      }

      // Refresh page to show updated data
      window.location.reload()
    } catch (err) {
      console.error('Error toggling listing:', err)
      alert('Failed to update listing status. Please try again.')
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
      // Refresh page to show updated state
      window.location.reload()
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

      // Refresh page to show updated state
      window.location.reload()
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
      req.sender_id === currentUserId && 
      req.receiver_id === profileId && 
      req.status === 'pending'
    )
  }

  const hasAnyRequest = (profileId: string) => {
    return requests.some(req => 
      (req.sender_id === currentUserId && req.receiver_id === profileId) ||
      (req.receiver_id === currentUserId && req.sender_id === profileId)
    )
  }

  const getIncomingRequests = () => {
    return requests.filter(req => 
      req.receiver_id === currentUserId && 
      req.status === 'pending'
    )
  }

  // Separate current user from other profiles
  const currentUserProfile = profiles.find(profile => profile.id === currentUserId)
  const otherProfiles = profiles.filter(profile => profile.id !== currentUserId)
  
  // Show current user at top if they are listed, then other users
  const visibleProfiles = [
    ...(currentUserProfile ? [currentUserProfile] : []),
    ...otherProfiles.filter(profile => !hasAnyRequest(profile.id))
  ]

  const incomingRequests = getIncomingRequests()

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px', fontFamily: 'var(--font-display)', color: 'var(--red)', marginBottom: '16px' }}>
            Error
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg)',
      backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px', fontFamily: 'var(--font-display)', color: 'var(--text)', margin: 0 }}>
              Co-founder Match
            </h1>
            <button
              onClick={handleToggleListing}
              style={{
                padding: '12px 24px',
                background: isListed ? 'var(--surface)' : 'var(--green)',
                color: isListed ? 'var(--text)' : 'white',
                border: isListed ? '1px solid var(--border)' : '1px solid var(--green)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                transition: 'all 0.2s ease'
              }}
            >
              {isListed ? 'Remove Myself from Pool' : 'List Myself as Cofounder'}
            </button>
          </div>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '400', 
            fontFamily: 'var(--font-body)', 
            color: 'var(--text2)'
          }}>
            Find your perfect co-founder match
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Your Co-founders Section */}
            {connectedProfiles.length > 0 && (
              <div style={{ 
                background: 'var(--card)', 
                borderRadius: '16px', 
                padding: '32px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)'
              }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-display)', 
                  color: 'var(--text)', 
                  marginBottom: '24px',
                  letterSpacing: '-0.1px'
                }}>
                  Your Co-founders
                </h2>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px'
                }}>
                  {connectedProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'var(--green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '18px',
                        fontFamily: 'var(--font-display)',
                        flexShrink: 0
                      }}>
                        {(profile.display_name || profile.username || 'Unknown').charAt(0).toUpperCase()}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-display)',
                          color: 'var(--text)',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {profile.display_name || profile.username || 'Unknown'}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: 'var(--text2)',
                          marginBottom: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          @{profile.username}
                        </div>
                        {profile.bio && (
                          <div style={{
                            fontSize: '13px',
                            color: 'var(--text2)',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {profile.bio}
                          </div>
                        )}
                      </div>

                      <a
                        href={`/connect/messages?with=${profile.id}`}
                        style={{
                          padding: '8px 16px',
                          background: 'var(--green)',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          fontFamily: 'var(--font-display)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Message
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Incoming Requests Section */}
            {incomingRequests.length > 0 && (
              <div style={{ 
                background: 'var(--card)', 
                borderRadius: '16px', 
                padding: '32px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)'
              }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-display)', 
                  color: 'var(--text)', 
                  marginBottom: '24px',
                  letterSpacing: '-0.1px'
                }}>
                  Incoming Requests
                </h2>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px'
                }}>
                  {incomingRequests.map((request) => {
                    const senderProfile = getProfileById(request.sender_id)
                    if (!senderProfile) return null

                    return (
                      <div
                        key={request.id}
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          padding: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'var(--blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '18px',
                          fontFamily: 'var(--font-display)',
                          flexShrink: 0
                        }}>
                          {(senderProfile.display_name || senderProfile.username || 'Unknown').charAt(0).toUpperCase()}
                        </div>
                        
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-display)',
                            color: 'var(--text)',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {senderProfile.display_name || senderProfile.username || 'Unknown'}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: 'var(--text2)',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            @{senderProfile.username}
                          </div>
                          {senderProfile.bio && (
                            <div style={{
                              fontSize: '13px',
                              color: 'var(--text2)',
                              lineHeight: '1.4',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {senderProfile.bio}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            onClick={() => handleRequestAction(request.id, 'accept')}
                            style={{
                              padding: '8px 16px',
                              background: 'var(--green)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              fontFamily: 'var(--font-display)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            style={{
                              padding: '8px 16px',
                              background: 'var(--surface)',
                              color: 'var(--text2)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              fontFamily: 'var(--font-display)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Discover Founders Section */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 700, 
                fontFamily: 'var(--font-display)', 
                color: 'var(--text)', 
                marginBottom: '24px',
                letterSpacing: '-0.1px'
              }}>
                Discover Founders
              </h2>

              {visibleProfiles.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: 'var(--text2)',
                  fontSize: '16px',
                  fontFamily: 'var(--font-body)'
                }}>
                  <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                    🔍
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '8px' }}>
                    No profiles found
                  </div>
                  <div style={{ fontSize: '16px', color: 'var(--text2)' }}>
                    No users are currently open to co-founding.
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {visibleProfiles.map((profile) => {
                    const hasPending = hasPendingRequest(profile.id)
                    const isCurrentUser = profile.id === currentUserId
                    
                    return (
                      <div
                        key={profile.id}
                        style={{
                          background: 'var(--surface)',
                          border: isCurrentUser ? '2px solid var(--green)' : '1px solid var(--border)',
                          borderRadius: '16px',
                          padding: '24px',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                      >
                        {isCurrentUser && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'var(--green)',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontFamily: 'var(--font-display)'
                          }}>
                            You
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: isCurrentUser ? 'var(--green)' : 'var(--blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '20px',
                            fontFamily: 'var(--font-display)',
                            flexShrink: 0
                          }}>
                            {(profile.display_name || profile.username || 'Unknown').charAt(0).toUpperCase()}
                          </div>
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: 700,
                              fontFamily: 'var(--font-display)',
                              color: 'var(--text)',
                              marginBottom: '4px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {profile.display_name || profile.username || 'Unknown'}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              color: 'var(--text2)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              @{profile.username}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{
                          fontSize: '14px',
                          color: 'var(--text2)',
                          lineHeight: '1.5',
                          marginBottom: '16px',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {profile.bio || 'No bio provided. Add one to help others get to know you!'}
                        </div>
                        
                        <div style={{
                          display: 'inline-block',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '4px 12px',
                          borderRadius: '6px',
                          background: 'var(--blue-tint)',
                          color: 'var(--blue)',
                          marginBottom: '12px',
                          fontFamily: 'var(--font-display)'
                        }}>
                          {profile.cofounder_stage || 'Exploring Opportunities'}
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          marginBottom: '16px'
                        }}>
                          {(profile.skills && profile.skills.length > 0) ? (
                            <>
                              {profile.skills.slice(0, 4).map((skill, index) => (
                                <span
                                  key={index}
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    background: 'var(--green-tint)',
                                    color: 'var(--green)',
                                    fontFamily: 'var(--font-body)'
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                              {profile.skills.length > 4 && (
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  background: 'var(--surface)',
                                  color: 'var(--text2)',
                                  fontFamily: 'var(--font-body)'
                                }}>
                                  +{profile.skills.length - 4} more
                                </span>
                              )}
                            </>
                          ) : (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 500,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              background: 'var(--surface)',
                              color: 'var(--text2)',
                              fontFamily: 'var(--font-body)'
                            }}>
                              No skills listed
                            </span>
                          )}
                        </div>
                        
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--text2)',
                          fontStyle: 'italic',
                          marginBottom: '16px',
                          lineHeight: '1.4'
                        }}>
                          {profile.status_tags && profile.status_tags.length > 0 
                            ? profile.status_tags.join(', ')
                            : 'Open to new connections and opportunities'
                          }
                        </div>
                        
                        <button
                          onClick={() => handleSendRequest(profile.id)}
                          disabled={hasPending || isCurrentUser}
                          className={isCurrentUser || hasPending ? '' : 'btn-cta-primary'}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: isCurrentUser ? 'var(--surface)' : (hasPending ? 'var(--surface)' : ''),
                            color: isCurrentUser ? 'var(--text2)' : (hasPending ? 'var(--text2)' : ''),
                            border: isCurrentUser ? '1px solid var(--border)' : (hasPending ? '1px solid var(--border)' : ''),
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: isCurrentUser ? 'not-allowed' : (hasPending ? 'not-allowed' : 'pointer'),
                            fontFamily: 'var(--font-display)',
                            transition: 'all 0.2s ease',
                            opacity: (hasPending || isCurrentUser) ? 0.6 : 1
                          }}
                        >
                          {isCurrentUser ? "It's You" : (hasPending ? 'Request Sent' : 'Connect')}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Stats Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: 800, 
                  color: 'var(--blue)', 
                  fontFamily: 'var(--font-display)',
                  marginBottom: '8px'
                }}>
                  {visibleProfiles.length}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text2)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  Available
                </div>
              </div>
              
              <div style={{ 
                height: '1px', 
                background: 'var(--border)', 
                margin: '20px 0' 
              }} />
              
              <div>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: 800, 
                  color: 'var(--green)', 
                  fontFamily: 'var(--font-display)',
                  marginBottom: '8px'
                }}>
                  {connectedProfiles.length}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text2)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  Connected
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 700, 
                fontFamily: 'var(--font-display)', 
                color: 'var(--text)', 
                marginBottom: '20px',
                letterSpacing: '-0.1px'
              }}>
                💡 Tips
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text2)',
                  lineHeight: '1.5',
                  fontFamily: 'var(--font-body)'
                }}>
                  Complete your profile to increase match quality and attract better co-founders.
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text2)',
                  lineHeight: '1.5',
                  fontFamily: 'var(--font-body)'
                }}>
                  Be specific about your skills and what you're looking for in a co-founder.
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text2)',
                  lineHeight: '1.5',
                  fontFamily: 'var(--font-body)'
                }}>
                  Respond to requests promptly to build momentum in your cofounder search.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
