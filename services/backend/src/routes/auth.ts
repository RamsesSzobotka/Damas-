/**
 * Auth Routes
 *
 * Endpoints para sincronización de usuarios con Clerk.
 * - POST /api/auth/sync  → Recibe datos de Clerk y crea/actualiza usuario en MongoDB
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { verifyToken } from '@clerk/backend'
import { findOrCreateUser } from '@/services/userService'
import { initializeRanking } from '@/services/rankingService'

const authRoute = new Hono()

const syncSchema = z.object({
  clerkId: z.string().min(1, 'clerkId es requerido'),
  email: z.string().email('Email inválido'),
  username: z.string().min(1, 'username es requerido'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().optional(),
})

/**
 * POST /api/auth/sync
 * Sincroniza los datos del usuario autenticado con Clerk.
 * El cliente envía el session token de Clerk en el header Authorization.
 * Si el usuario no existe en MongoDB, se crea automáticamente.
 */
authRoute.post('/api/auth/sync', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Token de autorización requerido' }, 401)
    }

    const sessionToken = authHeader.slice(7)

    // Verificar el token de sesión de Clerk
    try {
      await verifyToken(sessionToken, {
        secretKey: process.env.CLERK_SECRET_KEY || '',
      })
    } catch {
      return c.json({ error: 'Token de sesión inválido o expirado' }, 401)
    }

    const body = await c.req.json()
    const parsed = syncSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: 'Datos inválidos', details: parsed.error.issues }, 400)
    }

    const user = await findOrCreateUser(parsed.data)

    // Inicializar ranking si es un usuario nuevo
    if (user._id) {
      await initializeRanking(user._id, user.username)
    }

    return c.json({
      id: user._id?.toString(),
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
      stats: user.stats,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error('Error en auth sync:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

export { authRoute }
