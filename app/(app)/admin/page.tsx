import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDuelManager from './duel-manager'

export default async function AdminPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }

  // Get user profile to check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('id', user.id)
    .single()

  // Hardcoded admin ID - your actual user ID
  const ADMIN_USER_ID = 'a4dc1d84-fc05-4018-b3ce-7c60f3a4244c'

  if (!profile || profile.id !== ADMIN_USER_ID) {
    redirect('/dashboard')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg)',
      backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '10px', fontSize: '13px', letterSpacing: '2.4px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            ⚔️ ADMIN
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px', fontFamily: 'var(--font-display)', color: 'var(--text)', margin: 0 }}>
            Weekly Duel Management
          </h1>
        </div>

        <AdminDuelManager />
      </div>
    </div>
  )
}
