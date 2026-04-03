import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'user_id parameter is required' }, { status: 400 })
    }

    // Check if there's an accepted cofounder request between the two users
    const { data: cofounderRequest, error } = await supabase
      .from('cofounder_requests')
      .select('*')
      .or(`(sender_id.eq.${user.id},receiver_id.eq.${user_id}),(sender_id.eq.${user_id},receiver_id.eq.${user.id})`)
      .eq('status', 'accepted')
      .single()

    if (error || !cofounderRequest) {
      return NextResponse.json({ error: 'No accepted cofounder request found' }, { status: 403 })
    }

    return NextResponse.json({ data: { canMessage: true } })
  } catch (error) {
    console.error('Error in GET /api/cofounder/check:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
