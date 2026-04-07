'use client'

import { useEffect, useState } from 'react'

interface EloPopupProps {
  message: string
  show: boolean
  duration?: number
}

export default function EloPopup({ message, show, duration = 3000 }: EloPopupProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '32px',
      background: 'var(--green)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '16px',
      fontFamily: 'var(--font-display)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease',
      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
    }}>
      {message}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
