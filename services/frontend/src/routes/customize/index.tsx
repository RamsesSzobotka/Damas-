import { createFileRoute } from '@tanstack/react-router'
import CustomizeContainer from '@/components/Customize/CustomizeContainer'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'

export const Route = createFileRoute('/customize/')({
  component: CustomizePage,
})

function CustomizePage() {
  useBackgroundMusic(true)
  return <CustomizeContainer />
}
