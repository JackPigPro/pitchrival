'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/connect/feedback',    label: '💡 Feedback',    sub: 'Brain Trust' },
  { href: '/connect/marketplace', label: '🏪 Marketplace', sub: 'Team Builder' },
  { href: '/connect/messages',    label: '💬 Messages',    sub: 'War Room' },
  { href: '/connect/vault',       label: '🔐 The Vault',   sub: 'The Safe' },
]

export default function ConnectNav() {
  const pathname = usePathname()
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch', gap: '0',
      borderBottom: '1px solid var(--border)',
      background: 'var(--card)',
      paddingLeft: '48px',
    }}>
      {TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link key={tab.href} href={tab.href} style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '12px 20px',
            textDecoration: 'none',
            borderBottom: active ? '2px solid var(--blue)' : '2px solid transparent',
            color: active ? 'var(--blue)' : 'var(--text3)',
            transition: 'all .15s',
            marginBottom: '-1px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
              {tab.label}
            </span>
            <span style={{ fontSize: '10px', color: active ? 'rgba(37,99,235,.6)' : 'var(--text3)', marginTop: '1px', fontStyle: 'italic' }}>
              {tab.sub}
            </span>
          </Link>
        )
      })}
    </div>
  )
}