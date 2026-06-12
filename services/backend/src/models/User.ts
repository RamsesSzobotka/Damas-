import { z } from 'zod'
import { ObjectId } from 'mongodb'

/**
 * User Model
 * Almacena información de usuarios autenticados
 */

export const UserStatsSchema = z.object({
  totalVictories: z.number().default(0),
  totalDefeats: z.number().default(0),
  totalDraws: z.number().default(0),
  totalGames: z.number().default(0),
  totalPoints: z.number().default(0),
  winRate: z.number().default(0),
  averageMovements: z.number().default(0),
  bestStreak: z.number().default(0),
  currentStreak: z.number().default(0),
})

export const AuthProvider = z.enum(['clerk', 'email', 'both'])
export type AuthProvider = z.infer<typeof AuthProvider>

export const UserSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  clerkId: z.string().optional(),
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'Username debe tener al menos 3 caracteres'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().url('Avatar debe ser una URL válida').optional(),
  authProvider: AuthProvider.default('clerk'),
  passwordHash: z.string().optional(),
  stats: UserStatsSchema,
  inventory: z.array(z.instanceof(ObjectId)).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  lastLoginAt: z.date().optional(),
  isActive: z.boolean().default(true),
})

export type User = z.infer<typeof UserSchema>
export type UserStats = z.infer<typeof UserStatsSchema>

export const USER_COLLECTION = 'users'

// Índices para colección users
export const USER_INDEXES = [
  { key: { clerkId: 1 }, unique: true },
  { key: { email: 1 }, unique: true },
  { key: { username: 1 }, unique: true },
  { key: { 'stats.totalPoints': -1 } },
  { key: { createdAt: -1 } },
  { key: { isActive: 1 } },
]
