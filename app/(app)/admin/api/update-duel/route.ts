import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { id, prompt, start_date, end_date, status } = await request.json()
    
    if (!id || !prompt || !start_date || !end_date || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Update the duel
    const { data, error: updateError } = await supabase
      .from('weekly_duel')
      .update({
        prompt,
        start_date,
        end_date,
        status
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Update duel error:', updateError)
      return NextResponse.json(
        { error: updateError.message || 'Failed to update duel' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        duel: data,
        message: 'Duel updated successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Update duel error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
