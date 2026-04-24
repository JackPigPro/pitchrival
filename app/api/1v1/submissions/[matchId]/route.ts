import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const matchId = params.matchId

    // Fetch submissions with user details
    const { data: submissions, error } = await supabase
      .from('match_submissions')
      .select(`
        *,
        user:profiles!match_submissions_user_id_fkey (username, display_name)
      `)
      .eq('match_id', matchId)

    if (error) {
      console.error('Fetch submissions error:', error)
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: submissions })
  } catch (error) {
    console.error('Fetch submissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
