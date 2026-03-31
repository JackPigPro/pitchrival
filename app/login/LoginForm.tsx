'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
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
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (oauthError) {
      setError(oauthError.message)
      setGoogleLoading(false)
    }
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
        Welcome Back
      </div>
      <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>Log in to PitchRival</h1>
      <p style={{ color: 'rgba(255,255,255,.62)', marginTop: '10px', marginBottom: '18px' }}>Use your email and password to access your feed.</p>

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
        <span
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            color: '#111827',
            fontSize: '12px',
            fontWeight: 900,
          }}
        >
          G
        </span>
        {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,.18)' }} />
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)', letterSpacing: '1px', textTransform: 'uppercase' }}>or</span>
        <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,.18)' }} />
      </div>

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

      <label style={{ display: 'block', marginBottom: '7px', color: 'rgba(255,255,255,.88)', fontWeight: 600, fontSize: '14px' }}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        placeholder="Enter password"
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

      {error && <p style={{ color: '#fca5a5', marginTop: 0, marginBottom: '10px', fontSize: '14px' }}>{error}</p>}

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
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <p style={{ marginBottom: 0, marginTop: '14px', color: 'rgba(255,255,255,.62)' }}>
        Need an account? <Link href="/signup" style={{ color: '#60a5fa', fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
      </p>
    </form>
  )
}
