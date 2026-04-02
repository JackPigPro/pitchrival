'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { signOut } from '@/app/actions/auth'

interface Profile {
  id: string
  username: string
  display_name?: string
}

export default function SettingsClient({ initialProfile }: { initialProfile: Profile | null }) {
  const { user, authLoading } = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      if (!profile) {
        fetchProfile()
      }
    }
  }, [user, profile])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/settings/api')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      
      const data = await response.json()
      setProfile(data.profile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }


  if (authLoading) {
    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
              Please log in to view settings
            </h2>
            <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
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
              }}
            >
              Log In
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] font-[var(--font-display)]">
            Settings
          </h1>
          <p className="text-[var(--text2)] mt-2">
            Manage your account preferences and privacy settings
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-[var(--green-tint)] border border-[var(--green-mid)] text-[var(--green)] px-4 py-3 rounded-lg">
            Settings saved successfully!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}


        {/* Account Section */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text)] font-[var(--font-display)] mb-4">
            Account
          </h2>
          <div className="space-y-4">
            <p className="text-[var(--text2)]">
              More settings coming soon.
            </p>
            <div className="pt-4 border-t border-[var(--border)]">
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full md:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
