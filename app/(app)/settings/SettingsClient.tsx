'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Profile {
  id: string
  username: string
  display_name?: string
}

export default function SettingsClient({ initialProfile }: { initialProfile: Profile | null }) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!profile) {
      fetchProfile()
    }
  }, [])

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


  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[var(--surface)] rounded w-48 mb-8"></div>
            <div className="bg-[var(--card)] rounded-xl p-6 space-y-4">
              <div className="h-6 bg-[var(--surface)] rounded w-32"></div>
              <div className="space-y-3">
                <div className="h-20 bg-[var(--surface)] rounded"></div>
                <div className="h-20 bg-[var(--surface)] rounded"></div>
                <div className="h-20 bg-[var(--surface)] rounded"></div>
              </div>
            </div>
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
          <p className="text-[var(--text2)]">
            More settings coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}
