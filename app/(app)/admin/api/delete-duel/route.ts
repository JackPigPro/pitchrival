import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { duelId } = await request.json()
    
    if (!duelId) {
      return NextResponse.json(
        { error: 'Missing duelId' },
        { status: 400 }
      )
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if user is admin (hardcoded admin ID)
    const ADMIN_USER_ID = '9caa7790-28ca-4b10-92fb-960cf95fd4fe'
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!profile || profile.id !== ADMIN_USER_ID) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // First delete related submissions
    const { error: submissionsError } = await supabase
      .from('duel_submissions')
      .delete()
      .eq('duel_id', duelId)

    if (submissionsError) {
      console.error('Delete submissions error:', submissionsError)
      return NextResponse.json(
        { error: 'Failed to delete submissions' },
        { status: 500 }
      )
    }

    // Then delete related winners
    const { error: winnersError } = await supabase
      .from('duel_winners')
      .delete()
      .eq('duel_id', duelId)

    if (winnersError) {
      console.error('Delete winners error:', winnersError)
      return NextResponse.json(
        { error: 'Failed to delete winners' },
        { status: 500 }
      )
    }

    // Finally delete the duel
    const { error: duelError } = await supabase
      .from('weekly_duel')
      .delete()
      .eq('id', duelId)

    if (duelError) {
      console.error('Delete duel error:', duelError)
      return NextResponse.json(
        { error: duelError.message || 'Failed to delete duel' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Duel deleted successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Delete duel error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
