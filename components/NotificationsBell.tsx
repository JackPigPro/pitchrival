'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'

interface Notification {
  id: string
  type: 'idea_liked' | 'idea_commented' | 'comment_replied' | 'cofounder_request_received' | 'cofounder_request_accepted' | 'new_message'
  title: string
  body: string
  read: boolean
  created_at: string
}

export default function NotificationsBell() {
  const { user, authLoading } = useSupabase()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'idea_liked': return '❤️'
      case 'idea_commented': return '💬'
      case 'comment_replied': return '↩️'
      case 'cofounder_request_received': return '🤝'
      case 'cofounder_request_accepted': return '🎉'
      case 'new_message': return '✉️'
      default: return '🔔'
    }
  }

  const getNotificationRoute = (type: Notification['type']) => {
    switch (type) {
      case 'idea_liked':
      case 'idea_commented':
      case 'comment_replied':
        return '/connect/ideas'
      case 'cofounder_request_received':
      case 'cofounder_request_accepted':
        return '/connect/cofounder-match'
      case 'new_message':
        return '/connect/messages'
      default:
        return '/connect'
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    const route = getNotificationRoute(notification.type)
    
    // Mark notification as read
    try {
      await fetch(`/connect/notifications/api/notifications/${notification.id}`, {
        method: 'PATCH'
      })
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      ))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
    
    // Navigate and close dropdown
    router.push(route)
    setOpen(false)
  }

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp.endsWith('Z') ? timestamp : timestamp + 'Z')
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/connect/notifications/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(Array.isArray(data.notifications) ? data.notifications : [])
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/connect/notifications/api/notifications', {
        method: 'PATCH'
      })
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const clearAllNotifications = async () => {
    console.log('🔔 Clear All notifications clicked')
    
    try {
      console.log('🔔 Making API call to mark all as read...')
      const response = await fetch('/connect/notifications/api/notifications', {
        method: 'PATCH'
      })
      
      console.log('🔔 API response status:', response.status)
      console.log('🔔 API response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('🔔 API call failed:', response.status, errorText)
        throw new Error(`API call failed: ${response.status} ${errorText}`)
      }
      
      const data = await response.json()
      console.log('🔔 API response data:', data)
      
      console.log('🔔 Updating local state - marking all as read')
      setNotifications(prev => {
        console.log('🔔 Previous notifications count:', prev.length)
        const updated = prev.map(n => ({ ...n, read: true }))
        console.log('🔔 Updated notifications count:', updated.length)
        return updated
      })
      
      console.log('🔔 Clear All completed successfully')
    } catch (error) {
      console.error('🔔 Failed to clear all notifications:', error)
      alert('Failed to clear notifications. Please try again.')
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    if (open) {
      markAllAsRead()
    }
  }, [open])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    padding: '8px',
    zIndex: 200,
    minWidth: '320px',
    maxHeight: '480px',
    overflowY: 'auto',
    transformOrigin: 'top right',
    transition: 'opacity .16s ease, transform .16s ease',
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(.98)',
    pointerEvents: open ? 'auto' : 'none',
  }

  const notificationRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    borderBottom: '1px solid var(--border)',
  }

  const unreadRowStyle: React.CSSProperties = {
    ...notificationRowStyle,
    borderLeft: '3px solid var(--green)',
    background: 'var(--background)',
  }

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: 'var(--green)',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '16px',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <div style={dropdownStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-display)', fontSize: '14px' }}>
            Notifications
          </span>
          {Array.isArray(notifications) && notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text2)',
                fontSize: '12px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
              Clear all
            </button>
          )}
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text2)' }}>
              Loading...
            </div>
          ) : Array.isArray(notifications) && notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text2)' }}>
              No notifications in the last 24 hours
            </div>
          ) : (
            Array.isArray(notifications) ? notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  ...notification.read ? notificationRowStyle : unreadRowStyle,
                  cursor: 'pointer'
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <span style={{ fontSize: '16px' }}>{getNotificationIcon(notification.type)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', fontFamily: 'var(--font-display)', fontSize: '14px', marginBottom: '2px' }}>
                    {notification.title}
                  </div>
                  <div style={{ color: 'var(--text2)', fontSize: '12px', lineHeight: '1.3' }}>
                    {notification.body}
                  </div>
                </div>
                <div style={{ color: 'var(--text2)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {getTimeAgo(notification.created_at)}
                </div>
              </div>
            )) : null
          )}
        </div>
      </div>
    </div>
  )
}
