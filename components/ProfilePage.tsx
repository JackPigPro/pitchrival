'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import CountryDropdown from './CountryDropdown'

interface Profile {
  id: string
  username: string
  location?: string
  bio?: string
  stage?: string
  skills?: string[]
  status_tags?: string[]
  twitter?: string
  linkedin?: string
  github?: string
  created_at: string
}

interface UserStats {
  elo?: number
  rank?: string
  weekly_duel_entered?: number
  daily_rank?: number
  alltime_rank?: number
  weekly_duels_count?: number
}

interface Idea {
  id: string
  title: string
  description: string
  created_at: string
}

interface ProfilePageProps {
  profile: Profile
  userStats?: UserStats
  ideas: Idea[]
  isOwnProfile: boolean
  dailyRank?: number
  alltimeRank?: number
  weeklyDuelsCount?: number
}

export default function ProfilePage({ profile: initialProfile, userStats, ideas, isOwnProfile, dailyRank, alltimeRank, weeklyDuelsCount }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(initialProfile)
  const [editData, setEditData] = useState({
    username: initialProfile.username || '',
    location: initialProfile.location || '',
    bio: initialProfile.bio || '',
    stage: initialProfile.stage || '',
    skills: initialProfile.skills || [],
    status_tags: initialProfile.status_tags || [],
    social_links: {
      x: initialProfile.twitter || '',
      linkedin: initialProfile.linkedin || '',
      github: initialProfile.github || ''
    }
  })

  const supabase = createClient()

  const handleSave = async () => {
    console.log('🔧 Save button clicked - starting save process')
    setLoading(true)
    setSaveSuccess(false)
    
    try {
      console.log('🔍 Getting authenticated user...')
      // Get the authenticated user's ID from Supabase auth
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('❌ Auth error:', authError)
        throw new Error(`Auth error: ${authError.message}`)
      }
      
      if (!user) {
        console.error('❌ No user found')
        throw new Error('User not authenticated')
      }
      
      console.log('✅ User authenticated:', user.id)
      console.log('📝 Updating profile with data:', {
        username: editData.username.toLowerCase(),
        location: editData.location,
        bio: editData.bio,
        stage: editData.stage,
        skills: editData.skills,
        status_tags: editData.status_tags,
        twitter: editData.social_links.x || undefined,
        linkedin: editData.social_links.linkedin || undefined,
        github: editData.social_links.github || undefined
      })

      // Update profile using proper Supabase client
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: editData.username.toLowerCase(),
          location: editData.location,
          bio: editData.bio,
          stage: editData.stage,
          skills: editData.skills,
          status_tags: editData.status_tags,
          twitter: editData.social_links.x || undefined,
          linkedin: editData.social_links.linkedin || undefined,
          github: editData.social_links.github || undefined
        })
        .eq('id', user.id)

      console.log('📊 Supabase update response:', { data, error })

      if (error) {
        console.error('❌ Database update error:', error)
        throw new Error(`Database error: ${error.message}`)
      }
      
      console.log('✅ Profile updated successfully')
      
      // Update local state with saved data
      const updatedProfile = {
        ...currentProfile,
        id: user.id,
        username: editData.username.toLowerCase(),
        location: editData.location,
        bio: editData.bio,
        stage: editData.stage,
        skills: editData.skills,
        status_tags: editData.status_tags,
        twitter: editData.social_links.x || undefined,
        linkedin: editData.social_links.linkedin || undefined,
        github: editData.social_links.github || undefined
      }
      
      console.log('🔄 Updating local state...')
      setCurrentProfile(updatedProfile)
      setSaveSuccess(true)
      
      console.log('⏰ Setting timeout to exit edit mode...')
      setTimeout(() => {
        console.log('🚪 Exiting edit mode')
        setIsEditing(false)
        setSaveSuccess(false)
      }, 1000)
      
    } catch (error) {
      console.error('💥 Error updating profile:', error)
      alert(`Error saving profile: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      console.log('🏁 Save process completed, setting loading to false')
      setLoading(false)
    }
  }

  const toggleSkill = (skill: string) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const toggleStatusTag = (tag: string) => {
    setEditData(prev => ({
      ...prev,
      status_tags: prev.status_tags.includes(tag)
        ? prev.status_tags.filter(t => t !== tag)
        : [...prev.status_tags, tag]
    }))
  }

  const getProfileColor = (username: string) => {
    const colors = ['#16a34a', '#2563eb', '#7c3aed', '#dc2626', '#ca8a04']
    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  const getCountryFlag = (countryName?: string) => {
    if (!countryName) return ''
    
    const countryFlags: { [key: string]: string } = {
      'United States': '🇺🇸',
      'USA': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'UK': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Belgium': '🇧🇪',
      'Austria': '🇦🇹',
      'Switzerland': '🇨🇭',
      'Poland': '🇵🇱',
      'Ireland': '🇮🇪',
      'Portugal': '🇵🇹',
      'Greece': '🇬🇷',
      'Czech Republic': '🇨🇿',
      'Hungary': '🇭🇺',
      'Romania': '🇷🇴',
      'Bulgaria': '🇧🇬',
      'Croatia': '🇭🇷',
      'Slovakia': '🇸🇰',
      'Slovenia': '🇸🇮',
      'Estonia': '🇪🇪',
      'Latvia': '🇱🇻',
      'Lithuania': '🇱🇹',
      'Luxembourg': '🇱🇺',
      'Malta': '🇲🇹',
      'Cyprus': '🇨🇾',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'South Korea': '🇰🇷',
      'India': '🇮🇳',
      'Singapore': '🇸🇬',
      'Hong Kong': '🇭🇰',
      'Taiwan': '🇹🇼',
      'Thailand': '🇹🇭',
      'Malaysia': '🇲🇾',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭',
      'Vietnam': '🇻🇳',
      'Brazil': '🇧🇷',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Colombia': '🇨🇴',
      'Peru': '🇵🇪',
      'Mexico': '🇲🇽',
      'South Africa': '🇿🇦',
      'Egypt': '🇪🇬',
      'Nigeria': '🇳🇬',
      'Kenya': '🇰🇪',
      'Morocco': '🇲🇦',
      'Ghana': '🇬🇭',
      'Israel': '🇮🇱',
      'UAE': '🇦🇪',
      'Saudi Arabia': '🇸🇦',
      'Turkey': '🇹🇷',
      'Russia': '🇷🇺',
      'Ukraine': '🇺🇦',
      'New Zealand': '🇳🇿'
    }
    
    return countryFlags[countryName] || '🌍'
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

  const stageOptions = ['Idea Stage', 'Building MVP', 'Already Launched']
  const skillOptions = ['Design', 'Code', 'Marketing', 'Sales', 'Finance']
  const statusTagOptions = ['Looking for Co-founder', 'Open to be a Co-founder', 'Message me for ideas', 'Open to feedback']

  if (isEditing) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
              Edit Profile
            </h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border2)',
                    background: 'var(--card2)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Location
                </label>
                <CountryDropdown
                  value={editData.location}
                  onChange={(value) => setEditData(prev => ({ ...prev, location: value }))}
                  placeholder="Select country"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Bio
                </label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border2)',
                    background: 'var(--card2)',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Stage
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {stageOptions.map(stage => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setEditData(prev => ({ ...prev, stage }))}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: `1px solid ${editData.stage === stage ? 'var(--green)' : 'var(--border2)'}`,
                        background: editData.stage === stage ? 'var(--green-tint)' : 'var(--card2)',
                        color: editData.stage === stage ? 'var(--green)' : 'var(--text2)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Skills
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {skillOptions.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: `1px solid ${editData.skills.includes(skill) ? 'var(--blue)' : 'var(--border2)'}`,
                        background: editData.skills.includes(skill) ? 'var(--blue-tint)' : 'var(--card2)',
                        color: editData.skills.includes(skill) ? 'var(--blue)' : 'var(--text2)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Status Tags
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {statusTagOptions.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleStatusTag(tag)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: `1px solid ${editData.status_tags.includes(tag) ? 'var(--purple)' : 'var(--border2)'}`,
                        background: editData.status_tags.includes(tag) ? 'var(--purple-tint)' : 'var(--card2)',
                        color: editData.status_tags.includes(tag) ? 'var(--purple)' : 'var(--text2)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Social Links
                </label>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="X username"
                    value={editData.social_links.x || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, x: e.target.value }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border2)',
                      background: 'var(--card2)',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn username"
                    value={editData.social_links.linkedin || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, linkedin: e.target.value }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border2)',
                      background: 'var(--card2)',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="GitHub username"
                    value={editData.social_links.github || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, github: e.target.value }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border2)',
                      background: 'var(--card2)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid var(--border2)',
                    background: 'var(--card2)',
                    color: 'var(--text)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || saveSuccess}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: saveSuccess ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'var(--green)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading || saveSuccess ? 'not-allowed' : 'pointer',
                    opacity: loading || saveSuccess ? 0.9 : 1,
                    transition: 'all 0.2s ease',
                    boxShadow: saveSuccess ? '0 4px 12px rgba(34,197,94,0.4)' : 'var(--shadow-md)',
                    transform: saveSuccess ? 'scale(0.98)' : 'scale(1)'
                  }}
                >
                  {saveSuccess ? '✓ Saved!' : loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
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
          <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px', fontFamily: 'var(--font-display)', color: 'var(--text)', margin: 0 }}>
            {currentProfile.username}
          </h1>
        </div>

        {/* FULL WIDTH PROFILE CARD */}
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          marginBottom: '32px'
        }}>
          {/* Profile Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px' }}>
            {/* Profile Circle */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${getProfileColor(currentProfile.username)}, ${getProfileColor(currentProfile.username)}dd)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '32px',
              fontWeight: '800',
              fontFamily: 'var(--font-display)',
              flexShrink: 0,
              boxShadow: 'var(--shadow-md)',
              border: '3px solid var(--card)'
            }}>
              {currentProfile.username.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  fontFamily: 'var(--font-display)', 
                  color: 'var(--text)', 
                  margin: 0
                }}>
                  {currentProfile.username}
                </h2>
                {currentProfile.stage && (
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    background: 'var(--green)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-display)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {currentProfile.stage}
                  </span>
                )}
              </div>

              {/* Location */}
              {currentProfile.location && (
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text2)', 
                  marginBottom: '12px',
                  fontWeight: '600',
                  fontFamily: 'var(--font-body)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {getCountryFlag(currentProfile.location)} {currentProfile.location}
                </div>
              )}

              {/* Bio */}
              {currentProfile.bio && (
                <p style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.5', 
                  color: 'var(--text)', 
                  marginBottom: '16px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '500'
                }}>
                  {currentProfile.bio}
                </p>
              )}

              {/* Skills */}
              {currentProfile.skills && currentProfile.skills.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Skills
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {currentProfile.skills.map(skill => (
                      <span 
                        key={skill}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '16px',
                          background: 'var(--blue-tint)',
                          color: 'var(--blue)',
                          fontSize: '11px',
                          fontWeight: '700',
                          fontFamily: 'var(--font-display)',
                          border: '1px solid var(--blue)'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Tags */}
              {currentProfile.status_tags && currentProfile.status_tags.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Status
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {currentProfile.status_tags.map(tag => (
                      <span 
                        key={tag}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '16px',
                          background: 'var(--purple-tint)',
                          color: 'var(--purple)',
                          fontSize: '11px',
                          fontWeight: '700',
                          fontFamily: 'var(--font-display)',
                          border: '1px solid var(--purple)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(currentProfile.twitter || currentProfile.linkedin || currentProfile.github) && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {currentProfile.twitter && (
                    <a 
                      href={`https://x.com/${currentProfile.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'var(--card2)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text2)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '700',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#000'
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.borderColor = '#000'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--card2)'
                        e.currentTarget.style.color = 'var(--text2)'
                        e.currentTarget.style.borderColor = 'var(--border2)'
                      }}
                    >
                      𝕏
                    </a>
                  )}
                  {currentProfile.linkedin && (
                    <a 
                      href={`https://linkedin.com/in/${currentProfile.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'var(--card2)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text2)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '700',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#0077b5'
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.borderColor = '#0077b5'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--card2)'
                        e.currentTarget.style.color = 'var(--text2)'
                        e.currentTarget.style.borderColor = 'var(--border2)'
                      }}
                    >
                      in
                    </a>
                  )}
                  {currentProfile.github && (
                    <a 
                      href={`https://github.com/${currentProfile.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'var(--card2)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text2)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '700',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#333'
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.borderColor = '#333'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--card2)'
                        e.currentTarget.style.color = 'var(--text2)'
                        e.currentTarget.style.borderColor = 'var(--border2)'
                      }}
                    >
                      ⚡
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Edit Profile Button */}
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-cta-primary"
              style={{
                width: '100%',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Two Column Layout for Content Below Profile */}
        <div className="profile-grid">
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* ELO and Rank Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: '800', 
                  color: 'var(--green)', 
                  fontFamily: 'var(--font-display)',
                  marginBottom: '8px'
                }}>
                  {userStats?.elo || '—'}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text2)',
                  fontWeight: '600',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '20px'
                }}>
                  Current ELO
                </div>
              </div>
              
              <div style={{ 
                height: '1px', 
                background: 'var(--border)', 
                margin: '20px 0' 
              }} />
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: '800', 
                  color: 'var(--blue)', 
                  fontFamily: 'var(--font-display)',
                  marginBottom: '8px'
                }}>
                  {getRankByElo(userStats?.elo)}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text2)',
                  fontWeight: '600',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  Current Rank
                </div>
              </div>

              <div style={{ 
                height: '1px', 
                background: 'var(--border)', 
                margin: '20px 0' 
              }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    color: 'var(--purple)', 
                    fontFamily: 'var(--font-display)',
                    marginBottom: '4px'
                  }}>
                    #{dailyRank || '—'}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text2)',
                    fontWeight: '600',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>
                    Daily Rank
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    color: 'var(--purple)', 
                    fontFamily: 'var(--font-display)',
                    marginBottom: '4px'
                  }}>
                    #{alltimeRank || '—'}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text2)',
                    fontWeight: '600',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>
                    All-Time Rank
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Duels Entered Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: '800', 
                color: 'var(--purple)', 
                fontFamily: 'var(--font-display)',
                marginBottom: '12px'
              }}>
                {weeklyDuelsCount || 0}
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: 'var(--text2)',
                fontWeight: '600',
                fontFamily: 'var(--font-display)',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                Weekly Duels Entered
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Ideas Posted Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              {/* Header with Post New Idea Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: '800', 
                    color: 'var(--text)', 
                    fontFamily: 'var(--font-display)',
                    marginBottom: '4px'
                  }}>
                    Ideas Posted
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: 'var(--text2)',
                    fontWeight: '600',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                  }}>
                    {ideas.length} ideas
                  </div>
                </div>
                {isOwnProfile && (
                  <a
                    href="/connect/ideas"
                    className="btn-cta-primary"
                    style={{
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px 20px',
                      fontSize: '14px'
                    }}
                  >
                    Post New Idea
                  </a>
                )}
              </div>

              {/* Ideas List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {ideas.length > 0 ? (
                  ideas.map(idea => (
                    <a
                      key={idea.id}
                      href="/connect/ideas"
                      style={{
                        display: 'block',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--card2)',
                        border: '1px solid var(--border2)',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                        e.currentTarget.style.borderColor = 'var(--border)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = 'var(--border2)'
                      }}
                    >
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-display)',
                        color: 'var(--text)',
                        marginBottom: '8px'
                      }}>
                        {idea.title}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--text2)',
                        fontFamily: 'var(--font-body)',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {idea.description}
                      </div>
                    </a>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: 'var(--text2)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)'
                  }}>
                    No ideas posted yet
                  </div>
                )}
              </div>
            </div>

            {/* Member Since Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), #f59e0b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  📅
                </div>
                <div>
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--text3)',
                    fontWeight: '600',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}>
                    Member Since
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-display)',
                    color: 'var(--gold)',
                    marginBottom: '4px'
                  }}>
                    {(() => {
                      const createdAt = currentProfile.created_at.endsWith('Z') ? currentProfile.created_at : currentProfile.created_at + 'Z'
                      return new Date(createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
