/**
 * User Service
 *
 * Gestiona la creación y sincronización de usuarios.
 * Soporta dos flujos:
 *   1. Clerk (SSO): usuarios creados via Clerk, sincronizados a MongoDB
 *   2. Email+Password: usuarios registrados con email y contraseña cifrada
 */

import { getDatabase } from '@/database/Database'
import { USER_COLLECTION } from '@/models/User'
import type { User, AuthProvider } from '@/models/User'
import { ObjectId } from 'mongodb'

// ─── Tipos ─────────────────────────────────────────────────────────

export interface SyncUserInput {
  clerkId: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
}

export interface RegisterInput {
  email: string
  username: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

// ─── Password hashing con Bun ──────────────────────────────────────

const PEPPER = process.env.SALT_PASSWORD || ''

/**
 * Hashea una contraseña con bcrypt (Bun nativo) + pepper global.
 * El pepper (SALT_PASSWORD de .env) se antepone como capa extra de seguridad.
 */
export async function hashPassword(password: string): Promise<string> {
  const pepperedPassword = PEPPER + password
  return Bun.password.hash(pepperedPassword, {
    algorithm: 'bcrypt',
    cost: 10,
  })
}

/**
 * Verifica una contraseña contra su hash almacenado.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const pepperedPassword = PEPPER + password
  return Bun.password.verify(pepperedPassword, hash)
}

// ─── Clerk user sync (flujo existente) ─────────────────────────────

/**
 * Busca un usuario por clerkId o lo crea si no existe.
 * Usa upsert atómico para evitar race conditions.
 * También actualiza campos básicos (email, username, avatar) si cambiaron en Clerk.
 */
export async function findOrCreateUser(input: SyncUserInput): Promise<User> {
  const collection = getDatabase().getCollection(USER_COLLECTION)

  const $set: Record<string, unknown> = {
    email: input.email,
    username: input.username,
    updatedAt: new Date(),
    lastLoginAt: new Date(),
  }
  if (input.firstName) $set.firstName = input.firstName
  if (input.lastName) $set.lastName = input.lastName
  if (input.avatar) $set.avatar = input.avatar

  const result = await collection.findOneAndUpdate(
    { clerkId: input.clerkId },
    {
      $set,
      $setOnInsert: {
        _id: new ObjectId(),
        clerkId: input.clerkId,
        authProvider: 'clerk',
        stats: {
          totalVictories: 0,
          totalDefeats: 0,
          totalDraws: 0,
          totalGames: 0,
          totalPoints: 0,
          winRate: 0,
          averageMovements: 0,
          bestStreak: 0,
          currentStreak: 0,
        },
        inventory: [],
        createdAt: new Date(),
        isActive: true,
      },
    },
    { upsert: true, returnDocument: 'after' },
  )

  if (!result) {
    throw new Error('Error al crear/actualizar usuario')
  }

  const wasCreated = result.lastLoginAt?.getTime() === result.createdAt?.getTime()
  if (wasCreated) {
    console.log(`👤 Nuevo usuario Clerk creado: ${input.email} (${input.clerkId})`)
  }

  return result as User
}

// ─── Email + Password registration ─────────────────────────────────

/**
 * Registra un nuevo usuario con email y contraseña.
 *
 * 1. Verifica que el email no esté ya registrado
 * 2. Crea el usuario en Clerk via Backend API
 * 3. Hashea la contraseña con bcrypt + pepper
 * 4. Guarda el hash en MongoDB
 *
 * @throws {Error} Si el email ya existe o hay error en Clerk
 */
export async function registerWithEmail(input: RegisterInput): Promise<{
  user: User
  clerkId: string
}> {
  const collection = getDatabase().getCollection(USER_COLLECTION)

  // Verificar si el email ya existe
  const existing = await collection.findOne({ email: input.email })
  if (existing) {
    // Caso especial: cuenta creada via SSO sin contraseña
    if (existing.authProvider === 'clerk' && !existing.passwordHash) {
      throw new Error('ACCOUNT_EXISTS_SSO')
    }
    // Cuenta ya registrada con email
    throw new Error('EMAIL_ALREADY_REGISTERED')
  }

  // 1. Crear usuario en Clerk
  let clerkUser
  try {
    const { createClerkClient } = await import('@clerk/backend')
    const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY || '' })
    clerkUser = await client.users.createUser({
      emailAddress: [input.email],
      username: input.username,
      password: input.password,
      skipPasswordChecks: true,
      skipPasswordRequirement: false,
    })
  } catch (clerkError: any) {
    console.error('Error creando usuario en Clerk:', clerkError)
    // Si Clerk falla, no crear el usuario local
    throw new Error('Error al crear cuenta en Clerk: ' + (clerkError.message || 'Error desconocido'))
  }

  // 2. Hashear contraseña
  const passwordHash = await hashPassword(input.password)

  // 3. Guardar en MongoDB
  const newUser: User = {
    _id: new ObjectId(),
    clerkId: clerkUser.id,
    email: input.email,
    username: input.username,
    authProvider: 'email',
    passwordHash,
    stats: {
      totalVictories: 0,
      totalDefeats: 0,
      totalDraws: 0,
      totalGames: 0,
      totalPoints: 0,
      winRate: 0,
      averageMovements: 0,
      bestStreak: 0,
      currentStreak: 0,
    },
    inventory: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    isActive: true,
  }

  await collection.insertOne(newUser)
  console.log(`👤 Nuevo usuario email creado: ${input.email} (${clerkUser.id})`)

  return { user: newUser, clerkId: clerkUser.id }
}

// ─── Email + Password login ────────────────────────────────────────

/**
 * Inicia sesión con email y contraseña.
 *
 * 1. Busca el usuario por email
 * 2. Verifica que tenga passwordHash (no sea solo SSO)
 * 3. Verifica la contraseña con bcrypt + pepper
 *
 * @throws {Error} Si el email no existe, la cuenta es solo SSO, o la contraseña es incorrecta
 */
export async function loginWithEmail(input: LoginInput): Promise<User> {
  const collection = getDatabase().getCollection(USER_COLLECTION)
  const user = await collection.findOne({ email: input.email }) as User | null

  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }

  // Cuenta creada solo con SSO, no tiene contraseña
  if (!user.passwordHash) {
    throw new Error('ACCOUNT_SSO_ONLY')
  }

  // Verificar contraseña
  const valid = await verifyPassword(input.password, user.passwordHash)
  if (!valid) {
    throw new Error('INVALID_PASSWORD')
  }

  // Actualizar último login
  await collection.updateOne(
    { _id: user._id },
    { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
  )

  console.log(`🔑 Login exitoso: ${input.email}`)
  return user
}

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Genera un JWT simple para sesiones de email+password.
 * Usa criptografía nativa de Bun para firmar.
 */
export async function generateToken(userId: string, clerkId: string): Promise<string> {
  const jwtSecret = process.env.JWT_SECRET || 'damas-dev-secret'
  const payload = {
    sub: userId,
    clerkId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 días
  }

  // Codificar header y payload en base64url
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payloadB64 = btoa(JSON.stringify(payload))

  // Firmar con HMAC-SHA256 usando Web Crypto API de Bun
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(jwtSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${header}.${payloadB64}`),
  )
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))

  return `${header}.${payloadB64}.${signatureB64}`
}

// ─── Query helpers ─────────────────────────────────────────────────

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const collection = getDatabase().getCollection(USER_COLLECTION)
  return (await collection.findOne({ clerkId })) as User | null
}

export async function getUserById(id: string): Promise<User | null> {
  const collection = getDatabase().getCollection(USER_COLLECTION)
  return (await collection.findOne({ _id: new ObjectId(id) })) as User | null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const collection = getDatabase().getCollection(USER_COLLECTION)
  return (await collection.findOne({ email })) as User | null
}
