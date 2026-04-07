'use client'

import { useState } from 'react'

interface User {
  elo: number
  user_id: string
  rank_label: string
  profiles: {
    username: string
  }
  current_streak: number
}

interface EloHistory {
  elo_change: number
  new_elo: number
  user_id: string
  rank_label: string
  created_at: string
  profiles: {
    username: string
  }
}

interface LeaderboardClientProps {
  allUsers: User[]
  dailyHistory: EloHistory[]
  weeklyHistory: EloHistory[]
  currentUserId?: string | null
  currentUserStats?: {
    elo: number
    rank: string
  } | null
}

const getRankByElo = (elo?: number) => {
  if (!elo) return 'Builder'
  if (elo < 500) return 'Trainee'
  if (elo >= 500 && elo < 750) return 'Builder'
  if (elo >= 750 && elo < 1000) return 'Creator'
  if (elo >= 1000 && elo < 1250) return 'Founder'
  if (elo >= 1250 && elo < 1500) return 'Visionary'
  if (elo >= 1500 && elo < 1750) return 'Icon'
  if (elo >= 1750 && elo < 2000) return 'Titan'
  return 'Unicorn'
}

const getRankColor = (rank: string) => {
  switch (rank) {
    case 'Trainee': return '#9ca3af' // grey
    case 'Builder': return '#2563eb' // blue
    case 'Creator': return '#16a34a' // green
    case 'Founder': return '#ca8a04' // gold
    case 'Visionary': return '#7c3aed' // purple
    case 'Icon': return '#ea580c' // orange
    case 'Titan': return '#dc2626' // red
    case 'Unicorn': return 'linear-gradient(135deg, #7c3aed, #ec4899, #10b981)' // rainbow gradient
    default: return '#9ca3af'
  }
}

const getRankFaintColor = (rank: string) => {
  switch (rank) {
    case 'Trainee': return 'rgba(156, 163, 175, 0.1)' // faint grey
    case 'Builder': return 'rgba(37, 99, 235, 0.1)' // faint blue
    case 'Creator': return 'rgba(22, 163, 74, 0.1)' // faint green
    case 'Founder': return 'rgba(202, 138, 4, 0.1)' // faint gold
    case 'Visionary': return 'rgba(124, 58, 237, 0.1)' // faint purple
    case 'Icon': return 'rgba(234, 88, 12, 0.1)' // faint orange
    case 'Titan': return 'rgba(220, 38, 38, 0.1)' // faint red
    case 'Unicorn': return 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1), rgba(16, 185, 129, 0.1))' // faint rainbow gradient
    default: return 'rgba(156, 163, 175, 0.1)'
  }
}

const getRankGradient = (rank: string) => {
  // For text gradients, we need to handle this differently
  if (rank === 'Unicorn') {
    return 'linear-gradient(135deg, #7c3aed, #ec4899, #10b981)'
  }
  return getRankColor(rank)
}

const rankTiers = [
  { name: 'Trainee', min: 0, max: 499 },
  { name: 'Builder', min: 500, max: 749 },
  { name: 'Creator', min: 750, max: 999 },
  { name: 'Founder', min: 1000, max: 1249 },
  { name: 'Visionary', min: 1250, max: 1499 },
  { name: 'Icon', min: 1500, max: 1749 },
  { name: 'Titan', min: 1750, max: 1999 },
  { name: 'Unicorn', min: 2000, max: Infinity }
]

export default function LeaderboardClient({ 
  allUsers, 
  dailyHistory, 
  weeklyHistory, 
  currentUserId, 
  currentUserStats 
}: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'alltime'>('alltime')

  // Get unique users for each time period
  const getUniqueUsers = (history: EloHistory[], isPeriodGain: boolean = false) => {
    const uniqueUsers = new Map()
    history.forEach(entry => {
      if (!uniqueUsers.has(entry.user_id)) {
        uniqueUsers.set(entry.user_id, {
          elo: isPeriodGain ? entry.new_elo : entry.new_elo, // For period gains, new_elo contains the sum of elo_change
          user_id: entry.user_id,
          rank_label: entry.rank_label, // Preserve rank label from all-time ELO
          profiles: { username: entry.profiles.username },
          elo_change: entry.elo_change // Keep the original change for reference
        })
      }
    })
    return Array.from(uniqueUsers.values())
  }

  const getDisplayUsers = () => {
    switch (activeTab) {
      case 'daily':
        return getUniqueUsers(dailyHistory, true)
      case 'weekly':
        return getUniqueUsers(weeklyHistory, true)
      case 'alltime':
        return allUsers
      default:
        return allUsers
    }
  }

  const displayUsers = getDisplayUsers()
  const currentUserRank = getRankByElo(currentUserStats?.elo)

  // Get top 10 users, then add current user if not in top 10 (only if authenticated)
  const top10Users = displayUsers.slice(0, 10)
  const currentUserInList = currentUserId ? displayUsers.find(user => user.user_id === currentUserId) : null
  
  let displayList = top10Users
  if (currentUserInList && !top10Users.find(user => user.user_id === currentUserId)) {
    displayList = [...top10Users, currentUserInList]
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
          <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px', fontFamily: 'var(--font-display)', color: 'var(--text)', margin: 0 }}>
            Leaderboard
          </h1>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '400', 
            fontFamily: 'var(--font-body)', 
            color: 'var(--text2)', 
            marginTop: '8px' 
          }}>
            {activeTab === 'daily' && 'ELO gained in the last 24 hours'}
            {activeTab === 'weekly' && 'ELO gained in the last 7 days'}
            {activeTab === 'alltime' && 'All time ELO'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          {/* Left Side - Leaderboard List */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            {/* Tab Switcher */}
            <div style={{ 
              display: 'flex', 
              gap: '4px', 
              marginBottom: '24px',
              background: 'var(--surface)',
              padding: '4px',
              borderRadius: '12px'
            }}>
              {(['daily', 'weekly', 'alltime'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: activeTab === tab ? 'var(--green)' : 'transparent',
                    color: activeTab === tab ? 'white' : 'var(--text)',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                    letterSpacing: '-0.1px',
                    boxShadow: activeTab === tab ? '0 2px 4px rgba(34, 197, 94, 0.2)' : 'none'
                  }}
                >
                  {tab === 'alltime' ? 'All Time' : tab}
                </button>
              ))}
            </div>

            {/* Column Headers */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '48px 1fr 80px 100px', 
              gap: '16px',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                fontFamily: 'var(--font-display)', 
                color: 'var(--text2)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                #
              </div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                fontFamily: 'var(--font-display)', 
                color: 'var(--text2)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Username
              </div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                fontFamily: 'var(--font-display)', 
                color: 'var(--text2)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                textAlign: 'right'
              }}>
                {activeTab === 'daily' || activeTab === 'weekly' ? 'Gain' : 'ELO'}
              </div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                fontFamily: 'var(--font-display)', 
                color: 'var(--text2)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                Rank
              </div>
            </div>

            {/* Leaderboard Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayList.map((user, index) => {
                const rank = index + 1
                const isCurrentUser = currentUserId && user.user_id === currentUserId
                const userRank = activeTab === 'alltime' ? getRankByElo(user.elo) : user.rank_label
                const rankColor = getRankColor(userRank)

                return (
                  <div
                    key={user.user_id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '48px 1fr 80px 100px',
                      gap: '16px',
                      alignItems: 'center',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      background: isCurrentUser ? 'var(--green-tint)' : 'transparent',
                      border: isCurrentUser ? '1px solid var(--green)' : '1px solid var(--border)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Rank Number */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: rank <= 3 ? 'linear-gradient(135deg, var(--gold), #f59e0b)' : 'var(--surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '800',
                      fontFamily: 'var(--font-display)',
                      color: rank <= 3 ? '#fff' : 'var(--text2)'
                    }}>
                      {rank}
                    </div>

                    {/* Username */}
                    <a
                      href={`/profile/${user.profiles.username}`}
                      style={{
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-display)',
                        color: 'var(--text)',
                        letterSpacing: '-0.1px'
                      }}
                    >
                      {user.profiles.username}
                      {isCurrentUser && (
                        <span style={{
                          marginLeft: '8px',
                          fontSize: '12px',
                          color: 'var(--green)',
                          fontWeight: '600'
                        }}>
                          (You)
                        </span>
                      )}
                      {user.current_streak > 0 && (
                        <span style={{
                          marginLeft: '8px',
                          fontSize: '14px',
                          color: 'var(--text2)',
                          fontWeight: '600'
                        }}>
                          🔥 {user.current_streak}
                        </span>
                      )}
                    </a>

                    {/* ELO Score */}
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      fontFamily: 'var(--font-display)',
                      color: (activeTab === 'daily' || activeTab === 'weekly') 
                        ? (user.elo >= 0 ? 'var(--green)' : 'var(--red)') 
                        : 'var(--green)',
                      letterSpacing: '-0.2px',
                      textAlign: 'right'
                    }}>
                      {activeTab === 'daily' || activeTab === 'weekly' 
                        ? `${user.elo >= 0 ? '+' : ''}${user.elo}` 
                        : user.elo}
                    </div>

                    {/* Rank Title */}
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      fontFamily: 'var(--font-display)',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      background: getRankFaintColor(userRank),
                      color: rankColor,
                      border: `1px solid ${rankColor}20`,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      textAlign: 'center'
                    }}>
                      {userRank}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Side - User Stats Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* CTA Button */}
            <a
              href="/compete/weekly-duel"
              className="btn-cta-primary"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                textAlign: 'center'
              }}
            >
              ⚔️ Compete in Weekly Duel to earn ELO →
            </a>

            {/* Current User Stats - Only show if authenticated */}
            {currentUserId && (
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
                    fontSize: '64px', 
                    fontWeight: '800', 
                    color: 'var(--green)', 
                    fontFamily: 'var(--font-display)',
                    marginBottom: '8px'
                  }}>
                    {currentUserStats?.elo || 0}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: 'var(--text2)',
                    fontWeight: '600',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                  }}>
                    Your ELO
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
                    fontWeight: '800', 
                    color: getRankColor(currentUserRank), 
                    fontFamily: 'var(--font-display)',
                    marginBottom: '8px'
                  }}>
                    {currentUserRank}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: 'var(--text2)',
                    fontWeight: '600',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                  }}>
                    Your Rank
                  </div>
                </div>
              </div>
            )}

            {/* Rank Tiers */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                fontFamily: 'var(--font-display)', 
                color: 'var(--text)', 
                marginBottom: '20px',
                letterSpacing: '-0.1px'
              }}>
                Rank Tiers
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rankTiers.map((tier) => {
                  const isCurrentTier = currentUserId && currentUserRank === tier.name
                  const tierColor = getRankColor(tier.name)
                  
                  return (
                    <div
                      key={tier.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: isCurrentTier ? tierColor : getRankFaintColor(tier.name),
                        border: isCurrentTier ? 'none' : `1px solid ${tierColor}20`,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        fontSize: isCurrentTier ? '15px' : '14px',
                        fontWeight: isCurrentTier ? '800' : '700',
                        fontFamily: 'var(--font-display)',
                        color: isCurrentTier ? '#fff' : tierColor,
                        letterSpacing: '-0.1px'
                      }}>
                        {tier.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        fontFamily: 'var(--font-display)',
                        color: isCurrentTier ? '#fff' : 'var(--text2)',
                        letterSpacing: '0.5px'
                      }}>
                        {tier.min === 0 ? `0-${tier.max}` : `${tier.min}-${tier.max}`}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
