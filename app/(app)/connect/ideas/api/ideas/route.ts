import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sort = searchParams.get('sort') || 'latest'
    const userId = searchParams.get('userId')

    let query = supabase
      .from('ideas')
      .select(`
        *,
        profiles(username, display_name),
        idea_likes(id, user_id, created_at),
        idea_comments(id, user_id, parent_id, content, edited_at, created_at),
        _count: idea_likes(count), idea_comments(count)
      `)
      .eq('is_public', true)

    // If userId is provided, also include private ideas for that user
    if (userId) {
      query = query.or(`is_public.eq.true,user_id.eq.${userId}`)
    }

    if (sort === 'most_liked') {
      query = query.order('_count', { ascending: false, foreignTable: 'idea_likes' })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching ideas:', error)
      return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in GET /api/ideas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, is_public = true } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('ideas')
      .insert({
        user_id: user.id,
        title,
        content,
        is_public,
      })
      .select(`
        *,
        profiles(username, display_name),
        _count: idea_likes(count), idea_comments(count)
      `)
      .single()

    if (error) {
      console.error('Error creating idea:', error)
      return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in POST /api/ideas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
