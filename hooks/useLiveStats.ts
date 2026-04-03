'use client'

import { useState, useEffect } from 'react'
import { LiveStats } from '@/utils/stats'

export function useLiveStats() {
  const [stats, setStats] = useState<LiveStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        console.log('Fetching stats from client...')
        const response = await fetch('/api/stats', {
          cache: 'no-store', // Disable caching
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`)
        }
        const data = await response.json()
        console.log('Client stats received:', data)
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Failed to fetch live stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
