'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppState } from '../../../../components/AppStateProvider'

const PRIVATE_IDEAS = [
  { id: 1, title: 'ParkShare v2 — B2B pivot', note: 'Targeting commercial property managers instead of homeowners. Much better margins.', updated: '1h ago', draftForDuel: false },
  { id: 2, title: 'Campus micro-gig platform', note: 'ASU pilot notes. 80 users. Key insight: trust is the bottleneck, not supply.', updated: '3d ago', draftForDuel: false },
  { id: 3, title: 'EV charging arbitrage', note: 'Early research phase. Not ready to share yet.', updated: '1w ago', draftForDuel: false },
]

const DUEL_DRAFTS = [
  { id: 1, prompt: 'Brand a sustainable fashion startup targeting Gen Z in a single tagline.', draft: 'Wear Less, Mean More — fashion for the generation that actually checks the label.', updated: '4h ago', status: 'In progress' },
]

export default function VaultPage() {
  const router = useRouter()
  const { setDuelDraft, setForumDraft } = useAppState()
  const [tab, setTab] = useState<'ideas' | 'drafts'>('ideas')
  const [editorText, setEditorText] = useState('My next startup note...')

  return (
    <div style={{ width: '100%' }}>
      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
        {(['ideas', 'drafts'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 28px',
            background: tab === t ? 'var(--purple)' : 'transparent',
            border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 700,
            color: tab === t ? '#fff' : 'var(--text3)',
            fontFamily: 'var(--font-display)',
            transition: 'all .15s',
          }}>
            {t === 'ideas' ? '🔐 Private Ideas' : '✍️ Duel Drafts'}
          </button>
        ))}
      </div>

      {tab === 'ideas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '14px' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: '8px', padding: '10px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                <button style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', fontWeight: 700 }}>B</button>
                <button style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', fontStyle: 'italic' }}>I</button>
                <button style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff' }}>• List</button>
              </div>
              <textarea value={editorText} onChange={(e) => setEditorText(e.target.value)} rows={14} style={{ width: '100%', border: 'none', outline: 'none', padding: '14px', background: '#fff', fontSize: '14px', lineHeight: 1.6 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
                <button onClick={() => { setDuelDraft(editorText); router.push('/compete/duel') }} style={{ padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'var(--green)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  Send to Duel
                </button>
                <button onClick={() => { setForumDraft(editorText); router.push('/connect/feedback') }} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontWeight: 700, cursor: 'pointer' }}>
                  Send to Feedback
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>Folders</div>
                {['Duel Drafts', 'Random Thoughts', 'Crazy Ideas'].map((folder) => (
                  <div key={folder} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', color: 'var(--text2)' }}>{folder}</div>
                ))}
              </div>
              <div style={{ background: 'var(--purple-tint)', border: '1px solid rgba(124,58,237,.2)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '12px', color: 'var(--purple)', fontWeight: 700, marginBottom: '6px' }}>Private by default</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)' }}>Vault stays private unless you choose to publish to duel or feedback.</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {PRIVATE_IDEAS.map((idea) => (
              <div key={idea.id} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '16px',
                boxShadow: 'var(--shadow-sm)', borderLeft: '3px solid var(--purple)',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>{idea.title}</div>
                <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '10px' }}>{idea.note}</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '5px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text3)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Edit</button>
                  <button onClick={() => { setForumDraft(idea.note); router.push('/connect/feedback') }} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '5px', background: 'var(--green-tint)', border: '1px solid rgba(22,163,74,.2)', color: 'var(--green)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Publish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'drafts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {DUEL_DRAFTS.map((draft) => (
            <div key={draft.id} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '22px',
              boxShadow: 'var(--shadow-sm)',
              borderLeft: '3px solid var(--green)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--green)', fontFamily: 'var(--font-display)' }}>⚡ This Week&apos;s Duel Draft</span>
                <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '4px', background: 'var(--green-tint)', color: 'var(--green)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{draft.status}</span>
              </div>
              <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text3)', marginBottom: '12px', padding: '10px 14px', background: 'var(--surface)', borderRadius: '7px', lineHeight: 1.5 }}>
                Prompt: &ldquo;{draft.prompt}&rdquo;
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '14px', lineHeight: 1.4 }}>
                &ldquo;{draft.draft}&rdquo;
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                  ✏️ Keep Editing
                </button>
                <button onClick={() => { setDuelDraft(draft.draft); router.push('/compete/duel') }} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                  ⚔️ Submit to Duel
                </button>
              </div>
            </div>
          ))}

          <Link href="/compete/duel" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '16px 20px', borderRadius: '12px',
            border: '2px dashed var(--border)', background: 'transparent',
            color: 'var(--text3)',
            fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)',
            textDecoration: 'none',
          }}>
            + Start a New Draft
          </Link>
        </div>
      )}
    </div>
  )
}
