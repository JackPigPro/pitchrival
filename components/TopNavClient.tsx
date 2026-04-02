'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import NotificationsBell from '@/components/NotificationsBell'
import { signOut } from '@/app/actions/auth'

export default function TopNavClient({
  user,
}: {
  user: { email?: string | null; name?: string | null; username?: string | null } | null
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

  const scrollToLandingSection = (id: string, align: 'center' | 'top') => {
    if (!isOnLanding) {
      router.push(`/#${id}`)
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const navOffset = 76
    const targetTop =
      align === 'center'
        ? rect.top + window.scrollY - (window.innerHeight / 2 - rect.height / 2)
        : rect.top + window.scrollY - navOffset
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
  }

  useEffect(() => {
    if (!isOnLanding || typeof window === 'undefined') return
    if (window.location.hash !== '#learn') return
    const timer = window.setTimeout(() => {
      const el = document.getElementById('learn')
      if (!el) return
      const rect = el.getBoundingClientRect()
      const targetTop =
        rect.top + window.scrollY - (window.innerHeight / 2 - rect.height / 2)
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
    }, 30)
    return () => window.clearTimeout(timer)
  }, [isOnLanding, pathname])

  const hoverZoneStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    paddingBottom: '10px',
    marginBottom: '-10px',
  }

  const handleNavPageClick = () => {
    setOpen(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="nav">
      <Link
        className="nav-brand"
        href={user ? "/dashboard" : "/"}
        onClick={(e) => {
          if (isOnLanding) {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }}
        style={{ textDecoration: 'none' }}
      >
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
            <span className="topnav-link" style={{ ...menuItemStyle, cursor: 'default' }}>
              Connect <span style={{ fontSize: '12px', opacity: 0.7 }}>▾</span>
            </span>
          ) : (
            <a
              className="topnav-link"
              href="/#connect"
              onClick={(e) => {
                e.preventDefault()
                scrollToLandingSection('connect', 'center')
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
            <Link href="/connect/cofounder-match" scroll className="topnav-dropdown-link" style={dropdownLinkStyle} onClick={handleNavPageClick}>
              Co-founder Match
            </Link>
            <Link href="/connect/messages" scroll className="topnav-dropdown-link" style={dropdownLinkStyle} onClick={handleNavPageClick}>
              Messages
            </Link>
            <Link href="/connect/ideas" scroll className="topnav-dropdown-link" style={dropdownLinkStyle} onClick={handleNavPageClick}>
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
            <span className="topnav-link" style={{ ...menuItemStyle, cursor: 'default' }}>
              Compete <span style={{ fontSize: '12px', opacity: 0.7 }}>▾</span>
            </span>
          ) : (
            <a
              className="topnav-link"
              href="/#compete"
              onClick={(e) => {
                e.preventDefault()
                scrollToLandingSection('compete', 'center')
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
            <Link href="/compete/weekly-duel" scroll className="topnav-dropdown-link" style={dropdownLinkStyle} onClick={handleNavPageClick}>
              Weekly Duel
            </Link>
            <Link href="/compete/leaderboard" scroll className="topnav-dropdown-link" style={dropdownLinkStyle} onClick={handleNavPageClick}>
              Leaderboard
            </Link>
          </div>
        </div>

        <>
          {isLoggedIn ? (
            <Link href="/learn" className="topnav-link" style={menuItemStyle}>
              Learn
            </Link>
          ) : (
            <a
              className="topnav-link"
              href="/#learn"
              onClick={(e) => {
                e.preventDefault()
                scrollToLandingSection('learn', 'top')
              }}
              style={menuItemStyle}
            >
              Learn
            </a>
          )}
          {isLoggedIn ? (
            <Link href="/schools" className="topnav-link" style={menuItemStyle}>
              Schools
            </Link>
          ) : (
            <a
              className="topnav-link"
              href="/#schools"
              onClick={(e) => {
                e.preventDefault()
                scrollToLandingSection('schools', 'top')
              }}
              style={menuItemStyle}
            >
              Schools
            </a>
          )}
        </>
      </div>

      <div className="nav-right" style={{ position: 'relative' }}>
        {user ? (
          <>
            <NotificationsBell />
            <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 700 }}>
              {user.name ?? user.email ?? 'Account'}
            </span>
            <Link
              href={user.username ? `/profile/${user.username}` : "/profile"}
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
                <form action={signOut}>
                  <button
                    type="submit"
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
                </form>
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

