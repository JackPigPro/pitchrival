'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppState } from './AppStateProvider'
import { createClient } from '@/utils/supabase/client'

const NAV = [
  {
    href: '/dashboard',
    icon: '📰',
    label: 'Feed',
  },
  {
    href: '/profile',
    icon: '👤',
    label: 'Profile',
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useAppState()
  const supabase = createClient()
  const isActive = (href: string) => pathname === href

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
          const active = isActive(item.href)

          return (
            <div key={item.href} style={{ marginBottom: '2px' }}>
              <Link
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '8px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
                  color: active ? '#fff' : 'rgba(255,255,255,.68)',
                  background: active ? 'rgba(22,163,74,.16)' : 'transparent',
                  borderLeft: active ? '2px solid var(--green)' : '2px solid transparent',
                  transition: 'all .15s',
                }}
              >
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 10px 16px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px', marginTop: '2px', gap: '8px' }}>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ border: '1px solid rgba(255,255,255,.14)', flex: 1, height: '36px', borderRadius: '8px', background: 'transparent', color: 'rgba(255,255,255,.72)', cursor: 'pointer' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/login')
              router.refresh()
            }}
            style={{
            flex: 1, height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '8px', textDecoration: 'none',
            color: 'rgba(255,255,255,.75)', border: '1px solid rgba(255,255,255,.14)',
            background: 'transparent',
            cursor: 'pointer',
          }}>
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}