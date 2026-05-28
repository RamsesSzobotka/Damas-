/**
 * User Service
 *
 * Gestiona la creación y sincronización de usuarios con Clerk.
 * Cada usuario autenticado via Clerk se refleja en MongoDB con su clerkId.
 */

import { getDatabase } from '@/database/Database'
import { USER_COLLECTION } from '@/models/User'
import type { User } from '@/models/User'
import { ObjectId } from 'mongodb'

export interface SyncUserInput {
  clerkId: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
}

/**
 * Busca un usuario por clerkId o lo crea si no existe.
 * Usa upsert atómico para evitar race conditions (React Strict Mode, doble request).
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

  // `result` is null only if the operation failed
  if (!result) {
    throw new Error('Error al crear/actualizar usuario')
  }

  const wasCreated = result.lastLoginAt?.getTime() === result.createdAt?.getTime()
  if (wasCreated) {
    console.log(`👤 Nuevo usuario creado: ${input.email} (${input.clerkId})`)
  }

  return result as User
}

/**
 * Obtiene un usuario por su clerkId.
 */
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const collection = getDatabase().getCollection(USER_COLLECTION)
  return (await collection.findOne({ clerkId })) as User | null
}

/**
 * Obtiene un usuario por su ID de MongoDB.
 */
export async function getUserById(id: string): Promise<User | null> {
  const collection = getDatabase().getCollection(USER_COLLECTION)
  return (await collection.findOne({ _id: new ObjectId(id) })) as User | null
}
