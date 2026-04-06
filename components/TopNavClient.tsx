'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import NotificationsBell from '@/components/NotificationsBell'
import { signOut } from '@/app/actions/auth'

export default function TopNavClient({
  user,
  forceLoggedOut,
}: {
  user: { email?: string | null; name?: string | null; username?: string | null } | null
  forceLoggedOut?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState<'connect' | 'compete' | 'settings' | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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

  const menuItemHoverStyle: React.CSSProperties = {
    outline: '2px solid var(--green)',
    outlineOffset: '2px',
    fontWeight: 700,
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
    transition: 'all 0.2s ease',
  }

  const dropdownLinkHoverStyle: React.CSSProperties = {
    outline: '2px solid var(--green)',
    outlineOffset: '2px',
    fontWeight: 700,
  }

  const isLoggedIn = Boolean(user) && !forceLoggedOut
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
            <span 
              className="topnav-link" 
              style={{ 
                ...menuItemStyle, 
                cursor: 'default',
                ...(open === 'connect' ? menuItemHoverStyle : {})
              }}
            >
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
              style={{
                ...menuItemStyle,
                ...(hoveredItem === 'connect' ? menuItemHoverStyle : {})
              }}
              onMouseEnter={() => setHoveredItem('connect')}
              onMouseLeave={() => setHoveredItem(null)}
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
            <Link 
              href={isLoggedIn ? "/connect/cofounder-match" : "/login?mode=signup"} 
              className="topnav-dropdown-link" 
              style={{
                ...dropdownLinkStyle, 
                ...(hoveredItem === 'cofounder-match' ? dropdownLinkHoverStyle : {})
              }} 
              onClick={handleNavPageClick}
              onMouseEnter={() => setHoveredItem('cofounder-match')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Co-founder Match
            </Link>
            <Link 
              href={isLoggedIn ? "/connect/messages" : "/login?mode=signup"} 
              className="topnav-dropdown-link" 
              style={{
                ...dropdownLinkStyle, 
                ...(hoveredItem === 'messages' ? dropdownLinkHoverStyle : {})
              }} 
              onClick={handleNavPageClick}
              onMouseEnter={() => setHoveredItem('messages')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Messages
            </Link>
            <Link 
              href={isLoggedIn ? "/connect/ideas" : "/login?mode=signup"} 
              className="topnav-dropdown-link" 
              style={{
                ...dropdownLinkStyle, 
                ...(hoveredItem === 'ideas' ? dropdownLinkHoverStyle : {})
              }} 
              onClick={handleNavPageClick}
              onMouseEnter={() => setHoveredItem('ideas')}
              onMouseLeave={() => setHoveredItem(null)}
            >
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
            <span 
              className="topnav-link" 
              style={{ 
                ...menuItemStyle, 
                cursor: 'default',
                ...(open === 'compete' ? menuItemHoverStyle : {})
              }}
            >
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
              style={{
                ...menuItemStyle,
                ...(hoveredItem === 'compete' ? menuItemHoverStyle : {})
              }}
              onMouseEnter={() => setHoveredItem('compete')}
              onMouseLeave={() => setHoveredItem(null)}
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
            <Link 
              href={isLoggedIn ? "/compete/daily-battle" : "/login?mode=signup"} 
              className="topnav-dropdown-link" 
              style={{
                ...dropdownLinkStyle, 
                ...(hoveredItem === 'daily-battle' ? dropdownLinkHoverStyle : {})
              }} 
              onClick={handleNavPageClick}
              onMouseEnter={() => setHoveredItem('daily-battle')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Daily Battle
            </Link>
            <Link 
              href={isLoggedIn ? "/compete/weekly-duel" : "/login?mode=signup"} 
              className="topnav-dropdown-link" 
              style={{
                ...dropdownLinkStyle, 
                ...(hoveredItem === 'weekly-duel' ? dropdownLinkHoverStyle : {})
              }} 
              onClick={handleNavPageClick}
              onMouseEnter={() => setHoveredItem('weekly-duel')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Weekly Duel
            </Link>
            <Link 
              href="/compete/leaderboard" 
              scroll 
              className="topnav-dropdown-link" 
              style={{
                ...dropdownLinkStyle, 
                ...(hoveredItem === 'leaderboard' ? dropdownLinkHoverStyle : {})
              }} 
              onClick={handleNavPageClick}
              onMouseEnter={() => setHoveredItem('leaderboard')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Leaderboard
            </Link>
          </div>
        </div>

        <>
          {isLoggedIn ? (
            <Link 
              href="/learn" 
              className="topnav-link" 
              style={{
                ...menuItemStyle,
                ...(hoveredItem === 'learn' ? menuItemHoverStyle : {})
              }}
              onMouseEnter={() => setHoveredItem('learn')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Learn
            </Link>
          ) : (
            <a
              className="topnav-link"
              href="/#learn"
              onClick={(e) => {
                e.preventDefault()
                scrollToLandingSection('learn', 'center')
              }}
              style={{
                ...menuItemStyle,
                ...(hoveredItem === 'learn' ? menuItemHoverStyle : {})
              }}
              onMouseEnter={() => setHoveredItem('learn')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Learn
            </a>
          )}
          {isLoggedIn ? (
            <Link 
              href="/schools" 
              className="topnav-link" 
              style={{
                ...menuItemStyle,
                ...(hoveredItem === 'schools' ? menuItemHoverStyle : {})
              }}
              onMouseEnter={() => setHoveredItem('schools')}
              onMouseLeave={() => setHoveredItem(null)}
            >
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
              style={{
                ...menuItemStyle,
                ...(hoveredItem === 'schools' ? menuItemHoverStyle : {})
              }}
              onMouseEnter={() => setHoveredItem('schools')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Schools
            </a>
          )}
        </>
      </div>

      <div className="nav-right" style={{ position: 'relative' }}>
        {user ? (
          <>
            <Link
              href="/connect/messages"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--text2)',
                fontSize: '18px',
                transition: 'all 0.2s ease',
                marginRight: '2px'
              }}
              title="Messages"
            >
              💬
            </Link>
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
                <Link href="/settings" className="topnav-dropdown-link" style={{...dropdownLinkStyle, ...(hoveredItem === 'settings' ? dropdownLinkHoverStyle : {})}} onClick={handleNavPageClick} onMouseEnter={() => setHoveredItem('settings')} onMouseLeave={() => setHoveredItem(null)}>
                  All Settings
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    style={{
                      ...dropdownLinkStyle,
                      width: '100%',
                      ...(hoveredItem === 'signout' ? dropdownLinkHoverStyle : {}),
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      padding: '12px'
                    }}
                    onMouseEnter={() => setHoveredItem('signout')} onMouseLeave={() => setHoveredItem(null)}
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

