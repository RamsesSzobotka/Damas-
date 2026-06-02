import { Hono } from 'hono'
import { verifyToken } from '@clerk/backend'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/database/Database'
import { SKIN_COLLECTION } from '@/models/Skin'
import { USER_COLLECTION } from '@/models/User'
import { USER_SKIN_COLLECTION } from '@/models/UserSkin'

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
      theme: skin.theme || null,
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

/**
 * GET /api/shop/owned-skins
 * Devuelve las skins que el usuario posee con todos sus detalles.
 * Requiere token de Clerk.
 */
shopRoute.get('/api/shop/owned-skins', async (c) => {
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
    if (!user) return c.json({ ownedSkins: [] })

    const userSkinsCol = getDatabase().getCollection(USER_SKIN_COLLECTION)
    const userSkins = await userSkinsCol.find({ userId: user._id }).toArray()

    if (userSkins.length === 0) return c.json({ ownedSkins: [] })

    const skinIds = userSkins.map(us => us.skinId)
    const skinsCol = getDatabase().getCollection(SKIN_COLLECTION)
    const skins = await skinsCol.find({ _id: { $in: skinIds } }).toArray()

    const skinMap = new Map(skins.map(s => [s._id.toString(), s]))
    const equippedPiece = userSkins.find(us => us.isEquipped && (us.equipType === 'piece' || !us.equipType))
    const equippedBoard = userSkins.find(us => us.isEquipped && us.equipType === 'board')

    const ownedSkins = userSkins.map(us => {
      const skin = skinMap.get(us.skinId.toString())
      return {
        skinId: us.skinId.toString(),
        isEquipped: us.isEquipped,
        equipType: us.equipType || null,
        name: skin?.name || '',
        type: skin?.type || 'piece',
        rarity: skin?.rarity || 'common',
        price: skin?.price || 0,
        primaryColor: skin?.primaryColor || null,
        secondaryColor: skin?.secondaryColor || null,
        imageUrl: skin?.imageUrl || null,
        theme: skin?.theme || null,
      }
    })

    return c.json({
      ownedSkins,
      equippedPieceId: equippedPiece?.skinId.toString() || null,
      equippedBoardId: equippedBoard?.skinId.toString() || null,
    })
  } catch (error) {
    console.error('Error fetching owned skins:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

/**
 * POST /api/shop/equip
 * Establece una skin como equipada (desmarca las demás del mismo tipo).
 * Body: { skinId: string, equipType?: 'piece' | 'board' }
 * Legacy: equipType = null se trata como 'piece'.
 */
shopRoute.post('/api/shop/equip', async (c) => {
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

    const { skinId, equipType } = await c.req.json()
    if (!skinId) {
      return c.json({ error: 'skinId requerido' }, 400)
    }

    const type = equipType || 'piece'

    const users = getDatabase().getCollection(USER_COLLECTION)
    const user = await users.findOne({ clerkId })
    if (!user) return c.json({ error: 'Usuario no encontrado' }, 404)

    const userSkinsCol = getDatabase().getCollection(USER_SKIN_COLLECTION)

    // Desmarcar solo del mismo tipo (legacy: sin equipType se trata como 'piece')
    if (type === 'piece') {
      await userSkinsCol.updateMany(
        {
          userId: user._id,
          isEquipped: true,
          $or: [
            { equipType: 'piece' },
            { equipType: { $exists: false } },
            { equipType: null },
          ],
        },
        { $set: { isEquipped: false, updatedAt: new Date() } }
      )
    } else {
      await userSkinsCol.updateMany(
        { userId: user._id, isEquipped: true, equipType: 'board' },
        { $set: { isEquipped: false, updatedAt: new Date() } }
      )
    }

    // Marcar la skin seleccionada como equipada
    const result = await userSkinsCol.updateOne(
      { userId: user._id, skinId: new ObjectId(skinId) },
      { $set: { isEquipped: true, equipType: type, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return c.json({ error: 'No tienes esa skin' }, 404)
    }

    return c.json({ success: true, equippedId: skinId, equipType: type })
  } catch (error) {
    console.error('Error equipping skin:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

/**
 * POST /api/shop/unequip
 * Des-equipa la skin activa del tipo especificado, volviendo al diseño predeterminado.
 * Body: { equipType?: 'piece' | 'board' }
 */
shopRoute.post('/api/shop/unequip', async (c) => {
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

    const { equipType } = await c.req.json()
    const type = equipType || 'piece'

    const users = getDatabase().getCollection(USER_COLLECTION)
    const user = await users.findOne({ clerkId })
    if (!user || !user._id) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }

    const userSkinsCol = getDatabase().getCollection(USER_SKIN_COLLECTION)

    if (type === 'piece') {
      await userSkinsCol.updateMany(
        {
          userId: user._id,
          isEquipped: true,
          $or: [
            { equipType: 'piece' },
            { equipType: { $exists: false } },
            { equipType: null },
          ],
        },
        { $set: { isEquipped: false, updatedAt: new Date() } }
      )
    } else {
      await userSkinsCol.updateMany(
        { userId: user._id, isEquipped: true, equipType: 'board' },
        { $set: { isEquipped: false, updatedAt: new Date() } }
      )
    }

    return c.json({ success: true, message: `Skin de tipo "${type}" removida. Usando diseño predeterminado.` })
  } catch (error) {
    console.error('Error unequipping skin:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

export { shopRoute }
