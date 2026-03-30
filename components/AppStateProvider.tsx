'use client'

import { createContext, useContext, useMemo, useState, useEffect } from 'react'

type AppStateContextType = {
  duelDraft: string
  forumDraft: string
  theme: 'light' | 'dark'
  brightness: number
  setDuelDraft: (value: string) => void
  setForumDraft: (value: string) => void
  setTheme: (value: 'light' | 'dark') => void
  setBrightness: (value: number) => void
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [duelDraft, setDuelDraft] = useState('')
  const [forumDraft, setForumDraft] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [brightness, setBrightness] = useState(100)

  useEffect(() => {
    document.body.dataset.theme = theme
    document.body.style.setProperty('--ui-brightness', `${brightness}%`)
  }, [theme, brightness])

  const value = useMemo(
    () => ({ duelDraft, forumDraft, theme, brightness, setDuelDraft, setForumDraft, setTheme, setBrightness }),
    [duelDraft, forumDraft, theme, brightness]
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider')
  }
  return context
}
