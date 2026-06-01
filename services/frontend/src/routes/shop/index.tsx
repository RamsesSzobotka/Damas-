import { createFileRoute } from '@tanstack/react-router'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'
import ShopContainer from '@/components/Shop/ShopContainer'

export const Route = createFileRoute('/shop/')({
  component: ShopPage,
})

function ShopPage() {
  useBackgroundMusic(true, 'shop')
  return <ShopContainer />
}
