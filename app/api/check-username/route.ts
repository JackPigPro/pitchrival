import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')

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
      available: false, 
      error: failedRule.message 
    }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    
    // Check if username exists (case-insensitive)
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.trim().toLowerCase())
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking username:', error)
      return NextResponse.json({ 
        available: false, 
        error: 'Failed to check username availability' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      available: !data, // available if no data found
      username: username.trim()
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      available: false, 
      error: 'Server error' 
    }, { status: 500 })
  }
}
