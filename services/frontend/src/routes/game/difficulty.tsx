import { createFileRoute } from '@tanstack/react-router'
import DifficultySelect from '@/components/Game/DifficultySelect'

export const Route = createFileRoute('/game/difficulty')({
  component: DifficultyPage,
})

function DifficultyPage() {
  return <DifficultySelect />
}
