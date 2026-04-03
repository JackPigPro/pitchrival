'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import IdeasFeed from './IdeasFeed'
import CreateIdeaForm from './CreateIdeaForm'
import IdeaModal from './IdeaModal'
import { IdeaWithDetails } from '@/types/database'
import { useUser } from '@/hooks/useUser'

export default function IdeasPageClient() {
  const { user, authLoading } = useUser()
  const [ideas, setIdeas] = useState<IdeaWithDetails[]>([])
  const [selectedIdea, setSelectedIdea] = useState<IdeaWithDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'public' | 'my'>('public')
  const supabase = createClient()


  // Load cached ideas on mount for instant display
  useEffect(() => {
    const cacheKey = `ideas_${activeTab}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        // Use cache if less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setIdeas(data)
        }
      } catch (err) {
        console.error('Error parsing cached ideas:', err)
      }
    }
  }, [activeTab])

  useEffect(() => {
    if (user) {
      fetchIdeas()
    }
  }, [user, activeTab])

  const fetchIdeas = async (sort = 'latest') => {
    try {
      setError(null)
      // Remove setIdeasLoaded(false) - no blocking loading
      
      const tabParam = activeTab === 'my' ? '&myIdeas=true' : ''
      const response = await fetch(`/connect/ideas/api/ideas?sort=${sort}&userId=${user?.id}${tabParam}`)
      if (!response.ok) {
        throw new Error('Failed to fetch ideas')
      }
      
      const { data } = await response.json()
      const ideasData = data || []
      setIdeas(ideasData)
      
      // Cache the results for instant display on return
      const cacheKey = `ideas_${activeTab}`
      localStorage.setItem(cacheKey, JSON.stringify({
        data: ideasData,
        timestamp: Date.now()
      }))
      
      // Remove setIdeasLoaded(true) - no blocking loading
    } catch (err) {
      console.error('Error fetching ideas:', err)
      setError('Failed to load ideas')
      // Remove setIdeasLoaded(true) - no blocking loading
    }
  }

  const handleCreateIdea = async (ideaData: { title: string; content: string; is_public: boolean }) => {
    try {
      const response = await fetch('/connect/ideas/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaData),
      })

      if (!response.ok) {
        throw new Error('Failed to create idea')
      }

      const { data } = await response.json()
      setIdeas(prev => [data, ...prev])
    } catch (err) {
      console.error('Error creating idea:', err)
      throw err
    }
  }

  const handleIdeaClick = (idea: IdeaWithDetails) => {
    setSelectedIdea(idea)
    setIsModalOpen(true)
  }

  const handleIdeaUpdate = (updatedIdea: IdeaWithDetails) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === updatedIdea.id ? updatedIdea : idea
    ))
    if (selectedIdea?.id === updatedIdea.id) {
      setSelectedIdea(updatedIdea)
    }
  }

  const handleIdeaDelete = (ideaId: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== ideaId))
    if (selectedIdea?.id === ideaId) {
      setIsModalOpen(false)
      setSelectedIdea(null)
    }
  }

  const handleTabChange = (tab: 'public' | 'my') => {
    setActiveTab(tab)
  }

  if (authLoading) {
    return null
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
          Please log in to view ideas
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
          You need to be signed in to see the idea feed and post your own ideas.
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

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
          Error
        </h2>
        <p style={{ color: 'var(--text2)' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
      {/* Left side - Ideas feed */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <IdeasFeed
          ideas={ideas}
          onIdeaClick={handleIdeaClick}
          onIdeaUpdate={handleIdeaUpdate}
          onIdeaDelete={handleIdeaDelete}
          onSortChange={fetchIdeas}
          currentUserId={user.id}
          ideasLoaded={ideas.length > 0}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Right side - Create idea form */}
      <div style={{ width: '380px', flexShrink: 0 }}>
        <CreateIdeaForm onSubmit={handleCreateIdea} />
      </div>

      {/* Modal */}
      {isModalOpen && selectedIdea && (
        <IdeaModal
          idea={selectedIdea}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleIdeaUpdate}
          onDelete={handleIdeaDelete}
          currentUserId={user.id}
        />
      )}
    </div>
  )
}
