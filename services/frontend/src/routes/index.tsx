import { createFileRoute } from '@tanstack/react-router'
import MainMenu from '@/components/Menu/MainMenu'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <MainMenu />
}
