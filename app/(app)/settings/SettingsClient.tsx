'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { signOut } from '@/app/actions/auth'
import { useTheme } from '@/components/ThemeProvider'

interface Profile {
  id: string
  username: string
  display_name?: string
  public_profile?: boolean
  show_elo_on_profile?: boolean
  appear_on_leaderboard?: boolean
}

interface SettingsData {
  profile: Profile
  email: string
  isEmailUser: boolean
}

export default function SettingsClient({ initialProfile }: { initialProfile: Profile | null }) {
  const { user, authLoading } = useSupabase()
  const { theme, setTheme, isLoading: themeLoading } = useTheme()
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null)
  const [activeSection, setActiveSection] = useState('account')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')

  // Form states
  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [publicProfile, setPublicProfile] = useState(true)
  const [showElo, setShowElo] = useState(true)
  const [appearOnLeaderboard, setAppearOnLeaderboard] = useState(true)

  useEffect(() => {
    if (user && !settingsData) {
      fetchSettings()
    }
  }, [user, settingsData])

  useEffect(() => {
    if (settingsData) {
      setUsername(settingsData.profile.username)
      setPublicProfile(settingsData.profile.public_profile ?? true)
      setShowElo(settingsData.profile.show_elo_on_profile ?? true)
      setAppearOnLeaderboard(settingsData.profile.appear_on_leaderboard ?? true)
    }
  }, [settingsData])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/settings/api')
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      
      const data = await response.json()
      setSettingsData(data)
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/settings/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'update_username',
          data: { username }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        showMessage('success', 'Username updated successfully')
        fetchSettings() // Refresh data
      } else {
        showMessage('error', result.error || 'Failed to update username')
      }
    } catch (err) {
      showMessage('error', 'Failed to update username')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      showMessage('error', 'Passwords do not match')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/settings/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'update_password',
          data: { currentPassword, newPassword }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        showMessage('success', 'Password updated successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        showMessage('error', result.error || 'Failed to update password')
      }
    } catch (err) {
      showMessage('error', 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePrivacy = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/settings/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'update_privacy',
          data: { 
            public_profile: publicProfile,
            show_elo_on_profile: showElo,
            appear_on_leaderboard: appearOnLeaderboard
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        showMessage('success', 'Privacy settings updated successfully')
        fetchSettings() // Refresh data
      } else {
        showMessage('error', result.error || 'Failed to update privacy settings')
      }
    } catch (err) {
      showMessage('error', 'Failed to update privacy settings')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showMessage('error', 'Please enter your password')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/settings/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'delete_account',
          data: { password: deletePassword }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Redirect to home after successful deletion
        window.location.href = '/'
      } else {
        showMessage('error', result.error || 'Failed to delete account')
        setDeleteModalOpen(false)
        setDeletePassword('')
      }
    } catch (err) {
      showMessage('error', 'Failed to delete account')
      setDeleteModalOpen(false)
      setDeletePassword('')
    } finally {
      setLoading(false)
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

  const sidebarItems = [
    { id: 'account', label: 'Account' },
    ...(settingsData?.isEmailUser ? [{ id: 'password', label: 'Password' }] : []),
    { id: 'privacy', label: 'Privacy' },
    { id: 'theme', label: 'Theme' },
    { id: 'danger', label: 'Danger Zone' }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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

        {/* Message */}
        {message && (
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            background: message.type === 'success' ? 'var(--green-tint)' : '#fef2f2',
            border: `1px solid ${message.type === 'success' ? 'var(--green)' : '#fecaca'}`,
            color: message.type === 'success' ? 'var(--green)' : '#dc2626'
          }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Sidebar */}
          <div style={{
            width: '240px',
            flexShrink: 0
          }}>
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '8px',
              boxShadow: 'var(--shadow)'
            }}>
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: activeSection === item.id ? 'var(--green-tint)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: activeSection === item.id ? 'var(--green)' : 'var(--text)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '4px'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            {/* Account Section */}
            {activeSection === 'account' && (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: 'var(--shadow)'
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)',
                  marginBottom: '24px'
                }}>
                  Account
                </h2>

                {/* Email */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    color: 'var(--text)',
                    marginBottom: '8px'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={settingsData?.email || ''}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: 'var(--card2)',
                      color: 'var(--text2)'
                    }}
                  />
                </div>

                {/* Username */}
                <form onSubmit={handleUpdateUsername}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: 'var(--text)',
                      marginBottom: '8px'
                    }}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'var(--bg)',
                        color: 'var(--text)'
                      }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      background: 'var(--green)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Saving...' : 'Save changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Password Section */}
            {activeSection === 'password' && settingsData?.isEmailUser && (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: 'var(--shadow)'
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)',
                  marginBottom: '24px'
                }}>
                  Password
                </h2>

                <form onSubmit={handleUpdatePassword}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: 'var(--text)',
                      marginBottom: '8px'
                    }}>
                      Current password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'var(--bg)',
                        color: 'var(--text)'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: 'var(--text)',
                      marginBottom: '8px'
                    }}>
                      New password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'var(--bg)',
                        color: 'var(--text)'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: 'var(--text)',
                      marginBottom: '8px'
                    }}>
                      Confirm new password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'var(--bg)',
                        color: 'var(--text)'
                      }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      background: 'var(--green)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Updating...' : 'Update password'}
                  </button>
                </form>
              </div>
            )}

            {/* Privacy Section */}
            {activeSection === 'privacy' && (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: 'var(--shadow)'
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)',
                  marginBottom: '24px'
                }}>
                  Privacy
                </h2>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '16px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--card2)'
                  }}>
                    <input
                      type="checkbox"
                      checked={publicProfile}
                      onChange={(e) => setPublicProfile(e.target.checked)}
                      style={{ marginRight: '12px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>
                        Public profile
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                        Make your profile visible to other users
                      </div>
                    </div>
                  </label>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '16px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--card2)'
                  }}>
                    <input
                      type="checkbox"
                      checked={showElo}
                      onChange={(e) => setShowElo(e.target.checked)}
                      style={{ marginRight: '12px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>
                        Show ELO on profile
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                        Display your ELO rating on your public profile
                      </div>
                    </div>
                  </label>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '16px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--card2)'
                  }}>
                    <input
                      type="checkbox"
                      checked={appearOnLeaderboard}
                      onChange={(e) => setAppearOnLeaderboard(e.target.checked)}
                      style={{ marginRight: '12px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>
                        Appear on leaderboard
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                        Show your ranking on public leaderboards
                      </div>
                    </div>
                  </label>
                </div>
                
                <button
                  onClick={handleUpdatePrivacy}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--green)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Saving...' : 'Save privacy settings'}
                </button>
              </div>
            )}

            {/* Theme Section */}
            {activeSection === 'theme' && (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: 'var(--shadow)'
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)',
                  marginBottom: '24px'
                }}>
                  Theme
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
            )}

            {/* Danger Zone Section */}
            {activeSection === 'danger' && (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: 'var(--shadow)'
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-display)',
                  color: '#dc2626',
                  marginBottom: '24px'
                }}>
                  Danger Zone
                </h2>

                {/* Log out */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>
                      Log out
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                      Sign out of your account
                    </div>
                  </div>
                  <form action={signOut}>
                    <button
                      type="submit"
                      style={{
                        padding: '12px 24px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Log out
                    </button>
                  </form>
                </div>

                {/* Delete Account */}
                <div style={{ 
                  padding: '24px',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  background: '#fef2f2'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: 500, color: '#dc2626', marginBottom: '4px' }}>
                      Delete account
                    </div>
                    <div style={{ fontSize: '13px', color: '#991b1b' }}>
                      Permanently delete your account and all data. This cannot be undone.
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    style={{
                      padding: '12px 24px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {deleteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: 'var(--text)',
              marginBottom: '16px'
            }}>
              Delete Account
            </h3>
            <p style={{ 
              color: 'var(--text2)', 
              marginBottom: '24px',
              lineHeight: 1.5
            }}>
              Are you sure? This permanently deletes your account and all data. This cannot be undone.
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 500, 
                color: 'var(--text)',
                marginBottom: '8px'
              }}>
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--bg)',
                  color: 'var(--text)'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setDeletePassword('')
                }}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: 'var(--card2)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
