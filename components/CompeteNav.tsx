'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/compete/duel',        label: '⚔️ Weekly Duel',  sub: 'The Arena' },
  { href: '/compete/leaderboard', label: '🏆 Leaderboard',  sub: 'The Rankings' },
]

export default function CompeteNav() {
  const pathname = usePathname()
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid var(--border)', background: 'var(--card)', paddingLeft: '48px' }}>
      {TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link key={tab.href} href={tab.href} style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '12px 22px', textDecoration: 'none',
            borderBottom: active ? '2px solid var(--green)' : '2px solid transparent',
            color: active ? 'var(--green)' : 'var(--text3)',
            transition: 'all .15s', marginBottom: '-1px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{tab.label}</span>
            <span style={{ fontSize: '10px', color: active ? 'rgba(22,163,74,.6)' : 'var(--text3)', marginTop: '1px', fontStyle: 'italic' }}>{tab.sub}</span>
          </Link>
        )
      })}
    </div>
  )
}