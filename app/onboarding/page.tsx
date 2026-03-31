'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [username, setUsername] = useState('')
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check username availability in real-time
  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus(null)
      return
    }

    const checkUsername = async () => {
      setUsernameStatus('checking')
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.trim())
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking username:', error)
        setUsernameStatus(null)
        return
      }

      setUsernameStatus(data ? 'taken' : 'available')
    }

    const timeoutId = setTimeout(checkUsername, 300)
    return () => clearTimeout(timeoutId)
  }, [username, supabase])

  const isFormValid = usernameStatus === 'available' && ageConfirmed && agreedToTerms

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!isFormValid) return

    setLoading(true)
    setError(null)

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Update or create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: username.trim(),
          onboarding_complete: true,
          age_confirmed: true,
          agreed_to_terms: true,
        })

      if (profileError) {
        throw profileError
      }

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
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
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                placeholder="Choose a username"
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
