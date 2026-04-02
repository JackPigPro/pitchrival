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

    // Fetch profiles where 'Open to Co-founder' is in status_tags
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .contains('status_tags', ['Open to Co-founder'])

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    // Fetch cofounder requests where user is sender or receiver
    const { data: requests, error: requestsError } = await supabase
      .from('cofounder_requests')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

    if (requestsError) {
      console.error('Error fetching cofounder requests:', requestsError)
      return NextResponse.json({ error: 'Failed to fetch cofounder requests' }, { status: 500 })
    }

    return NextResponse.json({ profiles, requests })
  } catch (error) {
    console.error('Error in GET /api/cofounder-match:', error)
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
    const { receiver_id } = body

    if (!receiver_id) {
      return NextResponse.json({ error: 'receiver_id is required' }, { status: 400 })
    }

    if (receiver_id === user.id) {
      return NextResponse.json({ error: 'Cannot send request to yourself' }, { status: 400 })
    }

    // Insert cofounder request
    const { data: newRequest, error: requestError } = await supabase
      .from('cofounder_requests')
      .insert({
        sender_id: user.id,
        receiver_id,
        status: 'pending'
      })
      .select()
      .single()

    if (requestError) {
      console.error('Error creating cofounder request:', requestError)
      return NextResponse.json({ error: 'Failed to create cofounder request' }, { status: 500 })
    }

    // Insert notification for receiver
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: receiver_id,
        type: 'cofounder_request_received',
        title: 'New Co-founder Request',
        body: 'Someone wants to co-found with you',
        reference_id: user.id,
        reference_type: 'user'
      })

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      // Don't fail the request if notification fails
    }

    return NextResponse.json(newRequest)
  } catch (error) {
    console.error('Error in POST /api/cofounder-match:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { request_id, action } = body

    if (!request_id || !action || !['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'request_id and action (accept/reject) are required' }, { status: 400 })
    }

    // Update the request status
    const { data: updatedRequest, error: updateError } = await supabase
      .from('cofounder_requests')
      .update({ status: action })
      .eq('id', request_id)
      .eq('receiver_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating cofounder request:', updateError)
      return NextResponse.json({ error: 'Failed to update cofounder request' }, { status: 500 })
    }

    // If accepted, send notification to sender
    if (action === 'accept') {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: updatedRequest.sender_id,
          type: 'cofounder_request_accepted',
          title: 'Co-founder Request Accepted',
          body: 'Your co-founder request was accepted!',
          reference_id: user.id,
          reference_type: 'user'
        })

      if (notificationError) {
        console.error('Error creating acceptance notification:', notificationError)
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PATCH /api/cofounder-match:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { request_id } = body

    if (!request_id) {
      return NextResponse.json({ error: 'request_id is required' }, { status: 400 })
    }

    // Delete the request where user is the sender
    const { error: deleteError } = await supabase
      .from('cofounder_requests')
      .delete()
      .eq('id', request_id)
      .eq('sender_id', user.id)

    if (deleteError) {
      console.error('Error deleting cofounder request:', deleteError)
      return NextResponse.json({ error: 'Failed to delete cofounder request' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/cofounder-match:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
