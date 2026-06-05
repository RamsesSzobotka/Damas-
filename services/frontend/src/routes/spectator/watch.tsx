import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'
import GameContainer from '@/components/Game/GameContainer'
import { useGameStore } from '@/stores/gameStore'

export interface SpectatorWatchSearch {
  difficulty?: string
}

export const Route = createFileRoute('/spectator/watch')({
  validateSearch: (search: Record<string, string>): SpectatorWatchSearch => ({
    difficulty: search.difficulty || 'principiante',
  }),
  component: SpectatorWatchPage,
})

function SpectatorWatchPage() {
  const { difficulty } = Route.useSearch()
  useBackgroundMusic(true, 'main')
  const setMode = useGameStore((s) => s.setMode)

  useEffect(() => {
    setMode('spectator')
    return () => {
      setMode(null)
    }
  }, [setMode])

  return (
    <GameContainer
      difficulty={difficulty ?? 'principiante'}
      mode="spectator"
      routeMode="practice"
    />
  )
}
