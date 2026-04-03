import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/utils/rateLimit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('idea_comments')
      .select('*')
      .eq('idea_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    // Fetch profiles for all comments
    const userIds = [...new Set(data?.map(comment => comment.user_id) || [])]
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, display_name')
      .in('id', userIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    // Merge profiles with comments
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
    const commentsWithProfiles = data?.map(comment => ({
      ...comment,
      profiles: profileMap.get(comment.user_id) || { username: 'unknown', display_name: 'Unknown User' }
    })) || []

    // Organize comments into nested structure
    const commentsMap = new Map()
    const rootComments: any[] = []

    commentsWithProfiles.forEach(comment => {
      commentsMap.set(comment.id, { ...comment, replies: [] })
    })

    commentsWithProfiles.forEach(comment => {
      const commentWithReplies = commentsMap.get(comment.id)
      if (comment.parent_id) {
        const parent = commentsMap.get(comment.parent_id)
        if (parent) {
          parent.replies.push(commentWithReplies)
        }
      } else {
        rootComments.push(commentWithReplies)
      }
    })

    return NextResponse.json({ data: rootComments })
  } catch (error) {
    console.error('Error in GET /api/ideas/[id]/comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allowed = rateLimit(user.id + '_comments', 30, 60 * 60 * 1000)
    if (!allowed) return NextResponse.json({ error: 'Too many requests, please slow down' }, { status: 429 })

    const body = await request.json()
    const { content, parent_id = null } = body

    // UUID validation helper
    const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)

    // Input validation
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required and must be a non-empty string' }, { status: 400 })
    }
    
    if (content.length < 1) {
      return NextResponse.json({ error: 'Content must be at least 1 character' }, { status: 400 })
    }
    
    if (content.length > 1000) {
      return NextResponse.json({ error: 'Content must be at most 1000 characters' }, { status: 400 })
    }
    
    if (parent_id !== null && parent_id !== undefined) {
      if (typeof parent_id !== 'string' || !isValidUUID(parent_id)) {
        return NextResponse.json({ error: 'parent_id must be a valid UUID format' }, { status: 400 })
      }
    }

    const { data, error } = await supabase
      .from('idea_comments')
      .insert({
        idea_id: id,
        user_id: user.id,
        parent_id,
        content: content.trim(),
      })
      .select('*')
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    // Fetch profile for the created comment
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, display_name')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    // Add profile to the response
    const commentWithProfile = {
      ...data,
      profiles: profile || { username: 'unknown', display_name: 'Unknown User' }
    }

    return NextResponse.json({ data: { ...commentWithProfile, replies: [] } })
  } catch (error) {
    console.error('Error in POST /api/ideas/[id]/comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
