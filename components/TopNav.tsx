import { createClient } from '@/utils/supabase/server'
import TopNavClient from './TopNavClient'

export default async function TopNav() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  const name =
    (user?.user_metadata?.name as string | undefined) ??
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.email ? user.email.split('@')[0] : null)

  return <TopNavClient user={user ? { email: user.email, name } : null} />
}

