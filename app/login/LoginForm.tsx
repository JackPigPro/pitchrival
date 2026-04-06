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

    try {
      console.log('Attempting OTP sign in for email:', email)
      
      const { error: otpError, data } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })

      console.log('OTP response:', { error: otpError, data })

      if (otpError) {
        console.error('OTP Error details:', {
          message: otpError.message,
          status: otpError.status,
          code: otpError.code,
          name: otpError.name,
          stack: otpError.stack
        })
        setError(otpError.message)
        return
      }

      setStep('code')
      setSuccess('We sent a 6-digit code to your email.')
    } catch (unexpectedError) {
      console.error('Unexpected error during OTP sign in:', unexpectedError)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
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

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      setError('Authentication error')
      return
    }

    // Check if user has completed onboarding
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', user.id)
      .single()

    const redirectTo = profile?.onboarding_complete ? '/' : '/onboarding'
    router.push(redirectTo)
    router.refresh()
  }

  const onGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/`,
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
        {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
      </h1>
      <p style={{ color: 'var(--text2)', marginTop: '10px', marginBottom: '18px' }}>
        Sign in with your Google account to continue.
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
          border: '1px solid var(--border2)',
          background: 'var(--surface)',
          color: 'var(--text)',
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

      <div style={{ 
        textAlign: 'center', 
        fontSize: '12px', 
        color: 'var(--text3)', 
        marginTop: '8px',
        fontStyle: 'italic'
      }}>
        More sign in options coming soon.
      </div>
    </form>
  )
}
