import { z } from 'zod'
import { ObjectId } from 'mongodb'

/**
 * Ranking Model
 * Tabla de rankings actualizada en tiempo real
 */

export const RankingSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: z.instanceof(ObjectId).unique('userId must be unique'), // Referencia única a User
  username: z.string(),
  totalPoints: z.number().default(0),
  rank: z.number().optional(), // Posición en el ranking
  
  // Estadísticas de ranking
  victories: z.number().default(0),
  totalGames: z.number().default(0),
  winRate: z.number().default(0),
  averageMovements: z.number().default(0),
  
  // Por dificultad
  victoriesByDifficulty: z.object({
    beginner: z.number().default(0),
    intermediate: z.number().default(0),
    master: z.number().default(0),
    ultra: z.number().default(0),
  }),
  
  // Streaks
  bestStreak: z.number().default(0),
  currentStreak: z.number().default(0),
  
  // Tiempos
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  lastGameAt: z.date().optional(),
})

export type Ranking = z.infer<typeof RankingSchema>

export const RANKING_COLLECTION = 'rankings'

// Índices para colección rankings
export const RANKING_INDEXES = [
  { key: { userId: 1 }, unique: true },
  { key: { totalPoints: -1 } },
  { key: { rank: 1 } },
  { key: { updatedAt: -1 } },
  { key: { winRate: -1 } },
]
