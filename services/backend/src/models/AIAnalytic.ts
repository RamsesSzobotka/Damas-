import { z } from 'zod'
import { ObjectId } from 'mongodb'

/**
 * AIAnalytic Model
 * Registro de análisis y movimientos de la IA
 * Usado para debugging, optimización y estadísticas
 */

export const AIAnalyticSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  gameId: z.instanceof(ObjectId), // Referencia a Game
  difficulty: z.enum(['beginner', 'intermediate', 'master', 'ultra']),
  
  // Movimiento analizado
  moveNumber: z.number().positive(),
  boardState: z.array(z.array(z.number())).length(8), // 8x8 board
  selectedMove: z.object({
    from: z.array(z.number()).length(2),
    to: z.array(z.number()).length(2),
  }),
  
  // Análisis del algoritmo
  evaluationScore: z.number(), // Score de la posición
  searchDepth: z.number().default(0),
  nodesExplored: z.number().default(0),
  executionTime: z.number().default(0), // en milisegundos
  
  // Alternativas consideradas
  topMoves: z.array(
    z.object({
      from: z.array(z.number()).length(2),
      to: z.array(z.number()).length(2),
      score: z.number(),
      rank: z.number(),
    })
  ).optional(),
  
  // Tiempos
  timestamp: z.date().default(() => new Date()),
})

export type AIAnalytic = z.infer<typeof AIAnalyticSchema>

export const AI_ANALYTIC_COLLECTION = 'aiAnalytics'

// Índices para colección aiAnalytics
export const AI_ANALYTIC_INDEXES = [
  { key: { gameId: 1 } },
  { key: { difficulty: 1 } },
  { key: { timestamp: -1 } },
  { key: { executionTime: -1 } },
  { key: { searchDepth: 1 } },
]
