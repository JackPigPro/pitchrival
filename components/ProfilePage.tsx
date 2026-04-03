'use client'

import { useState, useEffect } from 'react'
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
}

interface Idea {
  id: string
  title: string
  content: string
  created_at: string
}

interface ProfilePageProps {
  profile: Profile
  userStats?: UserStats
  ideas: Idea[]
  isOwnProfile: boolean
  allTimeRank?: number | null
  dailyRank?: number | null
  weeklyDuelsCount?: number
}

export default function ProfilePage({ profile: initialProfile, userStats, ideas, isOwnProfile, allTimeRank, dailyRank, weeklyDuelsCount }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
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

  useEffect(() => {
    // Reset when entering edit mode
  }, [isEditing])

  const handleSave = async () => {
    if (!currentProfile?.id) return
    
    const { error } = await supabase
      .from('profiles')
      .update({
        username: editData.username.toLowerCase(),
        location: editData.location,
        bio: editData.bio,
        stage: editData.stage,
        skills: editData.skills,
        status_tags: editData.status_tags,
        twitter: editData.social_links?.x || null,
        linkedin: editData.social_links?.linkedin || null,
        github: editData.social_links?.github || null
      })
      .eq('id', currentProfile.id)

    if (error) {
      alert('Error saving. Please try again.')
      return
    }

    setCurrentProfile(prev => ({ ...prev, ...editData }))
    setIsEditing(false)
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
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--green)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  Save Changes
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* TOP SECTION - Full Width Header */}
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '48px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          marginBottom: '32px',
          position: 'relative'
        }}>
          {/* Edit Profile Button - Top Right */}
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-cta-ghost"
              style={{
                position: 'absolute',
                top: '48px',
                right: '48px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              Edit Profile
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '40px', justifyContent: 'space-between' }}>
            {/* Left: Profile Circle and Info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', flex: 1 }}>
              {/* Profile Circle */}
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${getProfileColor(currentProfile.username)}, ${getProfileColor(currentProfile.username)}dd)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '56px',
                fontWeight: '800',
                fontFamily: 'var(--font-display)',
                flexShrink: 0,
                boxShadow: 'var(--shadow-lg)',
                border: '4px solid var(--card)',
                position: 'relative',
                zIndex: 1
              }}>
                {currentProfile.username.charAt(0).toUpperCase()}
              </div>

              {/* Profile Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Username and Stage */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <h1 style={{ 
                    fontSize: '42px', 
                    fontWeight: '800', 
                    fontFamily: 'var(--font-display)', 
                    color: 'var(--text)', 
                    margin: 0,
                    letterSpacing: '-0.5px'
                  }}>
                    {currentProfile.username}
                  </h1>
                  {currentProfile.stage && (
                    <span style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: 'var(--green)',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.5px',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {currentProfile.stage}
                    </span>
                  )}
                </div>

                {/* Location */}
                {currentProfile.location && (
                  <div style={{ 
                    fontSize: '16px', 
                    color: 'var(--text2)', 
                    marginBottom: '16px',
                    fontWeight: '600',
                    fontFamily: 'var(--font-body)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {getCountryFlag(currentProfile.location)} {currentProfile.location}
                  </div>
                )}

                {/* Bio */}
                {currentProfile.bio && (
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.6', 
                    color: 'var(--text)', 
                    marginBottom: '24px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '500'
                  }}>
                    {currentProfile.bio}
                  </p>
                )}

                {/* Skills and Status Tags */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Skills */}
                  {currentProfile.skills && currentProfile.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {currentProfile.skills.map(skill => (
                        <span 
                          key={skill}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            background: 'var(--blue-tint)',
                            color: 'var(--blue)',
                            fontSize: '13px',
                            fontWeight: '700',
                            fontFamily: 'var(--font-display)',
                            letterSpacing: '0.3px',
                            border: '1px solid var(--blue)',
                            transition: 'all 0.2s ease',
                            cursor: 'default'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Status Tags */}
                  {currentProfile.status_tags && currentProfile.status_tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {currentProfile.status_tags.map(tag => (
                        <span 
                          key={tag}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            background: 'var(--purple-tint)',
                            color: 'var(--purple)',
                            fontSize: '13px',
                            fontWeight: '700',
                            fontFamily: 'var(--font-display)',
                            letterSpacing: '0.3px',
                            border: '1px solid var(--purple)',
                            transition: 'all 0.2s ease',
                            cursor: 'default'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links - Bottom Right */}
            {(currentProfile.twitter || currentProfile.linkedin || currentProfile.github) && (
              <div style={{ 
                position: 'absolute',
                bottom: '24px',
                right: '24px',
                display: 'flex', 
                gap: '12px',
                alignItems: 'center'
              }}>
                {currentProfile.twitter && (
                  <a 
                    href={`https://x.com/${currentProfile.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--card2)',
                      border: '1px solid var(--border2)',
                      color: 'var(--text2)',
                      textDecoration: 'none',
                      fontSize: '18px',
                      fontWeight: '700',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#000'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderColor = '#000'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--card2)'
                      e.currentTarget.style.color = 'var(--text2)'
                      e.currentTarget.style.borderColor = 'var(--border2)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
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
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--card2)',
                      border: '1px solid var(--border2)',
                      color: 'var(--text2)',
                      textDecoration: 'none',
                      fontSize: '18px',
                      fontWeight: '700',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0077b5'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderColor = '#0077b5'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--card2)'
                      e.currentTarget.style.color = 'var(--text2)'
                      e.currentTarget.style.borderColor = 'var(--border2)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
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
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--card2)',
                      border: '1px solid var(--border2)',
                      color: 'var(--text2)',
                      textDecoration: 'none',
                      fontSize: '18px',
                      fontWeight: '700',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#333'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderColor = '#333'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--card2)'
                      e.currentTarget.style.color = 'var(--text2)'
                      e.currentTarget.style.borderColor = 'var(--border2)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                    }}
                  >
                    ⚡
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '32px', 
          marginBottom: '32px'
        }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            {/* ELO and Rank Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              width: '100%'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  fontSize: '64px', 
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
                  fontSize: '36px', 
                  fontWeight: '800', 
                  color: getRankColor(getRankByElo(userStats?.elo)), 
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

              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: '800', 
                    color: 'var(--blue)', 
                    fontFamily: 'var(--font-display)',
                    marginBottom: '4px'
                  }}>
                    {dailyRank ? `#${dailyRank}` : '—'}
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
                <div style={{ 
                  width: '1px', 
                  background: 'var(--border)', 
                  margin: '0 16px' 
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: '800', 
                    color: 'var(--purple)', 
                    fontFamily: 'var(--font-display)',
                    marginBottom: '4px'
                  }}>
                    {allTimeRank ? `#${allTimeRank}` : '—'}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text2)',
                    fontWeight: '600',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>
                    All Time Rank
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
              textAlign: 'center',
              transition: 'all 0.2s ease',
              width: '100%'
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            {/* Ideas Posted Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.2s ease',
              width: '100%'
            }}>
              {/* Post New Idea Button */}
              <a
                href="/connect/ideas"
                className="btn-cta-primary"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginBottom: '24px'
                }}
              >
                💡 Post New Idea →
              </a>

              {/* Ideas Count */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: '800', 
                  color: ideas.length > 0 ? 'var(--blue)' : 'var(--text2)', 
                  fontFamily: 'var(--font-display)',
                  marginBottom: '12px'
                }}>
                  {ideas.length}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text2)',
                  fontWeight: '600',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  Ideas Posted
                </div>
              </div>

              {/* Ideas Preview */}
              {ideas.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {ideas.slice(0, 3).map((idea) => (
                    <a
                      key={idea.id}
                      href="/connect/ideas"
                      style={{
                        display: 'block',
                        padding: '16px',
                        borderRadius: '8px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--card2)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--surface)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '700', 
                        fontFamily: 'var(--font-display)', 
                        color: 'var(--text)', 
                        marginBottom: '4px',
                        letterSpacing: '-0.1px'
                      }}>
                        {idea.title}
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: 'var(--text2)', 
                        fontFamily: 'var(--font-body)',
                        fontWeight: '500',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {idea.content}
                      </div>
                    </a>
                  ))}
                  {ideas.length > 3 && (
                    <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                      <a
                        href="/connect/ideas"
                        style={{
                          fontSize: '14px',
                          color: 'var(--blue)',
                          fontWeight: '600',
                          textDecoration: 'none',
                          fontFamily: 'var(--font-display)'
                        }}
                      >
                        View all {ideas.length} ideas →
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Member Since Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              width: '100%'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '16px'
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
                  boxShadow: 'var(--shadow)'
                }}>
                  📅
                </div>
                <div style={{ textAlign: 'left' }}>
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
                    fontSize: '32px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-display)',
                    color: 'var(--gold)',
                    margin: 0,
                    marginBottom: '4px',
                    letterSpacing: '-0.5px'
                  }}>
                    {(() => {
                      // Fix: Append Z to ensure UTC parsing if not already present
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