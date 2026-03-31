'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const onContinueWithEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    setLoading(false)

    if (otpError) {
      setError(otpError.message)
      return
    }

    setStep('code')
    setSuccess('We sent a 6-digit code to your email.')
  }

  const onVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    setLoading(false)

    if (verifyError) {
      setError('Invalid or expired code. Please try again.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const onGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (oauthError) {
      // Keep this quiet for smooth UX; OAuth normally redirects away immediately.
      setGoogleLoading(false)
    }
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (step === 'email') {
      await onContinueWithEmail(event)
      return
    }

    await onVerifyCode(event)
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        width: '100%',
        maxWidth: '420px',
        border: '1px solid rgba(255,255,255,.14)',
        borderRadius: '16px',
        padding: '28px',
        background: 'rgba(10,14,26,.82)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 18px 45px rgba(0,0,0,.28)',
        color: '#fff',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(34,197,94,.82)', marginBottom: '10px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        Magic Link OTP
      </div>
      <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
        {mode === 'signup' ? 'Create your account' : 'Welcome back'}
      </h1>
      <p style={{ color: 'rgba(255,255,255,.62)', marginTop: '10px', marginBottom: '18px' }}>
        {step === 'email'
          ? 'Enter your email and we will send a 6-digit code.'
          : `Enter the 6-digit code sent to ${email}.`}
      </p>

      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={googleLoading || loading}
        style={{
          width: '100%',
          marginBottom: '14px',
          padding: '11px 12px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,.2)',
          background: 'rgba(255,255,255,.08)',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'var(--font-display)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 2.9-4.2 2.9-7.1 0-.7-.1-1.4-.2-2H12Z" />
          <path fill="#34A853" d="M12 21c2.6 0 4.7-.9 6.2-2.3l-3.1-2.4c-.9.6-1.9.9-3.1.9-2.4 0-4.5-1.6-5.2-3.9H3.6v2.5A9.4 9.4 0 0 0 12 21Z" />
          <path fill="#4A90E2" d="M6.8 13.3a5.7 5.7 0 0 1 0-3.6V7.2H3.6a9.4 9.4 0 0 0 0 8.5l3.2-2.4Z" />
          <path fill="#FBBC05" d="M12 6.8c1.4 0 2.6.5 3.5 1.4l2.6-2.6A9.2 9.2 0 0 0 12 3 9.4 9.4 0 0 0 3.6 7.2l3.2 2.5c.7-2.3 2.8-3.9 5.2-3.9Z" />
        </svg>
        {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,.18)' }} />
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)', letterSpacing: '1px', textTransform: 'uppercase' }}>or</span>
        <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,.18)' }} />
      </div>

      {step === 'email' ? (
        <>
          <label style={{ display: 'block', marginBottom: '7px', color: 'rgba(255,255,255,.88)', fontWeight: 600, fontSize: '14px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="you@example.com"
            style={{
              width: '100%',
              marginBottom: '14px',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,.16)',
              background: 'rgba(255,255,255,.06)',
              color: '#fff',
              outline: 'none',
            }}
          />
        </>
      ) : (
        <>
          <label style={{ display: 'block', marginBottom: '7px', color: 'rgba(255,255,255,.88)', fontWeight: 600, fontSize: '14px' }}>6-digit code</label>
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            placeholder="123456"
            style={{
              width: '100%',
              marginBottom: '14px',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,.16)',
              background: 'rgba(255,255,255,.06)',
              color: '#fff',
              outline: 'none',
              letterSpacing: '6px',
              fontWeight: 700,
              textAlign: 'center',
            }}
          />
        </>
      )}

      {error && <p style={{ color: '#fca5a5', marginTop: 0, marginBottom: '10px', fontSize: '14px' }}>{error}</p>}
      {success && <p style={{ color: '#86efac', marginTop: 0, marginBottom: '10px', fontSize: '14px' }}>{success}</p>}

      <button
        type="submit"
        disabled={loading || googleLoading}
        style={{
          width: '100%',
          padding: '12px',
          border: 'none',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'var(--font-display)',
          boxShadow: '0 8px 20px rgba(21,128,61,.28)',
        }}
      >
        {loading ? 'Please wait...' : step === 'email' ? 'Continue' : 'Verify code'}
      </button>
      {step === 'code' && (
        <button
          type="button"
          disabled={loading || googleLoading}
          onClick={() => {
            setStep('email')
            setCode('')
            setSuccess(null)
            setError(null)
          }}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,.16)',
            background: 'transparent',
            color: 'rgba(255,255,255,.8)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Use a different email
        </button>
      )}
    </form>
  )
}
