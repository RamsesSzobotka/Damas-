import { createFileRoute } from '@tanstack/react-router'
import GameContainer from '@/components/Game/GameContainer'

export interface PlaySearch {
  difficulty?: string
  mode?: 'ranked' | 'practice'
}

export const Route = createFileRoute('/game/play')({
  validateSearch: (search: Record<string, string>): PlaySearch => ({
    difficulty: search.difficulty || 'principiante',
    mode: (search.mode as 'ranked' | 'practice') || 'practice',
  }),
  component: PlayPage,
})

function PlayPage() {
  const { difficulty, mode } = Route.useSearch()
  return <GameContainer difficulty={difficulty ?? 'principiante'} routeMode={mode ?? 'practice'} />
}
