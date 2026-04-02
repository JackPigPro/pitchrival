'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function ProfilePage() {
  const router = useRouter()
  // Remove blocking loading state - render page shell immediately
  // const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const redirectToUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Get username from profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single()

          if (profile?.username) {
            router.replace(`/profile/${profile.username}`)
          } else {
            // User doesn't have a profile/username yet, redirect to onboarding
            router.replace('/onboarding')
          }
        } else {
          // Not logged in, redirect to login
          router.replace('/login')
        }
      } catch (error) {
        console.error('Error redirecting to profile:', error)
        router.replace('/')
      } finally {
        // Remove setLoading(false) - no blocking loading
      }
    }

    redirectToUserProfile()
  }, [router, supabase])

  // Remove blocking loading check - render page shell immediately
  // if (loading) {
  //   return (
  //     <div style={{ 
  //       minHeight: '100vh', 
  //       display: 'flex', 
  //       alignItems: 'center', 
  //       justifyContent: 'center',
  //       background: 'var(--bg)'
  //     }}>
  //       <div style={{ textAlign: 'center' }}>
  //         <div style={{ 
  //           width: '40px', 
  //           height: '40px', 
  //           border: '3px solid var(--border2)', 
  //           borderTop: '3px solid var(--green)', 
  //           borderRadius: '50%',
  //           animation: 'spin 1s linear infinite',
  //           margin: '0 auto 16px'
  //         }} />
  //         <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Loading profile...</p>
  //       </div>
  //       <style jsx>{`
  //         @keyframes spin {
  //           0% { transform: rotate(0deg); }
  //           100% { transform: rotate(360deg); }
  //         }
  //       `}</style>
  //     </div>
  //   )
  // }

  return null
}
