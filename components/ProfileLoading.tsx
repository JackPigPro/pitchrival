export default function ProfileLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Header Loading */}
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px' }}>
            {/* Profile Picture Loading */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--border2)',
              flexShrink: 0,
              animation: 'pulse 2s infinite'
            }} />

            {/* Profile Info Loading */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                width: '200px', 
                height: '28px', 
                background: 'var(--border2)', 
                borderRadius: '8px',
                marginBottom: '12px',
                animation: 'pulse 2s infinite'
              }} />
              
              <div style={{ 
                width: '150px', 
                height: '14px', 
                background: 'var(--border2)', 
                borderRadius: '4px',
                marginBottom: '16px',
                animation: 'pulse 2s infinite'
              }} />

              <div style={{ 
                width: '100%', 
                height: '60px', 
                background: 'var(--border2)', 
                borderRadius: '8px',
                marginBottom: '16px',
                animation: 'pulse 2s infinite'
              }} />

              {/* Tags Loading */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '80px', 
                  height: '24px', 
                  background: 'var(--border2)', 
                  borderRadius: '12px',
                  animation: 'pulse 2s infinite'
                }} />
                <div style={{ 
                  width: '100px', 
                  height: '24px', 
                  background: 'var(--border2)', 
                  borderRadius: '12px',
                  animation: 'pulse 2s infinite'
                }} />
                <div style={{ 
                  width: '90px', 
                  height: '24px', 
                  background: 'var(--border2)', 
                  borderRadius: '12px',
                  animation: 'pulse 2s infinite'
                }} />
              </div>
            </div>
          </div>

          {/* Stats Loading */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '16px', 
            paddingTop: '20px', 
            borderTop: '1px solid var(--border)' 
          }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '60px', 
                  height: '24px', 
                  background: 'var(--border2)', 
                  borderRadius: '4px',
                  margin: '0 auto 8px',
                  animation: 'pulse 2s infinite'
                }} />
                <div style={{ 
                  width: '80px', 
                  height: '12px', 
                  background: 'var(--border2)', 
                  borderRadius: '4px',
                  margin: '0 auto',
                  animation: 'pulse 2s infinite'
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Ideas Loading */}
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ 
            width: '120px', 
            height: '20px', 
            background: 'var(--border2)', 
            borderRadius: '4px',
            marginBottom: '24px',
            animation: 'pulse 2s infinite'
          }} />
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'var(--card2)',
                border: '1px solid var(--border2)'
              }}>
                <div style={{ 
                  width: '80%', 
                  height: '16px', 
                  background: 'var(--border2)', 
                  borderRadius: '4px',
                  marginBottom: '8px',
                  animation: 'pulse 2s infinite'
                }} />
                <div style={{ 
                  width: '100%', 
                  height: '40px', 
                  background: 'var(--border2)', 
                  borderRadius: '4px',
                  marginBottom: '12px',
                  animation: 'pulse 2s infinite'
                }} />
                <div style={{ 
                  width: '60px', 
                  height: '12px', 
                  background: 'var(--border2)', 
                  borderRadius: '4px',
                  animation: 'pulse 2s infinite'
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
