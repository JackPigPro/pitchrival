import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { duel_id } = await request.json()
    
    if (!duel_id) {
      return NextResponse.json(
        { error: 'Missing duel_id' },
        { status: 400 }
      )
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if user is admin (hardcoded admin ID)
    const ADMIN_USER_ID = '9caa7790-28ca-4b10-92fb-960cf95fd4fe' // Hardcoded admin ID - your actual user ID
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

    // Call the distribute_duel_prizes function
    const { data, error: distributeError } = await supabase
      .rpc('distribute_duel_prizes', { 
        params: { duel_id }
      })

    if (distributeError) {
      return NextResponse.json(
        { error: distributeError.message || 'Failed to distribute prizes' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Prizes distributed successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Distribute prizes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
