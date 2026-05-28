import { Hono } from 'hono'
import { z } from 'zod'
import { verifyToken } from '@clerk/backend'
import { ObjectId } from 'mongodb'
import Stripe from 'stripe'
import { getDatabase } from '@/database/Database'
import { SKIN_COLLECTION } from '@/models/Skin'
import { USER_COLLECTION } from '@/models/User'
import { PURCHASE_COLLECTION } from '@/models/Purchase'
import { USER_SKIN_COLLECTION } from '@/models/UserSkin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

const paymentRoute = new Hono()

const createCheckoutSchema = z.object({
  skinId: z.string().min(1, 'skinId es requerido'),
})

const confirmSchema = z.object({
  sessionId: z.string().min(1, 'sessionId es requerido'),
})

async function verifyAuth(c: any) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: c.json({ error: 'Token de autorización requerido' }, 401), clerkId: null as string | null }
  }

  const sessionToken = authHeader.slice(7)
  try {
    const payload = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY || '',
    })
    return { error: null, clerkId: payload.sub }
  } catch {
    return { error: c.json({ error: 'Token de sesión inválido o expirado' }, 401), clerkId: null }
  }
}

paymentRoute.post('/api/payment/create-checkout-session', async (c) => {
  try {
    const auth = await verifyAuth(c)
    if (auth.error) return auth.error

    const body = await c.req.json()
    const parsed = createCheckoutSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Datos inválidos', details: parsed.error.issues }, 400)
    }

    const { skinId } = parsed.data

    const users = getDatabase().getCollection(USER_COLLECTION)
    const user = await users.findOne({ clerkId: auth.clerkId! })
    if (!user || !user._id) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }

    const skins = getDatabase().getCollection(SKIN_COLLECTION)
    const skin = await skins.findOne({ _id: new ObjectId(skinId) })
    if (!skin) {
      return c.json({ error: 'Skin no encontrada' }, 404)
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: skin.name },
            unit_amount: skin.price,
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/shop?success=true&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/shop?canceled=true',
      metadata: {
        skinId: skin._id.toString(),
        clerkId: user.clerkId,
      },
    })

    return c.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

paymentRoute.post('/api/payment/confirm', async (c) => {
  try {
    const auth = await verifyAuth(c)
    if (auth.error) return auth.error

    const body = await c.req.json()
    const parsed = confirmSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Datos inválidos', details: parsed.error.issues }, 400)
    }

    const { sessionId } = parsed.data

    const users = getDatabase().getCollection(USER_COLLECTION)
    const user = await users.findOne({ clerkId: auth.clerkId! })
    if (!user || !user._id) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return c.json({ error: 'El pago no ha sido completado' }, 400)
    }

    const skinId = session.metadata?.skinId
    if (!skinId) {
      return c.json({ error: 'Metadatos de sesión inválidos' }, 400)
    }

    const skins = getDatabase().getCollection(SKIN_COLLECTION)
    const skin = await skins.findOne({ _id: new ObjectId(skinId) })
    if (!skin) {
      return c.json({ error: 'Skin no encontrada' }, 404)
    }

    const purchases = getDatabase().getCollection(PURCHASE_COLLECTION)
    const userSkins = getDatabase().getCollection(USER_SKIN_COLLECTION)

    const purchaseDoc = {
      userId: user._id,
      skinId: new ObjectId(skinId),
      stripePaymentId: session.id,
      stripeCustomerId: session.customer?.toString(),
      amount: skin.price,
      currency: 'USD' as const,
      status: 'completed' as const,
      skinName: skin.name,
      skinType: skin.type,
      skinRarity: skin.rarity,
      purchasedAt: new Date(),
      createdAt: new Date(),
    }
    const purchaseResult = await purchases.insertOne(purchaseDoc)
    const purchaseId = purchaseResult.insertedId

    const userSkinDoc = {
      userId: user._id,
      skinId: new ObjectId(skinId),
      isEquipped: false,
      purchaseId,
      acquiredAt: new Date(),
      timesUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await userSkins.insertOne(userSkinDoc)

    await users.updateOne(
      { _id: user._id },
      { $push: { inventory: new ObjectId(skinId) } } as any
    )

    await skins.updateOne(
      { _id: new ObjectId(skinId) },
      { $inc: { soldCount: 1 } }
    )

    return c.json({
      success: true,
      purchase: {
        _id: purchaseId.toString(),
        skinId,
        skinName: skin.name,
        amount: skin.price,
        currency: 'USD',
        status: 'completed',
        purchasedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Error confirming payment:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

export { paymentRoute }
