'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppState } from '../../../../components/AppStateProvider'

const PRIVATE = [
  { id: 1, title: 'ParkShare v2 pitch', text: 'Targeting commercial property managers instead of homeowners.', label: 'Duel Draft' },
  { id: 2, title: 'Campus micro-gig platform', text: 'ASU pilot notes. Trust is the bottleneck.', label: 'Private Idea' },
]

const PUBLIC_VAULTS = [
  { id: 1, name: 'Brand Sprint Shared Vault', members: 4, lastEdit: '2h ago' },
  { id: 2, name: 'Phoenix Founder Notes', members: 3, lastEdit: '1d ago' },
]

export default function VaultPage() {
  const router = useRouter()
  const { setDuelDraft } = useAppState()
  const [tab, setTab] = useState<'private' | 'public'>('private')
  const [ideas, setIdeas] = useState(PRIVATE)
  const [activeId, setActiveId] = useState<number | null>(PRIVATE[0].id)
  const [quickIdea, setQuickIdea] = useState('')

  const activeIdea = ideas.find((i) => i.id === activeId) ?? null

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '0', marginBottom: '16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
        {(['private', 'public'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 28px', background: tab === t ? 'var(--purple)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: tab === t ? '#fff' : 'var(--text3)', fontFamily: 'var(--font-display)' }}>
            {t === 'private' ? '🔐 Private Ideas' : '🌐 Public Vaults'}
          </button>
        ))}
      </div>

      {tab === 'private' && (
        <div style={{ display: 'grid', gridTemplateColumns: '.8fr 1.2fr', gap: '14px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input value={quickIdea} onChange={(e) => setQuickIdea(e.target.value)} placeholder="Quick add private idea..." style={{ flex: 1, padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
              <button
                onClick={() => {
                  if (!quickIdea.trim()) return
                  const next = { id: Date.now(), title: quickIdea, text: 'New private note.', label: 'Private Idea' }
                  setIdeas((prev) => [next, ...prev])
                  setActiveId(next.id)
                  setQuickIdea('')
                }}
                style={{ padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'var(--purple)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                + Add
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ideas.map((idea) => (
                <button key={idea.id} onClick={() => setActiveId(idea.id)} style={{ textAlign: 'left', border: '1px solid var(--border)', background: activeId === idea.id ? 'var(--purple-tint)' : 'var(--card)', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', fontFamily: 'var(--font-display)' }}>{idea.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{idea.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', gap: '8px', padding: '10px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              <button style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', fontWeight: 700 }}>B</button>
              <button style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', fontStyle: 'italic' }}>I</button>
              <button style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff' }}>• List</button>
            </div>
            {activeIdea ? (
              <>
                <textarea value={activeIdea.text} onChange={(e) => setIdeas((prev) => prev.map((i) => i.id === activeIdea.id ? { ...i, text: e.target.value } : i))} rows={12} style={{ width: '100%', border: 'none', outline: 'none', padding: '14px', background: '#fff', fontSize: '14px', lineHeight: 1.6 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
                  <button style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontWeight: 700, cursor: 'pointer' }}>Save</button>
                  <button onClick={() => { setDuelDraft(activeIdea.text); router.push('/compete/duel') }} style={{ padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'var(--green)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                    Import to Weekly Duel
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '20px', color: 'var(--text3)' }}>Select an idea to edit.</div>
            )}
          </div>
        </div>
      )}

      {tab === 'public' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '10px' }}>Vaults shared with you via chats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {PUBLIC_VAULTS.map((vault) => (
              <div key={vault.id} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'var(--surface)' }}>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{vault.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '10px' }}>{vault.members} members · Last edit {vault.lastEdit}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}>Open</button>
                  <button style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer' }}>Share in Chat</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
