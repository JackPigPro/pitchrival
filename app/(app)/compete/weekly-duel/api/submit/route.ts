import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { content, duel_id } = await request.json()
    
    if (!content || !duel_id) {
      return NextResponse.json(
        { error: 'Missing content or duel_id' },
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

    // Check if user already submitted to this duel
    const { data: existingSubmission } = await supabase
      .from('duel_submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('duel_id', duel_id)
      .single()

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted to this duel' },
        { status: 400 }
      )
    }

    // Insert new submission
    const { data: submission, error: submissionError } = await supabase
      .from('duel_submissions')
      .insert({
        user_id: user.id,
        duel_id: duel_id,
        content: content,
        vote_score: 0,
        vote_count: 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: 'Failed to submit idea' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        submission: {
          id: submission.id,
          content: submission.content,
          created_at: submission.created_at
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Submit submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
