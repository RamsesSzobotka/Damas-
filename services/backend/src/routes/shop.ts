import { Hono } from 'hono'
import { verifyToken } from '@clerk/backend'
import { getDatabase } from '@/database/Database'
import { SKIN_COLLECTION } from '@/models/Skin'
import { USER_COLLECTION } from '@/models/User'

const shopRoute = new Hono()

shopRoute.get('/api/shop/skins', async (c) => {
  try {
    const skins = getDatabase().getCollection(SKIN_COLLECTION)
    const result = await skins
      .find({ isActive: true })
      .sort({ price: 1 })
      .toArray()

    const mapped = result.map((skin) => ({
      _id: skin._id.toString(),
      name: skin.name,
      description: skin.description,
      type: skin.type,
      rarity: skin.rarity,
      price: skin.price,
      currency: skin.currency,
      imageUrl: skin.imageUrl,
      primaryColor: skin.primaryColor,
      secondaryColor: skin.secondaryColor,
    }))

    return c.json(mapped)
  } catch (error) {
    console.error('Error fetching skins:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

/**
 * GET /api/shop/user-skins
 * Devuelve los IDs de las skins que el usuario ya posee.
 * Requiere token de Clerk en Authorization header.
 */
shopRoute.get('/api/shop/user-skins', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Token requerido' }, 401)
    }

    const sessionToken = authHeader.slice(7)
    let clerkId: string
    try {
      const payload = await verifyToken(sessionToken, {
        secretKey: process.env.CLERK_SECRET_KEY || '',
      })
      clerkId = payload.sub
    } catch {
      return c.json({ error: 'Token inválido' }, 401)
    }

    const users = getDatabase().getCollection(USER_COLLECTION)
    const user = await users.findOne({ clerkId })

    if (!user || !user.inventory) {
      return c.json({ skinIds: [] })
    }

    const skinIds = user.inventory.map((id: any) => id.toString())

    return c.json({ skinIds })
  } catch (error) {
    console.error('Error fetching user skins:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

export { shopRoute }
