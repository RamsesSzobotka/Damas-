import { createFileRoute } from '@tanstack/react-router'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'
import GameContainer from '@/components/Game/GameContainer'

export interface PlaySearch {
  difficulty?: string
  mode?: 'ranked' | 'practice' | 'spectator'
}

export const Route = createFileRoute('/game/play')({
  validateSearch: (search: Record<string, string>): PlaySearch => {
    const rawMode = search.mode
    const allowedModes: Array<'ranked' | 'practice' | 'spectator'> = ['ranked', 'practice', 'spectator']
    const mode = (allowedModes.includes(rawMode as 'ranked' | 'practice' | 'spectator')
      ? (rawMode as 'ranked' | 'practice' | 'spectator')
      : 'practice')
    return {
      difficulty: search.difficulty || 'principiante',
      mode,
    }
  },
  component: PlayPage,
})

function PlayPage() {
  const { difficulty, mode } = Route.useSearch()
  useBackgroundMusic(true, 'boss')
  return (
    <GameContainer
      difficulty={difficulty ?? 'principiante'}
      routeMode={(mode === 'spectator' ? 'practice' : mode) ?? 'practice'}
    />
  )
}
