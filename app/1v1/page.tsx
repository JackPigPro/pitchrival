'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'

// Mock data for recent battles
const mockRecentBattles = [
  {
    id: '1',
    player1: { username: 'alex', display_name: 'Alex Chen', avatar_url: null },
    player2: { username: 'sarah', display_name: 'Sarah Kim', avatar_url: null },
    game_mode: 'logo' as const,
    status: 'complete' as const,
    result: 'win' as const,
    elo_change: 25,
    created_at: '2025-04-23T10:30:00Z'
  },
  {
    id: '2',
    player1: { username: 'mike', display_name: 'Mike Johnson', avatar_url: null },
    player2: { username: 'emma', display_name: 'Emma Davis', avatar_url: null },
    game_mode: 'business_idea' as const,
    status: 'voting' as const,
    result: null,
    elo_change: null,
    created_at: '2025-04-23T09:15:00Z'
  },
  {
    id: '3',
    player1: { username: 'john', display_name: 'John Smith', avatar_url: null },
    player2: { username: 'lisa', display_name: 'Lisa Wang', avatar_url: null },
    game_mode: 'logo' as const,
    status: 'complete' as const,
    result: 'loss' as const,
    elo_change: -18,
    created_at: '2025-04-23T08:45:00Z'
  },
  {
    id: '4',
    player1: { username: 'david', display_name: 'David Lee', avatar_url: null },
    player2: { username: 'anna', display_name: 'Anna Brown', avatar_url: null },
    game_mode: 'business_idea' as const,
    status: 'complete' as const,
    result: 'win' as const,
    elo_change: 22,
    created_at: '2025-04-23T07:30:00Z'
  }
]

export default function OneVOnePage() {
  const { isAuthenticated, authLoading, elo, username, display_name } = useUser()
  const [selectedGameMode, setSelectedGameMode] = useState<'logo' | 'business_idea'>('logo')
  const [roomCode, setRoomCode] = useState('')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access 1v1 battles.</p>
          <Link href="/login?mode=login" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  // Calculate mock stats
  const totalMatches = mockRecentBattles.filter(battle => 
    battle.player1.username === username || battle.player2.username === username
  ).length
  const wins = mockRecentBattles.filter(battle => 
    (battle.player1.username === username || battle.player2.username === username) && 
    battle.result === 'win'
  ).length
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleCreateRoom = () => {
    const newCode = generateRoomCode()
    setIsCreatingRoom(true)
    // TODO: Implement actual room creation logic
    console.log('Creating room with code:', newCode)
  }

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      // TODO: Implement actual room joining logic
      console.log('Joining room with code:', roomCode)
    }
  }

  const handleJoinRankedQueue = () => {
    // TODO: Implement actual ranked queue logic
    console.log('Joining ranked queue for', selectedGameMode)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">1v1 Battles</h1>
          <p className="text-gray-600 text-lg">Face off against other entrepreneurs in intense head-to-head competitions</p>
        </div>

        {/* User Stats Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{display_name || username}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl font-bold text-green-600">{elo?.elo || 1200}</span>
                <span className="text-gray-500">ELO Rating</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-gray-50 rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold text-gray-900">{totalMatches}</div>
                <div className="text-sm text-gray-600">Matches</div>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold text-gray-900">{winRate}%</div>
                <div className="text-sm text-gray-600">Win Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Ranked Queue Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ranked Queue</h3>
            <p className="text-gray-600 mb-4">Join random matchmaking and test your skills against similar-ranked opponents</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estimated wait:</span>
                <span className="font-medium text-green-600">~2:30</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">ELO on the line:</span>
                <span className="font-medium">±25</span>
              </div>
              <button
                onClick={handleJoinRankedQueue}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Join Ranked Queue
              </button>
            </div>
          </div>

          {/* Private Room Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Private Room</h3>
            <p className="text-gray-600 mb-4">Create a private room or join with a code to play with friends</p>
            <div className="space-y-3">
              <button
                onClick={handleCreateRoom}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Create Room
              </button>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={6}
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={!roomCode.trim()}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Logo Design Mode */}
          <div
            className={`bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all ${
              selectedGameMode === 'logo' 
                ? 'border-green-500 ring-2 ring-green-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedGameMode('logo')}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎨</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Logo Design</h3>
                <p className="text-gray-600 mb-3">You'll get a brand brief. Upload your logo design.</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>📸</span>
                  <span>Image upload</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Idea Mode */}
          <div
            className={`bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all ${
              selectedGameMode === 'business_idea' 
                ? 'border-green-500 ring-2 ring-green-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedGameMode('business_idea')}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Business Idea</h3>
                <p className="text-gray-600 mb-3">You'll get a market prompt. Pitch your business concept.</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>✍️</span>
                  <span>Text entry</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Battles Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Battles</h3>
          <div className="space-y-3">
            {mockRecentBattles.map((battle) => {
              const isUserPlayer1 = battle.player1.username === username
              const opponent = isUserPlayer1 ? battle.player2 : battle.player1
              const userResult = battle.result
              const userEloChange = battle.elo_change

              return (
                <div key={battle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    {/* Player avatars */}
                    <div className="flex items-center -space-x-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                        {battle.player1.display_name.charAt(0)}
                      </div>
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        {battle.player2.display_name.charAt(0)}
                      </div>
                    </div>
                    
                    {/* Battle info */}
                    <div>
                      <div className="font-medium text-gray-900">
                        {battle.player1.display_name} vs {battle.player2.display_name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="capitalize">{battle.game_mode.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{new Date(battle.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Result or Vote button */}
                    {battle.status === 'voting' ? (
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                        Vote
                      </button>
                    ) : battle.status === 'complete' && userResult ? (
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${userResult === 'win' ? 'text-green-600' : 'text-red-600'}`}>
                          {userResult === 'win' ? 'W' : 'L'}
                        </span>
                        <span className={`text-sm font-medium ${userEloChange && userEloChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {userEloChange && userEloChange > 0 ? '+' : ''}{userEloChange}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
