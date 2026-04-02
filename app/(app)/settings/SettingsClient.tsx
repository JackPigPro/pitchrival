'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

type MessagePreference = 'anyone' | 'cofounders_only' | 'nobody'

interface Profile {
  id: string
  username: string
  display_name?: string
  message_preference?: MessagePreference
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

  const handleMessagePreferenceChange = async (preference: MessagePreference) => {
    if (!profile) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(false)
      
      const response = await fetch('/settings/api', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message_preference: preference }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update preference')
      }
      
      const data = await response.json()
      setProfile(data.profile)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const messageOptions = [
    {
      value: 'anyone' as MessagePreference,
      label: 'Anyone',
      description: 'Anyone on PitchRival can message you'
    },
    {
      value: 'cofounders_only' as MessagePreference,
      label: 'Co-founders only',
      description: 'Only accepted co-founder matches'
    },
    {
      value: 'nobody' as MessagePreference,
      label: 'Nobody',
      description: 'Turn off messages'
    }
  ]

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

        {/* Messaging Preferences Section */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text)] font-[var(--font-display)] mb-6">
            Messaging Preferences
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text2)] mb-4">
              Who can message you?
            </label>
            
            <div className="space-y-3">
              {messageOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleMessagePreferenceChange(option.value)}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${profile?.message_preference === option.value 
                      ? 'border-[var(--green)] bg-[var(--green-tint)]' 
                      : 'border-[var(--border)] hover:border-[var(--border2)] hover:bg-[var(--card2)]'
                    }
                    ${saving ? 'pointer-events-none opacity-50' : ''}
                  `}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className={`
                          w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center
                          ${profile?.message_preference === option.value 
                            ? 'border-[var(--green)] bg-[var(--green)]' 
                            : 'border-[var(--border2)]'
                          }
                        `}>
                          {profile?.message_preference === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <h3 className="font-medium text-[var(--text)]">
                          {option.label}
                        </h3>
                      </div>
                      <p className="text-sm text-[var(--text2)] mt-1 ml-7">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {saving && (
            <div className="text-sm text-[var(--text2)] mt-4">
              Saving...
            </div>
          )}
        </div>

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
