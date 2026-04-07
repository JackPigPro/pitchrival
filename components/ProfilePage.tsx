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

interface DailyStreak {
  current_streak: number
  longest_streak: number
  last_submission_date: string | null
}

interface ProfilePageProps {
  profile: Profile
  userStats?: UserStats
  ideas: Idea[]
  isOwnProfile: boolean
  allTimeRank?: number | null
  dailyRank?: number | null
  weeklyDuelsCount?: number
  dailyStreak?: DailyStreak | null
}

export default function ProfilePage({ profile: initialProfile, userStats, ideas, isOwnProfile, allTimeRank, dailyRank, weeklyDuelsCount, dailyStreak }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(initialProfile)
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [editData, setEditData] = useState({
    username: initialProfile.username || '',
    location: initialProfile.location || '',
    bio: initialProfile.bio || '',
    stage: initialProfile.stage || '',
    skills: initialProfile.skills || [],
    status_tags: initialProfile.status_tags || [],
    twitter: initialProfile.twitter || '',
    linkedin: initialProfile.linkedin || '',
    github: initialProfile.github || ''
  })

  const supabase = createClient()

  // Check username availability in real-time
  useEffect(() => {
    if (!isEditing || !editData.username.trim()) {
      setUsernameStatus(null)
      setUsernameError(null)
      return
    }

    // Skip validation if username hasn't changed
    if (editData.username.trim() === currentProfile.username) {
      setUsernameStatus(null)
      setUsernameError(null)
      return
    }

    // Validate username rules
    const validationRules = [
      {
        test: editData.username.length >= 3 && editData.username.length <= 20,
        message: 'Username must be 3-20 characters'
      },
      {
        test: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(editData.username),
        message: 'Username must start with a letter and contain only letters, numbers, and underscores'
      }
    ]

    const failedRule = validationRules.find(rule => !rule.test)
    if (failedRule) {
      setUsernameStatus('invalid')
      setUsernameError(failedRule.message)
      return
    }

    setUsernameError(null)

    const checkUsername = async () => {
      setUsernameStatus('checking')
      
      try {
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(editData.username.trim().toLowerCase())}`)
        const result = await response.json()

        if (!response.ok) {
          setUsernameStatus('invalid')
          setUsernameError(result.error || 'Failed to check username availability')
          return
        }

        setUsernameStatus(result.available ? 'available' : 'taken')
      } catch (err) {
        setUsernameStatus('invalid')
        setUsernameError('Failed to check username availability')
      }
    }

    const timeoutId = setTimeout(checkUsername, 300)
    return () => clearTimeout(timeoutId)
  }, [editData.username, isEditing, currentProfile.username])

  useEffect(() => {
    // Reset edit data when entering edit mode
    if (isEditing) {
      setEditData({
        username: currentProfile.username || '',
        location: currentProfile.location || '',
        bio: currentProfile.bio || '',
        stage: currentProfile.stage || '',
        skills: currentProfile.skills || [],
        status_tags: currentProfile.status_tags || [],
        twitter: currentProfile.twitter || '',
        linkedin: currentProfile.linkedin || '',
        github: currentProfile.github || ''
      })
    }
  }, [isEditing, currentProfile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Always validate username regex before submitting
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/
    if (!usernameRegex.test(editData.username.trim())) {
      alert('Username must start with a letter and contain only letters, numbers, and underscores. No spaces or special characters.')
      return
    }
    
    if (!currentProfile?.id) {
      alert('No profile ID found')
      return
    }

    // Validate username if it changed
    if (editData.username.trim() !== currentProfile.username) {
      if (usernameStatus !== 'available') {
        alert('Please choose a valid and available username')
        return
      }
    }
    
    try {
      const response = await fetch(`/profile/${currentProfile.username}/api/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: editData.username,
          location: editData.location,
          bio: editData.bio,
          stage: editData.stage,
          skills: editData.skills,
          status_tags: editData.status_tags,
          twitter: editData.twitter,
          linkedin: editData.linkedin,
          github: editData.github
        })
      })

      const result = await response.json()

      if (!response.ok) {
        alert(`Error saving profile: ${result.error}`)
        return
      }

      // Update local state
      setCurrentProfile(prev => ({
        ...prev,
        username: editData.username,
        location: editData.location,
        bio: editData.bio,
        stage: editData.stage,
        skills: editData.skills,
        status_tags: editData.status_tags,
        twitter: editData.twitter,
        linkedin: editData.linkedin,
        github: editData.github
      }))
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile. Please try again.')
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
    
    // Country code to flag emoji conversion
    const countryCodeToFlag: { [key: string]: string } = {
      'AF': '🇦🇫', 'AL': '�🇱', 'DZ': '🇩🇿', 'AD': '🇦🇩', 'AO': '🇦🇴', 'AG': '🇦🇬', 'AR': '🇦🇷', 'AM': '🇦🇲', 'AU': '🇦�🇺', 'AT': '�🇹',
      'AZ': '🇦🇿', 'BS': '�🇸', 'BH': '🇧🇭', 'BD': '🇧🇩', 'BB': '🇧🇧', 'BY': '🇧🇾', 'BE': '🇧🇪', 'BZ': '🇧🇿', 'BJ': '🇧�', 'BT': '🇧🇹',
      'BO': '🇧🇴', 'BA': '🇧🇦', 'BW': '🇧🇼', 'BR': '🇧🇷', 'BN': '🇧🇳', 'BG': '🇧🇬', 'BF': '🇧🇫', 'BI': '🇧🇮', 'CV': '🇨🇻', 'KH': '🇰🇭',
      'CM': '🇨🇲', 'CA': '🇨🇦', 'CF': '🇨🇫', 'TD': '🇹🇩', 'CL': '🇨🇱', 'CN': '🇨🇳', 'CO': '🇨🇴', 'KM': '🇰🇲', 'CG': '🇨🇬', 'CR': '🇨🇷',
      'HR': '🇭🇷', 'CU': '�🇺', 'CY': '🇨🇾', 'CZ': '🇨🇿', 'DK': '🇩🇰', 'DJ': '🇩🇯', 'DM': '🇩🇲', 'DO': '🇩🇴', 'EC': '🇪🇨', 'EG': '🇪🇬',
      'SV': '🇸🇻', 'GQ': '🇬🇶', 'ER': '�🇷', 'EE': '🇪🇪', 'SZ': '🇸🇿', 'ET': '🇪🇹', 'FJ': '🇫🇯', 'FI': '��🇮', 'FR': '🇫🇷', 'GA': '�🇦',
      'GM': '�🇲', 'GE': '🇬�🇪', 'DE': '�🇪', 'GH': '🇬🇭', 'GR': '🇬🇷', 'GD': '🇬🇩', 'GT': '🇬🇹', 'GN': '��🇳', 'GW': '�🇼', 'GY': '🇬🇾',
      'HT': '🇭🇹', 'HN': '🇭🇳', 'HU': '🇭🇺', 'IS': '��🇸', 'IN': '�🇳', 'ID': '🇮🇩', 'IR': '🇮🇷', 'IQ': '🇮🇶', 'IE': '🇮�🇪', 'IL': '🇮🇱',
      'IT': '��', 'JM': '🇯🇲', 'JP': '🇯🇵', 'JO': '🇯�🇴', 'KZ': '🇰🇿', 'KE': '🇰🇪', 'KI': '🇰🇮', 'KP': '��', 'KR': '�🇰🇷', 'KW': '🇰🇼',
      'KG': '��', 'LA': '🇱🇦', 'LV': '🇱🇻', 'LB': '🇱🇧', 'LS': '🇱�', 'LR': '🇱🇷', 'LY': '🇱🇾', 'LI': '🇱🇮', 'LT': '�🇹', 'LU': '🇱🇺',
      'MG': '🇲🇬', 'MW': '🇲🇼', 'MY': '🇲🇾', 'MV': '🇲🇻', 'ML': '🇲🇱', 'MT': '🇲🇹', 'MH': '�🇭', 'MR': '🇲🇷', 'MU': '🇲🇺', 'MX': '🇲🇽',
      'FM': '��', 'MD': '🇲🇩', 'MC': '🇲🇨', 'MN': '🇲🇳', 'ME': '�🇪', 'MA': '🇲🇦', 'MZ': '🇲🇿', 'MM': '🇲🇲', 'NA': '🇳🇦', 'NR': '🇳🇷',
      'NP': '🇳🇵', 'NL': '🇳�', 'NZ': '🇳🇿', 'NI': '🇳🇮', 'NE': '🇳🇪', 'NG': '��🇬', 'MK': '�🇰', 'NO': '🇳🇴', 'OM': '🇴🇲', 'PK': '🇵🇰',
      'PW': '🇵🇼', 'PA': '��', 'PG': '🇵🇬', 'PY': '🇵🇾', 'PE': '🇵🇪', 'PH': '��', 'PL': '🇵🇱', 'PT': '🇵🇹', 'QA': '🇶🇦', 'RO': '🇷🇴',
      'RU': '��', 'RW': '🇷🇼', 'KN': '🇰🇳', 'LC': '🇱🇨', 'VC': '🇻🇨', 'WS': '🇼🇸', 'SM': '🇸🇲', 'ST': '🇸🇹', 'SA': '🇸🇦', 'SN': '��',
      'RS': '🇷🇸', 'SC': '🇸🇨', 'SL': '🇸🇱', 'SG': '🇸🇬', 'SK': '🇸🇰', 'SI': '🇸🇮', 'SB': '🇸🇧', 'SO': '🇸🇴', 'ZA': '🇿🇦', 'SS': '🇸�',
      'ES': '🇪�', 'LK': '🇱🇰', 'SD': '🇸🇩', 'SR': '🇸🇷', 'SE': '��', 'CH': '🇨🇭', 'SY': '🇸🇾', 'TW': '🇹🇼', 'TJ': '��', 'TZ': '�🇹🇿',
      'TH': '🇹🇭', 'TL': '��🇱', 'TG': '🇹🇬', 'TO': '🇹�', 'TT': '🇹🇹', 'TN': '🇹🇳', 'TR': '🇹🇷', 'TM': '🇹🇲', 'TV': '🇹🇻', 'UG': '🇺🇬',
      'UA': '🇺🇦', 'AE': '🇦🇪', 'GB': '🇬🇧', 'US': '🇺🇸', 'UY': '�🇾', 'UZ': '🇺🇿', 'VU': '🇻🇺', 'VA': '🇻🇦', 'VE': '🇻🇪', 'VN': '��',
      'YE': '��', 'ZM': '🇿🇲', 'ZW': '🇿🇼'
    }
    
    // Country name to country code mapping
    const countryNameToCode: { [key: string]: string } = {
      'Afghanistan': 'AF', 'Albania': 'AL', 'Algeria': 'DZ', 'Andorra': 'AD', 'Angola': 'AO', 'Antigua and Barbuda': 'AG', 'Argentina': 'AR', 'Armenia': 'AM', 'Australia': 'AU', 'Austria': 'AT',
      'Azerbaijan': 'AZ', 'Bahamas': 'BS', 'Bahrain': 'BH', 'Bangladesh': 'BD', 'Barbados': 'BB', 'Belarus': 'BY', 'Belgium': 'BE', 'Belize': 'BZ', 'Benin': 'BJ', 'Bhutan': 'BT',
      'Bolivia': 'BO', 'Bosnia and Herzegovina': 'BA', 'Botswana': 'BW', 'Brazil': 'BR', 'Brunei': 'BN', 'Bulgaria': 'BG', 'Burkina Faso': 'BF', 'Burundi': 'BI', 'Cabo Verde': 'CV', 'Cambodia': 'KH',
      'Cameroon': 'CM', 'Canada': 'CA', 'Central African Republic': 'CF', 'Chad': 'TD', 'Chile': 'CL', 'China': 'CN', 'Colombia': 'CO', 'Comoros': 'KM', 'Congo': 'CG', 'Costa Rica': 'CR',
      'Croatia': 'HR', 'Cuba': 'CU', 'Cyprus': 'CY', 'Czech Republic': 'CZ', 'Denmark': 'DK', 'Djibouti': 'DJ', 'Dominica': 'DM', 'Dominican Republic': 'DO', 'Ecuador': 'EC', 'Egypt': 'EG',
      'El Salvador': 'SV', 'Equatorial Guinea': 'GQ', 'Eritrea': 'ER', 'Estonia': 'EE', 'Eswatini': 'SZ', 'Ethiopia': 'ET', 'Fiji': 'FJ', 'Finland': 'FI', 'France': 'FR', 'Gabon': 'GA',
      'Gambia': 'GM', 'Georgia': 'GE', 'Germany': 'DE', 'Ghana': 'GH', 'Greece': 'GR', 'Grenada': 'GD', 'Guatemala': 'GT', 'Guinea': 'GN', 'Guinea-Bissau': 'GW', 'Guyana': 'GY',
      'Haiti': 'HT', 'Honduras': 'HN', 'Hungary': 'HU', 'Iceland': 'IS', 'India': 'IN', 'Indonesia': 'ID', 'Iran': 'IR', 'Iraq': 'IQ', 'Ireland': 'IE', 'Israel': 'IL',
      'Italy': 'IT', 'Jamaica': 'JM', 'Japan': 'JP', 'Jordan': 'JO', 'Kazakhstan': 'KZ', 'Kenya': 'KE', 'Kiribati': 'KI', 'North Korea': 'KP', 'South Korea': 'KR', 'Kuwait': 'KW',
      'Kyrgyzstan': 'KG', 'Laos': 'LA', 'Latvia': 'LV', 'Lebanon': 'LB', 'Lesotho': 'LS', 'Liberia': 'LR', 'Libya': 'LY', 'Liechtenstein': 'LI', 'Lithuania': 'LT', 'Luxembourg': 'LU',
      'Madagascar': 'MG', 'Malawi': 'MW', 'Malaysia': 'MY', 'Maldives': 'MV', 'Mali': 'ML', 'Malta': 'MT', 'Marshall Islands': 'MH', 'Mauritania': 'MR', 'Mauritius': 'MU', 'Mexico': 'MX',
      'Micronesia': 'FM', 'Moldova': 'MD', 'Monaco': 'MC', 'Mongolia': 'MN', 'Montenegro': 'ME', 'Morocco': 'MA', 'Mozambique': 'MZ', 'Myanmar': 'MM', 'Namibia': 'NA', 'Nauru': 'NR',
      'Nepal': 'NP', 'Netherlands': 'NL', 'New Zealand': 'NZ', 'Nicaragua': 'NI', 'Niger': 'NE', 'Nigeria': 'NG', 'North Macedonia': 'MK', 'Norway': 'NO', 'Oman': 'OM', 'Pakistan': 'PK',
      'Palau': 'PW', 'Panama': 'PA', 'Papua New Guinea': 'PG', 'Paraguay': 'PY', 'Peru': 'PE', 'Philippines': 'PH', 'Poland': 'PL', 'Portugal': 'PT', 'Qatar': 'QA', 'Romania': 'RO',
      'Russia': 'RU', 'Rwanda': 'RW', 'Saint Kitts and Nevis': 'KN', 'Saint Lucia': 'LC', 'Saint Vincent': 'VC', 'Samoa': 'WS', 'San Marino': 'SM', 'Sao Tome and Principe': 'ST', 'Saudi Arabia': 'SA', 'Senegal': 'SN',
      'Serbia': 'RS', 'Seychelles': 'SC', 'Sierra Leone': 'SL', 'Singapore': 'SG', 'Slovakia': 'SK', 'Slovenia': 'SI', 'Solomon Islands': 'SB', 'Somalia': 'SO', 'South Africa': 'ZA', 'South Sudan': 'SS',
      'Spain': 'ES', 'Sri Lanka': 'LK', 'Sudan': 'SD', 'Suriname': 'SR', 'Sweden': 'SE', 'Switzerland': 'CH', 'Syria': 'SY', 'Taiwan': 'TW', 'Tajikistan': 'TJ', 'Tanzania': 'TZ',
      'Thailand': 'TH', 'Timor-Leste': 'TL', 'Togo': 'TG', 'Tonga': 'TO', 'Trinidad and Tobago': 'TT', 'Tunisia': 'TN', 'Turkey': 'TR', 'Turkmenistan': 'TM', 'Tuvalu': 'TV', 'Uganda': 'UG',
      'Ukraine': 'UA', 'United Arab Emirates': 'AE', 'United Kingdom': 'GB', 'United States': 'US', 'Uruguay': 'UY', 'Uzbekistan': 'UZ', 'Vanuatu': 'VU', 'Vatican City': 'VA', 'Venezuela': 'VE', 'Vietnam': 'VN',
      'Yemen': 'YE', 'Zambia': 'ZM', 'Zimbabwe': 'ZW',
      // Common abbreviations
      'USA': 'US', 'UK': 'GB', 'UAE': 'AE', 'USSR': 'RU'
    }
    
    // Try to get country code from name, fallback to direct lookup
    const countryCode = countryNameToCode[countryName] || countryName
    return countryCodeToFlag[countryCode] || '🌍'
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

  const stageOptions = ['Just an Idea', 'Building MVP', 'Launched', 'Growing', 'Scaling']
  const skillOptions = ['Design', 'Marketing', 'Finance', 'Engineering', 'Sales', 'Product', 'Operations', 'Legal', 'Data', 'AI/ML', 'Web Dev', 'Mobile Dev', 'Blockchain', 'Content', 'Video', 'Photography', 'Music', 'Writing', 'Research', 'Consulting']
  const statusTagOptions = ['Open to Co-founder', 'Open to Invest', 'Building in Public', 'Looking for Mentorship']

  // Edit Mode View
  if (isEditing) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
              Edit Profile
            </h2>

            <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text)' }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') }))}
                    required
                    maxLength={20}
                    style={{
                      width: '100%',
                      padding: '12px',
                      paddingRight: '40px',
                      borderRadius: '8px',
                      border: '1px solid var(--border2)',
                      background: 'var(--card2)',
                      fontSize: '14px',
                      color: 'var(--text)'
                    }}
                  />
                  {usernameStatus && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '16px',
                      }}
                    >
                      {usernameStatus === 'checking' && '⏳'}
                      {usernameStatus === 'available' && '✅'}
                      {usernameStatus === 'taken' && '❌'}
                      {usernameStatus === 'invalid' && '❌'}
                    </div>
                  )}
                </div>
                {usernameStatus === 'taken' && (
                  <p style={{ color: '#fca5a5', marginTop: '4px', marginBottom: 0, fontSize: '12px' }}>
                    Username taken
                  </p>
                )}
                {usernameStatus === 'available' && (
                  <p style={{ color: '#86efac', marginTop: '4px', marginBottom: 0, fontSize: '12px' }}>
                    Username available
                  </p>
                )}
                {usernameStatus === 'invalid' && usernameError && (
                  <p style={{ color: '#fca5a5', marginTop: '4px', marginBottom: 0, fontSize: '12px' }}>
                    {usernameError}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text)' }}>
                  Location
                </label>
                <CountryDropdown
                  value={editData.location}
                  onChange={(value) => setEditData(prev => ({ ...prev, location: value }))}
                  placeholder="Select country"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text)' }}>
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
                    color: 'var(--text)',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text)' }}>
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text)' }}>
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text)' }}>
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text)' }}>
                  Social Links
                </label>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="X username"
                    value={editData.twitter}
                    onChange={(e) => setEditData(prev => ({ ...prev, twitter: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border2)',
                      background: 'var(--card2)',
                      fontSize: '14px',
                      color: 'var(--text)'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn username"
                    value={editData.linkedin}
                    onChange={(e) => setEditData(prev => ({ ...prev, linkedin: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border2)',
                      background: 'var(--card2)',
                      fontSize: '14px',
                      color: 'var(--text)'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="GitHub username"
                    value={editData.github}
                    onChange={(e) => setEditData(prev => ({ ...prev, github: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border2)',
                      background: 'var(--card2)',
                      fontSize: '14px',
                      color: 'var(--text)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px' }}>
                <button
                  type="button"
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
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--green)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Normal View
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
                {currentProfile.username.charAt(0)}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', justifyContent: 'space-between' }}>
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
                  {userStats?.elo || 0}
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'var(--text2)', 
                  fontFamily: 'var(--font-display)',
                  marginBottom: '16px'
                }}>
                  ELO Rating
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  fontFamily: 'var(--font-display)',
                  color: getRankColor(getRankByElo(userStats?.elo)),
                  marginBottom: '8px'
                }}>
                  {getRankByElo(userStats?.elo)}
                </div>
              </div>

              {/* Rank Information */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px',
                paddingTop: '24px',
                borderTop: '1px solid var(--border2)'
              }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '4px' }}>All-Time Rank</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    #{allTimeRank || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '4px' }}>Daily Rank</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    #{dailyRank || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Streak Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              width: '100%'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                marginBottom: '20px', 
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Daily Battle Streak
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '4px' }}>Current Streak 🔥</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    {dailyStreak?.current_streak || 0} days
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '4px' }}>Longest Streak</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    {dailyStreak?.longest_streak || 0} days
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
              width: '100%',
              flex: 1
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                marginBottom: '20px', 
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Weekly Duels Entered
              </h3>
              
              <div style={{
                textAlign: 'center',
                padding: '40px 0'
              }}>
                <div style={{
                  fontSize: '64px',
                  fontWeight: '800',
                  color: 'var(--green)',
                  fontFamily: 'var(--font-display)',
                  marginBottom: '16px'
                }}>
                  {weeklyDuelsCount || 0}
                </div>
                
                {userStats?.weekly_duel_entered && userStats.weekly_duel_entered > 0 ? (
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: 'var(--green)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-display)'
                  }}>
                    Entered the current weekly duel
                  </div>
                ) : (
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: 'var(--card2)',
                    color: 'var(--text2)',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-display)',
                    border: '1px solid var(--border2)'
                  }}>
                    not entered the current weekly duel
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            {/* Ideas Card */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              width: '100%'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                marginBottom: '20px', 
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Ideas ({ideas.length})
              </h3>
              
              {ideas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {ideas.slice(0, 3).map(idea => (
                    <a 
                      key={idea.id}
                      href="/connect/ideas"
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--card2)',
                        border: '1px solid var(--border2)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = '1px solid var(--green)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = '1px solid var(--border2)'
                      }}
                    >
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-display)'
                      }}>
                        {idea.title}
                      </h4>
                      <p style={{
                        fontSize: '14px',
                        color: 'var(--text2)',
                        lineHeight: '1.5',
                        marginBottom: '8px'
                      }}>
                        {idea.content.length > 150 ? idea.content.substring(0, 150) + '...' : idea.content}
                      </p>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--text2)',
                        fontFamily: 'var(--font-body)'
                      }}>
                        {new Date(idea.created_at).toLocaleDateString()}
                      </div>
                    </a>
                  ))}
                  {ideas.length > 3 && (
                    <div style={{
                      textAlign: 'center',
                      paddingTop: '16px'
                    }}>
                      <a 
                        href="/connect/ideas"
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid var(--border2)',
                          background: 'var(--card2)',
                          color: 'var(--text)',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          display: 'inline-block'
                        }}
                      >
                        View All Ideas
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 0',
                  color: 'var(--text2)'
                }}>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                    {isOwnProfile ? 'No ideas yet' : 'No public ideas yet'}
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    {isOwnProfile ? 'Start sharing your brilliant ideas!' : ''}
                  </div>
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
              width: '100%'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                marginBottom: '20px', 
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Member Since
              </h3>
              
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--text)',
                fontFamily: 'var(--font-display)',
                lineHeight: '1.4'
              }}>
                {new Date(currentProfile.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
