'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [username, setUsername] = useState('')
  const [displayUsername, setDisplayUsername] = useState('')
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check username availability in real-time
  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus(null)
      setUsernameError(null)
      return
    }

    // Validate username rules
    const validationRules = [
      {
        test: username.length >= 3 && username.length <= 20,
        message: 'Username must be 3-20 characters'
      },
      {
        test: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(username),
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
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(username.trim().toLowerCase())}`)
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
  }, [username, supabase])

  const isFormValid = usernameStatus === 'available' && ageConfirmed && agreedToTerms

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Always validate username regex before submitting
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/
    if (!usernameRegex.test(username.trim())) {
      setError('Username must start with a letter and contain only letters, numbers, and underscores. No spaces or special characters.')
      return
    }
    
    if (!isFormValid) return

    setLoading(true)
    setError(null)

    try {
      // Call API route to complete onboarding
      const response = await fetch('/api/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to complete onboarding')
      }

      const result = await response.json()

      setLoading(false)
      
      // Small delay to ensure UI updates before redirect
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px 24px 32px',
        marginTop: '-68px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`.nav{display:none !important}`}</style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          pointerEvents: 'none',
        }}
      />
      <div className="auth-deco auth-deco-1 hero-deco-card">
        <div className="hdc-badge b">Connect</div>
        <div className="hdc-val b">94%</div>
        <div className="hdc-text">Co-founder match score</div>
      </div>
      <div className="auth-deco auth-deco-2 hero-deco-card">
        <div className="hdc-badge g">Compete</div>
        <div className="hdc-val g">+18 ELO</div>
        <div className="hdc-text">Won last weekly duel</div>
      </div>
      <div className="auth-deco auth-deco-3 hero-deco-card">
        <div className="hdc-badge p">Learn</div>
        <div className="hdc-val p">Lesson 3</div>
        <div className="hdc-text">35% complete</div>
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <form
          onSubmit={onSubmit}
          style={{
            width: '100%',
            maxWidth: '420px',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
            background: 'var(--card)',
            boxShadow: 'var(--shadow-lg)',
            color: 'var(--text)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
            Complete Your Profile
          </h1>
          <p style={{ color: 'var(--text2)', marginTop: '10px', marginBottom: '18px' }}>
            Choose a username and agree to our terms to get started.
          </p>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '7px', color: 'var(--text)', fontWeight: 600, fontSize: '14px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={displayUsername}
                onChange={(event) => {
                  const value = event.target.value
                  setDisplayUsername(value)
                  setUsername(value.replace(/[^a-zA-Z0-9_]/g, '')) // Keep only letters, numbers, and underscores for comparison
                }}
                required
                placeholder="Choose a username"
                maxLength={20}
                style={{
                  width: '100%',
                  padding: '12px',
                  paddingRight: '40px',
                  borderRadius: '10px',
                  border: '1px solid var(--border2)',
                  background: 'var(--card)',
                  color: 'var(--text)',
                  outline: 'none',
                  fontSize: '14px',
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

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(event) => setAgeConfirmed(event.target.checked)}
                required
                style={{
                  marginTop: '2px',
                  accentColor: '#16a34a',
                }}
              />
              <span style={{ color: 'var(--text)' }}>
                I confirm I am 13 or older
              </span>
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(event) => setAgreedToTerms(event.target.checked)}
                required
                style={{
                  marginTop: '2px',
                  accentColor: '#16a34a',
                }}
              />
              <span style={{ color: 'var(--text)' }}>
                I agree to the{' '}
                <Link
                  href="/terms"
                  style={{ color: '#16a34a', textDecoration: 'underline' }}
                  target="_blank"
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link
                  href="/privacy"
                  style={{ color: '#16a34a', textDecoration: 'underline' }}
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {error && <p style={{ color: '#fca5a5', marginTop: 0, marginBottom: '10px', fontSize: '14px' }}>{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: isFormValid && !loading 
                ? 'linear-gradient(135deg, #16a34a, #22c55e)' 
                : 'var(--surface)',
              color: isFormValid && !loading ? '#fff' : 'var(--text3)',
              fontWeight: 700,
              cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-display)',
              boxShadow: isFormValid && !loading ? '0 8px 20px rgba(21,128,61,.28)' : 'none',
            }}
          >
            {loading ? 'Please wait...' : 'Continue'}
          </button>
        </form>
      </div>
    </main>
  )
}
