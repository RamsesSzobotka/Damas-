import { createFileRoute } from '@tanstack/react-router'
import ShopContainer from '@/components/Shop/ShopContainer'

export const Route = createFileRoute('/shop/')({
  component: ShopPage,
})

function ShopPage() {
  return <ShopContainer />
}
