'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

interface UserProfile {
  id: string
  username: string
  display_name?: string
  created_at: string
}

interface UserStats {
  ideas_count: number
  likes_received: number
  comments_count: number
  rank?: string
  elo_rating?: number
}

export default function DashboardClient() {
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setAuthLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      setError(null)
      setLoading(true)
      
      // Fetch user profile and stats
      const response = await fetch('/dashboard/api')
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const data = await response.json()
      setUserProfile(data.profile || null)
      setUserStats(data.stats || null)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to load dashboard data')
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--background)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--green)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: 'var(--text2)', fontSize: '16px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
          Please log in to view your dashboard
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
          You need to be signed in to access your personal dashboard.
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

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          marginBottom: '8px', 
          fontFamily: 'var(--font-display)',
          color: 'var(--text)'
        }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '16px' }}>
          Welcome back, {userProfile?.display_name || userProfile?.username || 'User'}!
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--green)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: 'var(--text2)', fontSize: '16px' }}>Loading dashboard...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Profile Card */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              marginBottom: '16px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)'
            }}>
              Profile
            </h2>
            {userProfile ? (
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text2)', fontSize: '14px' }}>Username:</span>
                  <span style={{ marginLeft: '8px', color: 'var(--text)', fontWeight: 500 }}>
                    @{userProfile.username}
                  </span>
                </div>
                {userProfile.display_name && (
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ color: 'var(--text2)', fontSize: '14px' }}>Display Name:</span>
                    <span style={{ marginLeft: '8px', color: 'var(--text)', fontWeight: 500 }}>
                      {userProfile.display_name}
                    </span>
                  </div>
                )}
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text2)', fontSize: '14px' }}>Member Since:</span>
                  <span style={{ marginLeft: '8px', color: 'var(--text)', fontWeight: 500 }}>
                    {formatDate(userProfile.created_at)}
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text2)' }}>Profile information not available</p>
            )}
          </div>

          {/* Stats Card */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              marginBottom: '16px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)'
            }}>
              Your Stats
            </h2>
            {userStats ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--green)' }}>
                    {userStats.ideas_count}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)' }}>Ideas Posted</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--blue)' }}>
                    {userStats.likes_received}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)' }}>Likes Received</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--purple)' }}>
                    {userStats.comments_count}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)' }}>Comments</div>
                </div>
                {userStats.elo_rating && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--orange)' }}>
                      {userStats.elo_rating}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text2)' }}>ELO Rating</div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: 'var(--text2)' }}>Stats not available</p>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              marginBottom: '16px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)'
            }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/connect/ideas"
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  background: 'var(--green)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textAlign: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--green-dark)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--green)'
                }}
              >
                📝 Share an Idea
              </Link>
              <Link
                href="/connect/cofounder-match"
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  background: 'var(--blue)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textAlign: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--blue-dark)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--blue)'
                }}
              >
                🤝 Find Co-founders
              </Link>
              <Link
                href="/connect/messages"
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  background: 'var(--purple)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textAlign: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--purple-dark)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--purple)'
                }}
              >
                💬 Messages
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            gridColumn: '1 / -1',
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              marginBottom: '16px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)'
            }}>
              Recent Activity
            </h2>
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <p>Activity tracking coming soon!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
