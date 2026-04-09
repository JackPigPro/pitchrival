import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SchoolsClient from './SchoolsClient'

export default async function SchoolsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Let the client handle showing the login screen
  }

  return <SchoolsClient />
}

