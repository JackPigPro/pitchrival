'use client'

import { useState } from 'react'
import AdminDuelManager from './duel-manager'
import DailyBattleManager from './daily-battle-manager'

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState<'weekly-duel' | 'daily-battle'>('weekly-duel')

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '2px',
        marginBottom: '32px',
        background: 'var(--surface)',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        <button
          onClick={() => setActiveTab('weekly-duel')}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: activeTab === 'weekly-duel' ? 'var(--card)' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Weekly Duel
        </button>
        <button
          onClick={() => setActiveTab('daily-battle')}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: activeTab === 'daily-battle' ? 'var(--card)' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Daily Battle
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'weekly-duel' && <AdminDuelManager />}
      {activeTab === 'daily-battle' && <DailyBattleManager />}
    </div>
  )
}
