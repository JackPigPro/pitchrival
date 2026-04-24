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

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Main Content - Queue Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Ranked Queue Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)',
                  letterSpacing: '-0.1px',
                  margin: 0
                }}>
                  Ranked Queue
                </h2>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'var(--green-tint)',
                  color: 'var(--green)',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  ELO on the line: ±25
                </div>
              </div>
              
              {/* Game Mode Selector */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text2)', marginBottom: '16px', fontFamily: 'var(--font-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Select Game Mode
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Logo Design Mode */}
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: selectedGameMode === 'logo' ? '2px solid var(--green)' : '1px solid var(--border)',
                      background: selectedGameMode === 'logo' ? 'var(--green-tint)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedGameMode('logo')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>🎨</div>
                      <div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 700, 
                          marginBottom: '4px',
                          fontFamily: 'var(--font-display)',
                          color: 'var(--text)',
                          letterSpacing: '-0.1px'
                        }}>
                          Logo Design
                        </div>
                        <div style={{ 
                          color: 'var(--text2)', 
                          fontSize: '13px',
                          fontFamily: 'var(--font-body)',
                          lineHeight: '1.4'
                        }}>
                          Get a brand brief, upload your logo
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Idea Mode */}
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: selectedGameMode === 'business_idea' ? '2px solid var(--green)' : '1px solid var(--border)',
                      background: selectedGameMode === 'business_idea' ? 'var(--green-tint)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedGameMode('business_idea')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>💡</div>
                      <div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 700, 
                          marginBottom: '4px',
                          fontFamily: 'var(--font-display)',
                          color: 'var(--text)',
                          letterSpacing: '-0.1px'
                        }}>
                          Business Idea
                        </div>
                        <div style={{ 
                          color: 'var(--text2)', 
                          fontSize: '13px',
                          fontFamily: 'var(--font-body)',
                          lineHeight: '1.4'
                        }}>
                          Get a market prompt, pitch your concept
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text2)' }}>Estimated wait:</span>
                  <span style={{ fontWeight: 600, color: 'var(--green)' }}>~2:30</span>
                </div>
              </div>
              <button
                onClick={handleJoinRankedQueue}
                disabled={!selectedGameMode}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: selectedGameMode ? 'var(--green)' : 'var(--border)',
                  color: selectedGameMode ? 'white' : 'var(--text2)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  cursor: selectedGameMode ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  opacity: selectedGameMode ? 1 : 0.5
                }}
                onMouseEnter={(e) => {
                  if (selectedGameMode) {
                    e.currentTarget.style.background = '#22c55e'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedGameMode) {
                    e.currentTarget.style.background = 'var(--green)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)',
                  letterSpacing: '-0.1px',
                  margin: 0
                }}>
                  Private Room
                </h2>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'var(--blue-tint)',
                  color: 'var(--blue)',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Play with friends
                </div>
              </div>
              
              {/* Game Mode Selector */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text2)', marginBottom: '16px', fontFamily: 'var(--font-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Select Game Mode
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Logo Design Mode */}
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: selectedGameMode === 'logo' ? '2px solid var(--blue)' : '1px solid var(--border)',
                      background: selectedGameMode === 'logo' ? 'var(--blue-tint)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedGameMode('logo')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>🎨</div>
                      <div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 700, 
                          marginBottom: '4px',
                          fontFamily: 'var(--font-display)',
                          color: 'var(--text)',
                          letterSpacing: '-0.1px'
                        }}>
                          Logo Design
                        </div>
                        <div style={{ 
                          color: 'var(--text2)', 
                          fontSize: '13px',
                          fontFamily: 'var(--font-body)',
                          lineHeight: '1.4'
                        }}>
                          Get a brand brief, upload your logo
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Idea Mode */}
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: selectedGameMode === 'business_idea' ? '2px solid var(--blue)' : '1px solid var(--border)',
                      background: selectedGameMode === 'business_idea' ? 'var(--blue-tint)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedGameMode('business_idea')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>💡</div>
                      <div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 700, 
                          marginBottom: '4px',
                          fontFamily: 'var(--font-display)',
                          color: 'var(--text)',
                          letterSpacing: '-0.1px'
                        }}>
                          Business Idea
                        </div>
                        <div style={{ 
                          color: 'var(--text2)', 
                          fontSize: '13px',
                          fontFamily: 'var(--font-body)',
                          lineHeight: '1.4'
                        }}>
                          Get a market prompt, pitch your concept
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handleCreateRoom}
                  disabled={!selectedGameMode}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: selectedGameMode ? 'var(--blue)' : 'var(--border)',
                    color: selectedGameMode ? 'white' : 'var(--text2)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-display)',
                    cursor: selectedGameMode ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    opacity: selectedGameMode ? 1 : 0.5
                  }}
                  onMouseEnter={(e) => {
                    if (selectedGameMode) {
                      e.currentTarget.style.background = '#1d4ed8'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedGameMode) {
                      e.currentTarget.style.background = 'var(--blue)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
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
                      padding: '14px 16px',
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
                    disabled={!roomCode.trim() || !selectedGameMode}
                    style={{
                      padding: '14px 20px',
                      background: (roomCode.trim() && selectedGameMode) ? 'var(--text)' : 'var(--border)',
                      color: (roomCode.trim() && selectedGameMode) ? 'white' : 'var(--text2)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-display)',
                      cursor: (roomCode.trim() && selectedGameMode) ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                      opacity: (roomCode.trim() && selectedGameMode) ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => {
                      if (roomCode.trim() && selectedGameMode) {
                        e.currentTarget.style.background = '#0a0e1a'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (roomCode.trim() && selectedGameMode) {
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
          </div>

          {/* Right Side - Player Stats and Recent Battles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Player Stats Card */}
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
              
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
              
              <div style={{ 
                height: '1px', 
                background: 'var(--border)', 
                margin: '24px 0' 
              }} />
              
              <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Username:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{display_name || username}</span>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Matches:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{totalMatches}</span>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Win Rate:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{winRate}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Status:</span>
                  <span style={{ fontWeight: 600, color: 'var(--green)' }}>Ready to battle!</span>
                </div>
              </div>
            </div>

            {/* Recent Battles Section */}
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
                Recent Battles
              </h2>
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: 'var(--text2)',
                fontFamily: 'var(--font-body)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚔️</div>
                <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No battles yet</p>
                <p style={{ fontSize: '13px' }}>Start competing to see your battle history here!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
