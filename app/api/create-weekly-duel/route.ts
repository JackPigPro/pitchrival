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
    console.log('Calling create_weekly_duel function with prompt:', prompt.trim())
    const { data, error } = await supabase.rpc('create_weekly_duel', {
      prompt_text: prompt.trim()
    })

    console.log('Supabase response - data:', data)
    console.log('Supabase response - error:', error)

    if (error) {
      console.error('Error creating weekly duel:', error)
      return NextResponse.json({ success: false, error: 'Failed to create weekly duel', details: error }, { status: 500 })
    }

    // The function returns a UUID directly, not an object
    if (data) {
      console.log('Duel created successfully with ID:', data)
      return NextResponse.json({ success: true, duel_id: data }, { status: 200 })
    } else {
      console.log('No data returned from create_weekly_duel function')
      return NextResponse.json({ success: false, error: 'Failed to create duel' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in create-weekly-duel API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
