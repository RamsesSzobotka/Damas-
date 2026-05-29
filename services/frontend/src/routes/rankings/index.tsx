import { createFileRoute } from '@tanstack/react-router'
import RankingsContainer from '@/components/Rankings/RankingsContainer'

export const Route = createFileRoute('/rankings/')({
  component: RankingsPage,
})

function RankingsPage() {
  return <RankingsContainer />
}
