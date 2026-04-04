import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', user.id)
      .single()

    // Hardcoded admin ID
    const ADMIN_USER_ID = 'a4dc1d84-fc05-4018-b3ce-7c60f3a4244c'

    if (!profile || profile.id !== ADMIN_USER_ID) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { prompt } = await request.json()

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Call the Supabase function
    const { data, error } = await supabase.rpc('create_weekly_duel', {
      prompt_text: prompt.trim()
    })

    if (error) {
      console.error('Error creating weekly duel:', error)
      return NextResponse.json({ success: false, error: 'Failed to create weekly duel' }, { status: 500 })
    }

    // Ensure the response has the expected structure
    if (data && data.success) {
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json({ success: false, error: 'Unexpected response from database' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in create-weekly-duel API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
