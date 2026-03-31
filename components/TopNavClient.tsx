'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppState } from './AppStateProvider'
import { createClient } from '@/utils/supabase/client'

export default function TopNavClient({
  user,
}: {
  user: { email?: string | null; name?: string | null } | null
}) {
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useAppState()
  const [open, setOpen] = useState<'connect' | 'compete' | null>(null)

  const menuItemStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: 'var(--text2)',
    padding: '7px 14px',
    borderRadius: '7px',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    transition: 'all .15s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  }

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    left: 0,
    minWidth: '220px',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    padding: '8px',
    zIndex: 200,
  }

  const dropdownLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 10px',
    borderRadius: '10px',
    textDecoration: 'none',
    color: 'var(--text)',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
  }

  return (
    <nav className="nav">
      <Link className="nav-brand" href="/" style={{ textDecoration: 'none' }}>
        <div className="nav-logo">P</div>
        <span className="nav-name">PitchRival</span>
      </Link>

      <div className="nav-links" style={{ position: 'relative' }}>
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setOpen('connect')}
          onMouseLeave={() => setOpen(null)}
        >
          <span style={{ ...menuItemStyle, cursor: 'default' }}>
            Connect <span style={{ fontSize: '12px', opacity: 0.7 }}>▾</span>
          </span>
          {open === 'connect' && (
            <div style={dropdownStyle}>
              <Link href="/connect/cofounder-match" style={dropdownLinkStyle}>
                🤝 <span>Co-founder Match</span>
              </Link>
              <Link href="/connect/messages" style={dropdownLinkStyle}>
                💬 <span>Messages</span>
              </Link>
              <Link href="/connect/ideas" style={dropdownLinkStyle}>
                💡 <span>Ideas</span>
              </Link>
            </div>
          )}
        </div>

        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setOpen('compete')}
          onMouseLeave={() => setOpen(null)}
        >
          <span style={{ ...menuItemStyle, cursor: 'default' }}>
            Compete <span style={{ fontSize: '12px', opacity: 0.7 }}>▾</span>
          </span>
          {open === 'compete' && (
            <div style={dropdownStyle}>
              <Link href="/compete/weekly-duel" style={dropdownLinkStyle}>
                ⚔️ <span>Weekly Duel</span>
              </Link>
              <Link href="/compete/leaderboard" style={dropdownLinkStyle}>
                🏆 <span>Leaderboard</span>
              </Link>
            </div>
          )}
        </div>

        <Link href="/learn" style={menuItemStyle}>
          Learn
        </Link>
        <Link href="/schools" style={menuItemStyle}>
          Schools
        </Link>
      </div>

      <div className="nav-right">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="nav-login"
          style={{
            padding: '9px 14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user ? (
          <>
            <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 700 }}>
              {user.name ?? user.email ?? 'Account'}
            </span>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/')
                router.refresh()
              }}
              className="nav-signup"
              style={{ padding: '10px 18px' }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login?mode=login"
              className="nav-login"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              Log In
            </Link>
            <Link
              href="/login?mode=signup"
              className="nav-signup"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

