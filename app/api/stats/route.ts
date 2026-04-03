import { NextResponse } from 'next/server'
import { getLiveStats } from '@/utils/stats'

export async function GET() {
  try {
    console.log('Fetching live stats...')
    const stats = await getLiveStats()
    console.log('Stats fetched:', stats)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching live stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
