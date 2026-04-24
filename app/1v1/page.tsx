'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'

// No mock data - will show empty state for Recent Battles

export default function OneVOnePage() {
  const { isAuthenticated, authLoading, elo, username, display_name } = useUser()
  const [selectedGameMode, setSelectedGameMode] = useState<'logo' | 'business_idea'>('logo')
  const [roomCode, setRoomCode] = useState('')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)

  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: 800, 
            letterSpacing: '-2px', 
            fontFamily: 'var(--font-display)', 
            color: 'var(--text)', 
            marginBottom: '32px',
            background: 'var(--border)',
            width: '200px',
            height: '48px',
            borderRadius: '8px'
          }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                height: '200px'
              }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        padding: '40px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '48px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
            Please Log In
          </h1>
          <p style={{ color: 'var(--text2)', marginBottom: '24px', fontFamily: 'var(--font-body)' }}>
            You need to be logged in to access 1v1 battles.
          </p>
          <Link
            href="/login?mode=login"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'var(--green)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'var(--font-display)'
            }}
          >
            Log In
          </Link>
        </div>
      </div>
    )
  }

  // No stats to calculate since we have no battles yet
  const totalMatches = 0
  const wins = 0
  const winRate = 0

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleCreateRoom = () => {
    const newCode = generateRoomCode()
    setIsCreatingRoom(true)
    // TODO: Implement actual room creation logic
    console.log('Creating room with code:', newCode)
  }

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      // TODO: Implement actual room joining logic
      console.log('Joining room with code:', roomCode)
    }
  }

  const handleJoinRankedQueue = () => {
    // TODO: Implement actual ranked queue logic
    console.log('Joining ranked queue for', selectedGameMode)
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
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 800, 
            letterSpacing: '-2px', 
            fontFamily: 'var(--font-display)', 
            color: 'var(--text)', 
            margin: 0,
            marginBottom: '8px'
          }}>
            1v1 Battles
          </h1>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '400', 
            fontFamily: 'var(--font-body)', 
            color: 'var(--text2)' 
          }}>
            Face off against other entrepreneurs in intense head-to-head competitions
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* User Stats Card */}
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
              marginBottom: '24px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)',
              letterSpacing: '-0.1px'
            }}>
              Player Stats
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: 800, 
                  color: 'var(--green)', 
                  fontFamily: 'var(--font-display)',
                  marginBottom: '8px',
                  letterSpacing: '-1px'
                }}>
                  {elo?.elo || 1200}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text2)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  ELO Rating
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 800, 
                  color: 'var(--text)',
                  fontFamily: 'var(--font-display)',
                  marginBottom: '8px',
                  letterSpacing: '-0.5px'
                }}>
                  {display_name || username}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text2)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  Username
                </div>
              </div>
            </div>
            
            <div style={{ 
              height: '1px', 
              background: 'var(--border)', 
              margin: '24px 0' 
            }} />
            
            <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Total Matches:</strong> {totalMatches}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Win Rate:</strong> {winRate}%
              </div>
              <div>
                <strong>Status:</strong> Ready to battle!
              </div>
            </div>
          </div>

          {/* Ranked Queue Card */}
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
              marginBottom: '24px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)',
              letterSpacing: '-0.1px'
            }}>
              Ranked Queue
            </h2>
            <p style={{ 
              color: 'var(--text2)', 
              marginBottom: '24px',
              fontFamily: 'var(--font-body)',
              lineHeight: '1.6'
            }}>
              Join random matchmaking and test your skills against similar-ranked opponents
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text2)' }}>Estimated wait:</span>
                <span style={{ fontWeight: 600, color: 'var(--green)' }}>~2:30</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text2)' }}>ELO on the line:</span>
                <span style={{ fontWeight: 600 }}>±25</span>
              </div>
            </div>
            <button
              onClick={handleJoinRankedQueue}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'var(--green)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#22c55e'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--green)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Join Ranked Queue
            </button>
          </div>

          {/* Private Room Card */}
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
              marginBottom: '24px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)',
              letterSpacing: '-0.1px'
            }}>
              Private Room
            </h2>
            <p style={{ 
              color: 'var(--text2)', 
              marginBottom: '24px',
              fontFamily: 'var(--font-body)',
              lineHeight: '1.6'
            }}>
              Create a private room or join with a code to play with friends
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleCreateRoom}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: 'var(--blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1d4ed8'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--blue)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Create Room
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)',
                    outline: 'none'
                  }}
                  maxLength={6}
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={!roomCode.trim()}
                  style={{
                    padding: '12px 20px',
                    background: roomCode.trim() ? 'var(--text)' : 'var(--border)',
                    color: roomCode.trim() ? 'white' : 'var(--text2)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-display)',
                    cursor: roomCode.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    opacity: roomCode.trim() ? 1 : 0.5
                  }}
                  onMouseEnter={(e) => {
                    if (roomCode.trim()) {
                      e.currentTarget.style.background = '#0a0e1a'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (roomCode.trim()) {
                      e.currentTarget.style.background = 'var(--text)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Game Mode Selection */}
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
              marginBottom: '24px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)',
              letterSpacing: '-0.1px'
            }}>
              Game Mode
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Logo Design Mode */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: selectedGameMode === 'logo' ? '2px solid var(--green)' : '1px solid var(--border)',
                  background: selectedGameMode === 'logo' ? 'var(--green-tint)' : 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setSelectedGameMode('logo')}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>🎨</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 700, 
                      marginBottom: '8px',
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text)',
                      letterSpacing: '-0.1px'
                    }}>
                      Logo Design
                    </h3>
                    <p style={{ 
                      color: 'var(--text2)', 
                      marginBottom: '12px',
                      fontFamily: 'var(--font-body)',
                      lineHeight: '1.5'
                    }}>
                      You'll get a brand brief. Upload your logo design.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text2)' }}>
                      <span>📸</span>
                      <span>Image upload</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Idea Mode */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: selectedGameMode === 'business_idea' ? '2px solid var(--green)' : '1px solid var(--border)',
                  background: selectedGameMode === 'business_idea' ? 'var(--green-tint)' : 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setSelectedGameMode('business_idea')}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>💡</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 700, 
                      marginBottom: '8px',
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text)',
                      letterSpacing: '-0.1px'
                    }}>
                      Business Idea
                    </h3>
                    <p style={{ 
                      color: 'var(--text2)', 
                      marginBottom: '12px',
                      fontFamily: 'var(--font-body)',
                      lineHeight: '1.5'
                    }}>
                      You'll get a market prompt. Pitch your business concept.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text2)' }}>
                      <span>✍️</span>
                      <span>Text entry</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Battles Section */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            gridColumn: '1 / -1'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              marginBottom: '24px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)',
              letterSpacing: '-0.1px'
            }}>
              Recent Battles
            </h2>
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: 'var(--text2)',
              fontFamily: 'var(--font-body)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚔️</div>
              <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No battles yet</p>
              <p style={{ fontSize: '14px' }}>Start competing to see your battle history here!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
