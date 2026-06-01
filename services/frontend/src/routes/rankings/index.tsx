import { createFileRoute } from '@tanstack/react-router'
import RankingsContainer from '@/components/Rankings/RankingsContainer'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'

export const Route = createFileRoute('/rankings/')({
  component: RankingsPage,
})

function RankingsPage() {
  useBackgroundMusic(true)
  return <RankingsContainer />
}
