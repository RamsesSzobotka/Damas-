import { createFileRoute } from '@tanstack/react-router'
import DifficultySelect from '@/components/Game/DifficultySelect'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'

export const Route = createFileRoute('/game/difficulty')({
  component: DifficultyPage,
})

function DifficultyPage() {
  useBackgroundMusic(true)
  return <DifficultySelect />
}
