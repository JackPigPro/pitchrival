'use client'

import { useState, useEffect, useRef } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  sender?: { id: string; username: string; display_name?: string }
  receiver?: { id: string; username: string; display_name?: string }
}

interface Conversation {
  partner: {
    id: string
    username: string
    display_name?: string
    message_preference?: string
  }
  lastMessage: Message
  unreadCount: number
}

export default function MessagesClient() {
  const { user, authLoading } = useSupabase()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation)
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    try {
      setError(null)
      const response = await fetch('/connect/messages/api')
      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }
      
      const { data } = await response.json()
      setConversations(data || [])
    } catch (err) {
      console.error('Error fetching conversations:', err)
      setError('Failed to load conversations')
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/connect/messages/api?conversationId=${conversationId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      
      const { data } = await response.json()
      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!messageInput.trim() || !activeConversation || !user) return

    try {
      setError(null)
      const response = await fetch('/connect/messages/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: activeConversation,
          content: messageInput.trim()
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 403) {
          setError(errorData.error || 'Cannot send message')
          return
        }
        throw new Error('Failed to send message')
      }

      const { data } = await response.json()
      setMessages(prev => [...prev, data])
      setMessageInput('')
      
      // Update conversations list to reflect new message
      fetchConversations()
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message')
    }
  }

  const getInitials = (name?: string, username?: string) => {
    const displayName = name || username || 'Unknown'
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp + 'Z')
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString()
  }

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--background)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--green)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: 'var(--text2)', fontSize: '16px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
          Please log in to view messages
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
          You need to be signed in to send and receive messages.
        </p>
        <a 
          href="/login" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'var(--green)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600,
          }}
        >
          Log In
        </a>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--background)' }}>
      {/* Left sidebar - Conversation list */}
      <div style={{ 
        width: '280px', 
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)'
        }}>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: 700, 
            margin: 0,
            fontFamily: 'var(--font-display)'
          }}>
            Messages
          </h1>
        </div>
        
        <div style={{ flex: 1, overflow: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center',
              color: 'var(--text2)'
            }}>
              No conversations yet
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.partner.id}
                onClick={() => setActiveConversation(conversation.partner.id)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: activeConversation === conversation.partner.id ? 'var(--surface)' : 'transparent',
                  borderLeft: activeConversation === conversation.partner.id ? '3px solid var(--green)' : '3px solid transparent',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeConversation !== conversation.partner.id) {
                    e.currentTarget.style.background = 'var(--surface)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeConversation !== conversation.partner.id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    {getInitials(conversation.partner.display_name, conversation.partner.username)}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <div style={{
                        fontWeight: 600,
                        color: 'var(--text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {conversation.partner.display_name || conversation.partner.username}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: 'var(--text2)',
                        flexShrink: 0,
                        marginLeft: '8px'
                      }}>
                        {formatTimeAgo(conversation.lastMessage.created_at)}
                      </div>
                    </div>
                    
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text2)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {conversation.lastMessage.content}
                    </div>
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--green)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right side - Active conversation */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeConversation ? (
          <>
            {/* Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface)'
            }}>
              {conversations.find(c => c.partner.id === activeConversation) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    {getInitials(
                      conversations.find(c => c.partner.id === activeConversation)?.partner.display_name,
                      conversations.find(c => c.partner.id === activeConversation)?.partner.username
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                      {conversations.find(c => c.partner.id === activeConversation)?.partner.display_name || 
                       conversations.find(c => c.partner.id === activeConversation)?.partner.username}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.sender_id === user.id ? 'flex-end' : 'flex-start',
                      maxWidth: '70%'
                    }}
                  >
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: message.sender_id === user.id ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      background: message.sender_id === user.id ? 'var(--green)' : 'var(--card)',
                      color: message.sender_id === user.id ? 'white' : 'var(--text)',
                      wordBreak: 'break-word'
                    }}>
                      <div>{message.content}</div>
                      <div style={{
                        fontSize: '11px',
                        opacity: 0.7,
                        marginTop: '4px'
                      }}>
                        {formatTimeAgo(message.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)'
            }}>
              {error && (
                <div style={{
                  marginBottom: '12px',
                  padding: '8px 12px',
                  background: 'var(--red)',
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    resize: 'none',
                    minHeight: '44px',
                    maxHeight: '120px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    background: 'var(--background)',
                    color: 'var(--text)'
                  }}
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  style={{
                    padding: '12px 24px',
                    background: messageInput.trim() ? 'var(--green)' : 'var(--border)',
                    color: messageInput.trim() ? 'white' : 'var(--text2)',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '14px'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text2)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                Select a conversation
              </h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
