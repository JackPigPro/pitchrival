const RANKS = [
    { min: 2000, label: '🦄 Unicorn',   color: '#f59e0b' },
    { min: 1800, label: '🚀 Visionary', color: '#8b5cf6' },
    { min: 1600, label: '⚡ Disruptor', color: '#3b82f6' },
    { min: 1400, label: '🏅 Innovator', color: '#22c55e' },
    { min: 1200, label: '🏗️ Founder',   color: '#10b981' },
    { min: 1000, label: '🔨 Builder',   color: '#6b7280' },
    { min: 800,  label: '📐 Maker',     color: '#9ca3af' },
    { min: 0,    label: '🌱 Trainee',   color: '#d1d5db' },
  ]
  
  const LEADERS = [
    { rank: 1,  name: 'DesignWolf',   elo: 1891, wins: 67, matches: 94,  streak: 9,  you: false },
    { rank: 2,  name: 'NeonBrush',    elo: 1756, wins: 58, matches: 89,  streak: 4,  you: false },
    { rank: 3,  name: 'StartupSage',  elo: 1698, wins: 52, matches: 80,  streak: 2,  you: false },
    { rank: 4,  name: 'CodeNomad',    elo: 1540, wins: 44, matches: 71,  streak: 0,  you: false },
    { rank: 5,  name: 'PitchQueen',   elo: 1489, wins: 40, matches: 66,  streak: 3,  you: false },
    { rank: 6,  name: 'FounderFuel',  elo: 1420, wins: 36, matches: 58,  streak: 1,  you: false },
    { rank: 7,  name: 'BrandBlitz',   elo: 1398, wins: 33, matches: 55,  streak: 0,  you: false },
    { rank: 8,  name: 'IdeaForge',    elo: 1361, wins: 30, matches: 51,  streak: 2,  you: false },
    { rank: 47, name: 'Jordan Rivera',elo: 1240, wins: 29, matches: 47,  streak: 4,  you: true  },
  ]
  
  function getRankLabel(elo: number) {
    return RANKS.find(r => elo >= r.min) || RANKS[RANKS.length - 1]
  }
  
  export default function LeaderboardPage() {
    return (
      <div style={{ maxWidth: '900px' }}>
  
        {/* Rank tiers legend */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {RANKS.map((r) => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: 'var(--card)', border: '1px solid var(--border)', fontSize: '12px', fontWeight: 700, color: r.color, fontFamily: 'var(--font-display)', boxShadow: 'var(--shadow-sm)' }}>
              {r.label} <span style={{ color: 'var(--text3)', fontWeight: 400 }}>{r.min}+</span>
            </div>
          ))}
        </div>
  
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px' }}>
  
          {/* Leaderboard table */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 80px 70px 70px 60px', gap: '0', padding: '10px 22px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              {['#', 'Founder', 'ELO', 'Wins', 'Matches', 'Streak'].map((h) => (
                <div key={h} style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)' }}>{h}</div>
              ))}
            </div>
  
            {LEADERS.map((row, i) => {
              const rankInfo = getRankLabel(row.elo)
              const isYou = row.you
              const showDivider = i === 7 && !LEADERS[i + 1]?.you === false
  
              return (
                <div key={row.rank}>
                  {/* Ellipsis row between #8 and #47 */}
                  {row.rank === 47 && (
                    <div style={{ padding: '10px 22px', borderBottom: '1px solid var(--border)', textAlign: 'center', fontSize: '12px', color: 'var(--text3)' }}>
                      · · · 38 more founders · · ·
                    </div>
                  )}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr 80px 70px 70px 60px',
                    alignItems: 'center', gap: '0',
                    padding: '13px 22px',
                    borderBottom: i < LEADERS.length - 1 ? '1px solid var(--border)' : 'none',
                    background: isYou ? 'var(--green-tint)' : 'transparent',
                    borderLeft: isYou ? '3px solid var(--green)' : '3px solid transparent',
                  }}>
                    <div style={{ fontSize: i < 3 ? '18px' : '13px', fontWeight: 700, color: isYou ? 'var(--green)' : 'var(--text3)', fontFamily: 'var(--font-display)' }}>
                      {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `#${row.rank}`}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isYou ? 'var(--green-mid)' : 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: isYou ? 'var(--green)' : 'var(--text2)', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                        {row.name[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: isYou ? 700 : 600, color: isYou ? 'var(--green)' : 'var(--text)', fontFamily: 'var(--font-display)' }}>
                          {row.name} {isYou && '(You)'}
                        </div>
                        <div style={{ fontSize: '10px', color: rankInfo.color, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{rankInfo.label}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: isYou ? 'var(--green)' : 'var(--text)', fontFamily: 'var(--font-display)' }}>{row.elo.toLocaleString()}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{row.wins}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{row.matches}</div>
                    <div style={{ fontSize: '13px', color: row.streak > 0 ? 'var(--green)' : 'var(--text3)', fontWeight: row.streak > 0 ? 700 : 400 }}>
                      {row.streak > 0 ? `🔥 ${row.streak}` : '—'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
  
          {/* Right: Your standing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>YOUR STANDING</span>
              </div>
              <div style={{ padding: '20px 18px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>CURRENT RANK</div>
                <div style={{ fontSize: '38px', fontWeight: 900, color: 'var(--green)', fontFamily: 'var(--font-display)', letterSpacing: '-2px', marginBottom: '4px' }}>#47</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '18px' }}>↑4 positions this week</div>
  
                <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                  {[{ label: 'ELO', value: '1,240' }, { label: 'Wins', value: '29' }].map(s => (
                    <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'var(--surface)', borderRadius: '9px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{s.value}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
  
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--text2)' }}>+78 ELO</strong> needed to reach 🏅 Innovator
                </div>
                <div style={{ height: '6px', background: 'var(--surface)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ height: '100%', width: '62%', background: 'linear-gradient(90deg, var(--green), #22c55e)', borderRadius: '3px' }}></div>
                </div>
  
                <a href="/compete/duel" style={{
                  display: 'block', textAlign: 'center', padding: '11px',
                  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                  borderRadius: '9px', color: '#fff',
                  fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(21,128,61,.3)',
                }}>
                  ⚔️ Enter This Week&apos;s Duel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }