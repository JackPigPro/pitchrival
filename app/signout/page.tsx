'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function SignOutPage() {
  useEffect(() => {
    const performSignOut = async () => {
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
        
        // Clear all local storage
        localStorage.clear()
        sessionStorage.clear()
        
        // Redirect to landing page after sign out completes
        window.location.href = '/'
      } catch (error) {
        console.error('Error during sign out:', error)
        // Still redirect even if there's an error
        window.location.href = '/'
      }
    }

    performSignOut()
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontSize: '16px',
      color: 'var(--text2)'
    }}>
      Signing out...
    </div>
  )
}
