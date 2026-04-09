'use client'

import { useState } from 'react'
import AdminDuelManager from './duel-manager'
import DailyBattleManager from './daily-battle-manager'

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState<'weekly-duel' | 'daily-battle'>('weekly-duel')

  return (
    <div>
      {/* Tab Navigation */}
      <div className="admin-tabs-container">
        <button
          onClick={() => setActiveTab('weekly-duel')}
          className="admin-tab-button"
          style={{
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
          className="admin-tab-button"
          style={{
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
