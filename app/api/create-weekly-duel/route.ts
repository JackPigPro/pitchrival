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
    const ADMIN_USER_ID = '849836c7-b04e-44ba-88ac-aea98eca8776'

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
      return NextResponse.json({ error: 'Failed to create weekly duel' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in create-weekly-duel API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
