'use client'

import { useState } from 'react'

interface ProfileCompletionPopupProps {
  onDismiss: () => void
  username: string
}

export default function ProfileCompletionPopup({ onDismiss, username }: ProfileCompletionPopupProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss()
  }

  const handleCompleteProfile = () => {
    setIsVisible(false)
    onDismiss()
    window.location.href = `/profile/${username}`
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}
        onClick={handleDismiss}
      />
      
      {/* Popup Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          zIndex: 1001,
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideIn 0.3s ease'
        }}
      >
        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translate(-50%, -45%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        `}</style>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            fontSize: '48px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
            marginBottom: '16px'
          }}>
            {'\ud83d\udc64'}
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
            margin: 0,
            marginBottom: '12px'
          }}>
            Complete Your Profile
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'var(--text2)',
            lineHeight: '1.5',
            margin: 0,
            fontFamily: 'var(--font-body)'
          }}>
            Add your bio, skills, and what you're looking for to get better cofounder matches and make meaningful connections.
          </p>
        </div>

        {/* Benefits */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '12px' }}>
            Why complete your profile?
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>{'\u2728'}</span>
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Better cofounder matches</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>{'\ud83d\udc65'}</span>
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>More connection requests</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>{'\ud83c\udfaf'}</span>
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Show up in relevant searches</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleCompleteProfile}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--green)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
          >
            Complete Profile
          </button>
          
          <button
            onClick={handleDismiss}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: 'var(--text2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text2)'
            }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </>
  )
}
