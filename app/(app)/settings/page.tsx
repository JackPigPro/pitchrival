'use client'

import { useState } from 'react'
import { useAppState } from '../../../components/AppStateProvider'

export default function SettingsPage() {
  const { theme, setTheme, brightness, setBrightness } = useAppState()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [productUpdates, setProductUpdates] = useState(true)

  return (
    <div style={{ padding: '28px 32px', width: '100%' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Settings</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '16px' }}>Global preferences for your account and app behavior.</p>
      <div style={{ maxWidth: '720px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {[
          { key: 'Dark mode', value: theme === 'dark', setter: (next: boolean) => setTheme(next ? 'dark' : 'light') },
          { key: 'Email notifications', value: emailNotifications, setter: setEmailNotifications },
          { key: 'Product updates', value: productUpdates, setter: setProductUpdates },
        ].map((item) => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600 }}>{item.key}</div>
            <button onClick={() => item.setter(!item.value)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: item.value ? 'var(--green-tint)' : 'var(--surface)', color: item.value ? 'var(--green)' : 'var(--text3)', cursor: 'pointer' }}>
              {item.value ? 'On' : 'Off'}
            </button>
          </div>
        ))}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>Brightness</div>
          <input
            type="range"
            min={75}
            max={120}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}
