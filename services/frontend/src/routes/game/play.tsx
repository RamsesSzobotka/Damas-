import { createFileRoute } from '@tanstack/react-router'
import GameContainer from '@/components/Game/GameContainer'

export interface PlaySearch {
  difficulty?: string
}

export const Route = createFileRoute('/game/play')({
  validateSearch: (search: Record<string, string>): PlaySearch => ({
    difficulty: search.difficulty || 'principiante',
  }),
  component: PlayPage,
})

function PlayPage() {
  const { difficulty } = Route.useSearch()
  return <GameContainer difficulty={difficulty ?? 'principiante'} />
}
