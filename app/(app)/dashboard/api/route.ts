import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile error:', profileError)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    // Fetch user stats
    const { data: ideas, error: ideasError } = await supabase
      .from('ideas')
      .select('id')
      .eq('user_id', user.id)

    if (ideasError) {
      console.error('Ideas error:', ideasError)
      return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 })
    }

    const { data: likes, error: likesError } = await supabase
      .from('idea_likes')
      .select('idea_id')
      .in('idea_id', ideas?.map((i: any) => i.id) || [])

    if (likesError) {
      console.error('Likes error:', likesError)
      return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 })
    }

    const { data: comments, error: commentsError } = await supabase
      .from('idea_comments')
      .select('id')
      .eq('user_id', user.id)

    if (commentsError) {
      console.error('Comments error:', commentsError)
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    // Get ELO rating if it exists
    const { data: eloData } = await supabase
      .from('user_stats')
      .select('elo, rank')
      .eq('user_id', user.id)
      .single()

    const stats = {
      ideas_count: ideas?.length || 0,
      likes_received: likes?.length || 0,
      comments_count: comments?.length || 0,
      elo: eloData?.elo || 500,
      rank: eloData?.rank || 'Trainee'
    }


    return NextResponse.json({
      profile,
      stats
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
