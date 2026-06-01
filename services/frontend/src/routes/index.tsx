import { createFileRoute } from '@tanstack/react-router'
import MainMenu from '@/components/Menu/MainMenu'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  useBackgroundMusic(true)
  return <MainMenu />
}
