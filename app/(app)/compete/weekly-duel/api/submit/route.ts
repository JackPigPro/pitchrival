import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/utils/rateLimit'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { content, duel_id } = await request.json()
    
    // UUID validation helper
    const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)

    // Input validation
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      )
    }
    
    if (content.length < 10) {
      return NextResponse.json(
        { error: 'Content must be at least 10 characters' },
        { status: 400 }
      )
    }
    
    if (content.length > 10000) {
      return NextResponse.json(
        { error: 'Content must be at most 10000 characters' },
        { status: 400 }
      )
    }
    
    if (!duel_id || typeof duel_id !== 'string' || !isValidUUID(duel_id)) {
      return NextResponse.json(
        { error: 'duel_id is required and must be a valid UUID format' },
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

    const allowed = rateLimit(user.id + '_duel_submit', 1, 10080 * 60 * 1000)
    if (!allowed) return NextResponse.json({ error: 'Too many requests, please slow down' }, { status: 429 })

    // Check if user already submitted to this duel
    const { data: existingSubmission } = await supabase
      .from('duel_submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('duel_id', duel_id)
      .maybeSingle()

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
      console.error('Submission insert error:', {
        error: submissionError,
        message: submissionError?.message,
        details: submissionError?.details,
        hint: submissionError?.hint,
        code: submissionError?.code,
        user_id: user.id,
        duel_id: duel_id
      })
      return NextResponse.json(
        { error: 'Failed to submit idea', details: submissionError?.message },
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
