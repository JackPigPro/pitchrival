import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get query parameters
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = (page - 1) * limit

  try {
    // Clean up old activity (older than 24 hours) - only from activity feed, not actual data
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    // First delete old notifications (these are just activity feed entries)
    await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)
      .lt('created_at', twentyFourHoursAgo)

    // Fetch recent activity with pagination
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching activity:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get total count for pagination info
    const { count, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      console.error('Error getting count:', countError)
    }

    return NextResponse.json({ 
      activity: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: (offset + limit) < (count || 0)
      }
    })
  } catch (error) {
    console.error('Error in dashboard activity API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
