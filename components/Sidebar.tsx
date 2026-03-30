'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/home',
    icon: '🏠',
    label: 'Home',
  },
  {
    href: '/connect',
    icon: '🤝',
    label: 'Connect',
    sub: [
      { href: '/connect/feedback',    icon: '💡', label: 'Feedback' },
      { href: '/connect/marketplace', icon: '🏪', label: 'Marketplace' },
      { href: '/connect/messages',    icon: '💬', label: 'Messages' },
      { href: '/connect/vault',       icon: '🔐', label: 'The Vault' },
    ],
  },
  {
    href: '/compete',
    icon: '⚔️',
    label: 'Compete',
    sub: [
      { href: '/compete/duel',        icon: '🏟️', label: 'Weekly Duel' },
      { href: '/compete/leaderboard', icon: '🏆', label: 'Leaderboard' },
    ],
  },
  {
    href: '/learn',
    icon: '📚',
    label: 'Learn',
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const isActive    = (href: string) => pathname === href
  const isParentActive = (href: string) => pathname.startsWith(href)

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: '224px',
      background: 'var(--dark)',
      borderRight: '1px solid rgba(255,255,255,.07)',
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
    }}>

      {/* Brand */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <Link href="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', fontWeight: 800, color: '#fff',
            boxShadow: '0 2px 10px rgba(21,128,61,.35)',
            fontFamily: 'var(--font-display)', flexShrink: 0,
          }}>P</div>
          <span style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-.4px', fontFamily: 'var(--font-display)' }}>
            PitchRival
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map((item) => {
          const parentActive = item.sub ? isParentActive(item.href) : isActive(item.href)
          const linkTarget   = item.sub ? item.sub[0].href : item.href

          return (
            <div key={item.href} style={{ marginBottom: '2px' }}>
              <Link
                href={linkTarget}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '8px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
                  color: parentActive ? '#fff' : 'rgba(255,255,255,.42)',
                  background: parentActive ? 'rgba(22,163,74,.16)' : 'transparent',
                  borderLeft: parentActive ? '2px solid var(--green)' : '2px solid transparent',
                  transition: 'all .15s',
                }}
              >
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </Link>

              {/* Sub-tabs — only shown when parent is active */}
              {item.sub && parentActive && (
                <div style={{ paddingLeft: '16px', marginTop: '2px', marginBottom: '4px' }}>
                  {item.sub.map((sub) => {
                    const subActive = isActive(sub.href)
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '7px 12px', borderRadius: '7px',
                          textDecoration: 'none',
                          fontFamily: 'var(--font-display)', fontSize: '13px',
                          fontWeight: subActive ? 700 : 500,
                          color: subActive ? '#22c55e' : 'rgba(255,255,255,.36)',
                          background: subActive ? 'rgba(34,197,94,.1)' : 'transparent',
                          transition: 'all .15s',
                          marginBottom: '1px',
                        }}
                      >
                        <span style={{ fontSize: '12px' }}>{sub.icon}</span>
                        {sub.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 10px 16px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <Link href="/profile" style={{
            flex: 1,
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px', borderRadius: '8px',
            textDecoration: 'none', transition: 'background .15s',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 800, color: '#fff',
              fontFamily: 'var(--font-display)', flexShrink: 0,
            }}>J</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Jordan Rivera
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.3)', marginTop: '1px' }}>Profile</div>
            </div>
          </Link>
          <Link href="/settings" style={{
            width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '8px', textDecoration: 'none',
            color: 'rgba(255,255,255,.75)', border: '1px solid rgba(255,255,255,.14)',
          }}>
            ⚙️
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
          <button style={{ border: '1px solid rgba(255,255,255,.14)', width: '44px', height: '36px', borderRadius: '8px', background: 'transparent', color: 'rgba(255,255,255,.72)', cursor: 'pointer' }}>
            🌙
          </button>
          <Link href="/" style={{
            width: '44px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '8px', textDecoration: 'none',
            color: 'rgba(255,255,255,.75)', border: '1px solid rgba(255,255,255,.14)',
          }}>
            🚪
          </Link>
        </div>
        <Link href="/connect/messages" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '8px 10px', borderRadius: '8px',
          textDecoration: 'none', transition: 'background .15s',
          marginTop: '10px',
        }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(37,99,235,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.75)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Messages</div>
        </Link>
      </div>
    </aside>
  )
}