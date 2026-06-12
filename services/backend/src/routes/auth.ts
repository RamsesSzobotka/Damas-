/**
 * Auth Routes
 *
 * Endpoints de autenticación:
 * - POST /api/auth/sync      → Sincronización con Clerk (flujo existente)
 * - POST /api/auth/register  → Registro con email + contraseña (nuevo)
 * - POST /api/auth/login     → Login con email + contraseña (nuevo)
 * - GET  /api/auth/me        → Obtener usuario actual por JWT (nuevo)
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { verifyToken } from '@clerk/backend'
import {
  findOrCreateUser,
  registerWithEmail,
  loginWithEmail,
  generateToken,
} from '@/services/userService'
import { initializeRanking } from '@/services/rankingService'

const authRoute = new Hono()

// ─── Esquemas de validación ────────────────────────────────────────

const syncSchema = z.object({
  clerkId: z.string().min(1, 'clerkId es requerido'),
  email: z.string().email('Email inválido'),
  username: z.string().min(1, 'username es requerido'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().optional(),
})

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'Username debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

// ─── POST /api/auth/sync — Clerk sync (existente) ─────────────────

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
      authProvider: user.authProvider,
      stats: user.stats,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error('Error en auth sync:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// ─── POST /api/auth/register — Email + Password ───────────────────

authRoute.post('/api/auth/register', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: 'Datos inválidos', details: parsed.error.issues }, 400)
    }

    const { email, username, password } = parsed.data

    // Intentar registrar
    const { user, clerkId } = await registerWithEmail({ email, username, password })

    // Inicializar ranking
    if (user._id) {
      await initializeRanking(user._id, user.username)
    }

    // Generar JWT
    const token = await generateToken(user._id!.toString(), clerkId)

    return c.json({
      id: user._id?.toString(),
      clerkId,
      email: user.email,
      username: user.username,
      authProvider: user.authProvider,
      token,
      stats: user.stats,
      createdAt: user.createdAt,
    })
  } catch (error: any) {
    console.error('Error en register:', error)

    // Mapear errores conocidos
    if (error.message === 'ACCOUNT_EXISTS_SSO') {
      return c.json({
        error: 'ACCOUNT_EXISTS_SSO',
        message: 'Esta cuenta ya existe y fue creada con Google/Microsoft. Inicia sesión con tu método original.',
      }, 409)
    }
    if (error.message === 'EMAIL_ALREADY_REGISTERED') {
      return c.json({
        error: 'EMAIL_ALREADY_REGISTERED',
        message: 'Este correo ya está registrado. Inicia sesión con tu contraseña.',
      }, 409)
    }
    if (error.message?.startsWith('Error al crear cuenta en Clerk')) {
      return c.json({ error: 'CLERK_ERROR', message: error.message }, 502)
    }

    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// ─── POST /api/auth/login — Email + Password ──────────────────────

authRoute.post('/api/auth/login', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: 'Datos inválidos', details: parsed.error.issues }, 400)
    }

    const { email, password } = parsed.data

    const user = await loginWithEmail({ email, password })

    // Generar JWT
    const token = await generateToken(user._id!.toString(), user.clerkId || '')

    return c.json({
      id: user._id?.toString(),
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
      authProvider: user.authProvider,
      token,
      stats: user.stats,
    })
  } catch (error: any) {
    console.error('Error en login:', error)

    if (error.message === 'USER_NOT_FOUND') {
      return c.json({ error: 'USER_NOT_FOUND', message: 'No existe una cuenta con este correo' }, 404)
    }
    if (error.message === 'ACCOUNT_SSO_ONLY') {
      return c.json({
        error: 'ACCOUNT_SSO_ONLY',
        message: 'Esta cuenta fue creada con Google/Microsoft. Inicia sesión con ese método.',
      }, 401)
    }
    if (error.message === 'INVALID_PASSWORD') {
      return c.json({ error: 'INVALID_PASSWORD', message: 'Contraseña incorrecta' }, 401)
    }

    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// ─── GET /api/auth/me — Obtener usuario por JWT ───────────────────

authRoute.get('/api/auth/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Token requerido' }, 401)
    }

    const token = authHeader.slice(7)
    const parts = token.split('.')

    if (parts.length !== 3) {
      return c.json({ error: 'Token inválido' }, 401)
    }

    // Verificar firma
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return c.json({ error: 'JWT_SECRET environment variable is required' }, 500)
    }
    const headerB64 = parts[0]
    const payloadB64 = parts[1]
    const signatureB64 = parts[2]

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0)),
      new TextEncoder().encode(`${headerB64}.${payloadB64}`),
    )

    if (!valid) {
      return c.json({ error: 'Token inválido' }, 401)
    }

    // Decodificar payload
    const payload = JSON.parse(atob(payloadB64))

    // Verificar expiración
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json({ error: 'Token expirado' }, 401)
    }

    // Buscar usuario
    const user = await (await import('@/services/userService')).getUserByClerkId(payload.clerkId)
    if (!user) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }

    return c.json({
      id: user._id?.toString(),
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
      authProvider: user.authProvider,
      stats: user.stats,
    })
  } catch (error) {
    console.error('Error en /me:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

export { authRoute }
