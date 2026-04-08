import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { username } = body

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    // Validate username format
    const validationRules = [
      {
        test: username.length >= 3 && username.length <= 20,
        message: 'Username must be 3-20 characters'
      },
      {
        test: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(username),
        message: 'Username must start with a letter and contain only letters, numbers, and underscores'
      }
    ]

    const failedRule = validationRules.find(rule => !rule.test)
    if (failedRule) {
      return NextResponse.json({ 
        error: failedRule.message 
      }, { status: 400 })
    }

    // Check if username is available
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.trim())
      .single()

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Username is already taken' 
      }, { status: 400 })
    }

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: username.trim(),
        onboarding_complete: true,
      })

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ 
        error: 'Failed to update profile' 
      }, { status: 500 })
    }

    // Create user_stats
    const { error: statsError } = await supabase
      .from('user_stats')
      .upsert({
        user_id: user.id,
        elo: 500,
        rank: 'Builder',
        weekly_duel_entered: false
      })

    if (statsError) {
      console.error('Stats error:', statsError)
      return NextResponse.json({ 
        error: 'Failed to create user stats' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      username: username.trim()
    })

  } catch (error) {
    console.error('Onboarding completion error:', error)
    return NextResponse.json({ 
      error: 'Server error during onboarding' 
    }, { status: 500 })
  }
}
