'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function TopNavClient({
  user,
}: {
  user: { email?: string | null; name?: string | null } | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState<'connect' | 'compete' | 'settings' | null>(
    null
  )

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
    top: '100%',
    left: 0,
    minWidth: '220px',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    padding: '8px',
    zIndex: 200,
    transformOrigin: 'top left',
    transition: 'opacity .16s ease, transform .16s ease',
  }

  const dropdownLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 10px',
    borderRadius: '10px',
    textDecoration: 'none',
    color: 'var(--text2)',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
  }

  const isLoggedIn = Boolean(user)
  const isOnLanding = pathname === '/'

  const scrollToLandingSection = (id: string) => {
    if (!isOnLanding) {
      router.push(`/#${id}`)
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const hoverZoneStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    paddingBottom: '10px',
    marginBottom: '-10px',
  }

  return (
    <nav className="nav">
      <Link className="nav-brand" href="/" style={{ textDecoration: 'none' }}>
        <div className="nav-logo">P</div>
        <span className="nav-name">PitchRival</span>
      </Link>

      <div className="nav-links" style={{ position: 'relative' }}>
        <div
          style={hoverZoneStyle}
          onMouseEnter={() => setOpen('connect')}
          onMouseLeave={() => setOpen(null)}
        >
          {isLoggedIn ? (
            <span style={{ ...menuItemStyle, cursor: 'default' }}>
              Connect <span style={{ fontSize: '12px', opacity: 0.7 }}>▾</span>
            </span>
          ) : (
            <a
              href="/#connect"
              onClick={(e) => {
                e.preventDefault()
                scrollToLandingSection('connect')
              }}
              style={menuItemStyle}
            >
              Connect <span style={{ fontSize: '12px', opacity: 0.7 }}>▾</span>
            </a>
          )}
          <div
            style={{
              ...dropdownStyle,
              opacity: open === 'connect' ? 1 : 0,
              transform:
                open === 'connect'
                  ? 'translateY(0) scale(1)'
                  : 'translateY(-4px) scale(.98)',
              pointerEvents: open === 'connect' ? 'auto' : 'none',
            }}
          >
            <Link href="/connect/cofounder-match" style={dropdownLinkStyle}>
              Co-founder Match
            </Link>
            <Link href="/connect/messages" style={dropdownLinkStyle}>
              Messages
            </Link>
            <Link href="/connect/ideas" style={dropdownLinkStyle}>
              Ideas
            </Link>
          </div>
        </div>

        <div
          style={hoverZoneStyle}
          onMouseEnter={() => setOpen('compete')}
          onMouseLeave={() => setOpen(null)}
        >
          {isLoggedIn ? (
            <span style={{ ...menuItemStyle, cursor: 'default' }}>
              Compete <span style={{ fontSize: '12px', opacity: 0.7 }}>▾</span>
            </span>
          ) : (
            <a
              href="/#compete"
              onClick={(e) => {
                e.preventDefault()
                scrollToLandingSection('compete')
              }}
              style={menuItemStyle}
            >
              Compete <span style={{ fontSize: '12px', opacity: 0.7 }}>▾</span>
            </a>
          )}
          <div
            style={{
              ...dropdownStyle,
              opacity: open === 'compete' ? 1 : 0,
              transform:
                open === 'compete'
                  ? 'translateY(0) scale(1)'
                  : 'translateY(-4px) scale(.98)',
              pointerEvents: open === 'compete' ? 'auto' : 'none',
            }}
          >
            <Link href="/compete/weekly-duel" style={dropdownLinkStyle}>
              Weekly Duel
            </Link>
            <Link href="/compete/leaderboard" style={dropdownLinkStyle}>
              Leaderboard
            </Link>
          </div>
        </div>

        {isLoggedIn ? (
          <>
            <Link href="/learn" style={menuItemStyle}>
              Learn
            </Link>
            <Link href="/schools" style={menuItemStyle}>
              Schools
            </Link>
          </>
        ) : (
          <>
            <a
              href="/#learn"
              onClick={(e) => {
                e.preventDefault()
                scrollToLandingSection('learn')
              }}
              style={menuItemStyle}
            >
              Learn
            </a>
            <a
              href="/#schools"
              onClick={(e) => {
                e.preventDefault()
                scrollToLandingSection('schools')
              }}
              style={menuItemStyle}
            >
              Schools
            </a>
          </>
        )}
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 700 }}>
              {user.name ?? user.email ?? 'Account'}
            </span>
            <Link
              href="/profile"
              className="nav-login"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              Profile
            </Link>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setOpen('settings')}
              onMouseLeave={() => setOpen(null)}
            >
              <button className="nav-login" style={{ display: 'inline-flex', alignItems: 'center' }}>
                Settings <span style={{ fontSize: '12px', opacity: 0.7, marginLeft: '6px' }}>▾</span>
              </button>
              <div
                style={{
                  ...dropdownStyle,
                  left: 'auto',
                  right: 0,
                  minWidth: '200px',
                  opacity: open === 'settings' ? 1 : 0,
                  transform:
                    open === 'settings'
                      ? 'translateY(0) scale(1)'
                      : 'translateY(-4px) scale(.98)',
                  pointerEvents: open === 'settings' ? 'auto' : 'none',
                }}
              >
                <Link href="/settings" style={dropdownLinkStyle}>
                  All Settings
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    router.push('/')
                    router.refresh()
                  }}
                  style={{
                    ...dropdownLinkStyle,
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
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

