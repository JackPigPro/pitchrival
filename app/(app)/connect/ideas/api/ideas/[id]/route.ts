import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
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

    const body = await request.json()
    const { title, content, is_public } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const { data: existingIdea, error: fetchError } = await supabase
      .from('ideas')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingIdea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    if (existingIdea.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('ideas')
      .update({
        title,
        content,
        is_public,
        edited_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        profiles(username, display_name),
        _count: idea_likes(count), idea_comments(count)
      `)
      .single()

    if (error) {
      console.error('Error updating idea:', error)
      return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in PUT /api/ideas/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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

    const { data: existingIdea, error: fetchError } = await supabase
      .from('ideas')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingIdea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    if (existingIdea.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting idea:', error)
      return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/ideas/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
