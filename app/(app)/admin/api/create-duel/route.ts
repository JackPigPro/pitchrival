import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { prompt, start_date, end_date } = await request.json()
    
    if (!prompt || !start_date || !end_date) {
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

    // Check if user is admin
    const ADMIN_USER_ID = '849836c7-b04e-44ba-88ac-aea98eca8776'
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

    // Determine status based on start_date
    const startDate = new Date(start_date)
    const now = new Date()
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)
    
    let status = 'upcoming'
    if (startDate <= fiveMinutesFromNow) {
      status = 'active'
    }

    // Insert new weekly duel
    const { data, error: insertError } = await supabase
      .from('weekly_duel')
      .insert({
        prompt,
        start_date,
        end_date,
        status,
        prize_distributed: false
      })
      .select()
      .single()

    if (insertError || !data) {
      return NextResponse.json(
        { error: 'Failed to create duel' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        duel: {
          id: data.id,
          prompt: data.prompt,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
          prize_distributed: data.prize_distributed
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Create duel error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
