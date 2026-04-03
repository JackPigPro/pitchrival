'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { signOut } from '@/app/actions/auth'
import { useTheme } from '@/components/ThemeProvider'

interface Profile {
  id: string
  username: string
  display_name?: string
}

export default function SettingsClient({ initialProfile }: { initialProfile: Profile | null }) {
  const { user, authLoading } = useSupabase()
  const { theme, setTheme, isLoading: themeLoading } = useTheme()
  const [profile, setProfile] = useState<Profile | null>(initialProfile)

  useEffect(() => {
    if (user && !profile) {
      fetchProfile()
    }
  }, [user, profile])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/settings/api')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      
      const data = await response.json()
      setProfile(data.profile)
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    }
  }

  if (authLoading || themeLoading) {
    return null
  }

  if (!user) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 800, 
            marginBottom: '16px', 
            fontFamily: 'var(--font-display)',
            letterSpacing: '-1px'
          }}>
            Please log in
          </h2>
          <p style={{ 
            color: 'var(--text2)', 
            marginBottom: '24px', 
            fontSize: '16px',
            lineHeight: 1.5
          }}>
            You need to be signed in to access your settings.
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
              fontSize: '16px'
            }}
          >
            Log In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        padding: '40px 24px'
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 800, 
            fontFamily: 'var(--font-display)',
            letterSpacing: '-2px',
            color: 'var(--text)',
            marginBottom: '8px'
          }}>
            Settings
          </h1>
          <p style={{ 
            color: 'var(--text2)', 
            fontSize: '16px',
            margin: 0
          }}>
            Manage your account
          </p>
        </div>

        {/* Dark / Light Mode Card */}
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow)'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 700, 
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
            marginBottom: '24px'
          }}>
            Appearance
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px' 
          }}>
            {/* Light Option */}
            <div
              onClick={() => setTheme('light')}
              style={{
                border: theme === 'light' ? '2px solid var(--green)' : '1px solid var(--border)',
                background: theme === 'light' ? 'var(--green-tint)' : 'var(--card2)',
                borderRadius: '12px',
                padding: '16px',
                cursor: theme === 'light' ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                height: '80px',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                marginBottom: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Grid lines for light theme */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
                {/* Green square representing logo */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '12px',
                  height: '12px',
                  background: 'var(--green)',
                  borderRadius: '2px'
                }} />
              </div>
              <div style={{ fontWeight: 700, color: theme === 'light' ? 'var(--text)' : 'var(--text)', marginBottom: '4px' }}>
                Light
              </div>
              <div style={{ fontSize: '13px', color: theme === 'light' ? 'var(--text2)' : 'var(--text2)' }}>
                Default
              </div>
            </div>

            {/* Dark Option */}
            <div
              onClick={() => setTheme('dark')}
              style={{
                border: theme === 'dark' ? '2px solid var(--green)' : '1px solid var(--border)',
                background: theme === 'dark' ? 'var(--green-tint)' : 'var(--card2)',
                borderRadius: '12px',
                padding: '16px',
                cursor: theme === 'dark' ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                height: '80px',
                borderRadius: '10px',
                background: '#0b1220',
                border: '1px solid #1e293b',
                marginBottom: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Grid lines for dark theme */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
                {/* Green square representing logo */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '12px',
                  height: '12px',
                  background: 'var(--green)',
                  borderRadius: '2px'
                }} />
              </div>
              <div style={{ fontWeight: 700, color: theme === 'dark' ? '#15803d' : 'var(--text)', marginBottom: '4px' }}>
                Dark
              </div>
              <div style={{ fontSize: '13px', color: theme === 'dark' ? '#166534' : 'var(--text2)' }}>
                Easy on the eyes
              </div>
            </div>
          </div>
        </div>

        {/* Account Card */}
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: 'var(--shadow)'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 700, 
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
            marginBottom: '16px'
          }}>
            Account
          </h2>
          
          {profile?.username && (
            <p style={{ 
              color: 'var(--text2)', 
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              @{profile.username}
            </p>
          )}
          
          <div style={{ 
            borderTop: '1px solid var(--border)',
            paddingTop: '20px'
          }}>
            <form action={signOut}>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626'
                }}
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
