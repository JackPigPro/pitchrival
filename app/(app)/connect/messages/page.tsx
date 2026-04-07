import { Suspense } from 'react'
import MessagesClient from './MessagesClient'

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--background)'
      }}>
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px', padding: '40px' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '12px',
              padding: '16px',
              borderRadius: '8px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--border)',
                flexShrink: 0
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  height: '16px',
                  background: 'var(--border)',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  width: '40%'
                }} />
                <div style={{
                  height: '12px',
                  background: 'var(--border)',
                  borderRadius: '4px',
                  width: '80%'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <MessagesClient />
    </Suspense>
  )
}
