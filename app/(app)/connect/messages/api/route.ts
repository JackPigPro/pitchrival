import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/utils/rateLimit'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (conversationId) {
      // Parse pagination parameters
      const limit = parseInt(searchParams.get('limit') || '50')
      const cursor = searchParams.get('cursor')
      
      // Build query
      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, username, display_name),
          receiver:profiles!messages_receiver_id_fkey(id, username, display_name)
        `)
        .or(`(sender_id.eq.${user.id},receiver_id.eq.${conversationId}),(sender_id.eq.${conversationId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: false })
        .limit(limit + 1) // +1 to check if there are more messages

      // Add cursor if provided (for pagination)
      if (cursor) {
        query = query.lt('created_at', cursor)
      }

      const { data: messages, error } = await query

      if (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
      }

      // Check if there are more messages
      const hasMore = messages && messages.length > limit
      const actualMessages = hasMore ? messages.slice(0, -1) : messages || []
      
      // Sort messages in ascending order for display (oldest first)
      actualMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

      // Get cursor for next page (created_at of oldest message)
      const nextCursor = actualMessages.length > 0 ? actualMessages[0].created_at : null

      return NextResponse.json({ 
        data: actualMessages,
        pagination: {
          hasMore,
          nextCursor
        }
      })
    } else {
      // Return list of conversations
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
      }

      // Group messages by conversation partner
      const conversationMap = new Map<string, any>()
      
      messages?.forEach(message => {
        const partnerId = message.sender_id === user.id ? message.receiver_id : message.sender_id
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            partnerId,
            lastMessage: message,
            unreadCount: message.receiver_id === user.id ? 1 : 0
          })
        } else {
          const conversation = conversationMap.get(partnerId)
          if (message.receiver_id === user.id) {
            conversation.unreadCount++
          }
        }
      })

      // Fetch profiles for all conversation partners
      const partnerIds = Array.from(conversationMap.keys())
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .in('id', partnerIds)

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
        return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
      }

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
      
      const conversations = Array.from(conversationMap.values()).map(conversation => ({
        partner: profileMap.get(conversation.partnerId) || { username: 'unknown', display_name: 'Unknown User' },
        lastMessage: conversation.lastMessage,
        unreadCount: conversation.unreadCount
      }))

      return NextResponse.json({ data: conversations })
    }
  } catch (error) {
    console.error('Error in GET /api/messages:', error)
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

    const allowed = rateLimit(user.id + '_messages', 30, 60 * 60 * 1000)
    if (!allowed) return NextResponse.json({ error: 'Too many requests, please slow down' }, { status: 429 })

    const body = await request.json()
    const { receiver_id, content } = body

    // UUID validation helper
    const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)

    // Input validation
    if (!receiver_id || typeof receiver_id !== 'string' || !isValidUUID(receiver_id)) {
      return NextResponse.json({ error: 'receiver_id is required and must be a valid UUID format' }, { status: 400 })
    }
    
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required and must be a non-empty string' }, { status: 400 })
    }
    
    if (content.length < 1) {
      return NextResponse.json({ error: 'Content must be at least 1 character' }, { status: 400 })
    }
    
    if (content.length > 2000) {
      return NextResponse.json({ error: 'Content must be at most 2000 characters' }, { status: 400 })
    }

    // Check if there's an accepted cofounder request between the two users
    const { data: cofounderRequest, error: cofounderError } = await supabase
      .from('cofounder_requests')
      .select('*')
      .or(`(sender_id.eq.${user.id},receiver_id.eq.${receiver_id}),(sender_id.eq.${receiver_id},receiver_id.eq.${user.id})`)
      .eq('status', 'accepted')
      .single()

    if (cofounderError || !cofounderRequest) {
      return NextResponse.json({ error: 'You can only message your co-founders. Send them a co-founder request first.' }, { status: 403 })
    }

    // Insert the message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id,
        content,
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, display_name),
        receiver:profiles!messages_receiver_id_fkey(id, username, display_name)
      `)
      .single()

    if (error) {
      console.error('Error creating message:', error)
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
    }

    // Insert notification for receiver
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: receiver_id,
        type: 'new_message',
        title: 'New Message',
        body: content.substring(0, 60) + (content.length > 60 ? '...' : ''),
        related_user_id: user.id,
      })

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      // Don't fail the request if notification fails
    }

    return NextResponse.json({ data: message })
  } catch (error) {
    console.error('Error in POST /api/messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
