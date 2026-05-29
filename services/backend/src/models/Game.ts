import { z } from 'zod'
import { ObjectId } from 'mongodb'

/**
 * Game Model
 * Historial y estado de partidas
 */

export const MoveSchema = z.object({
  from: z.array(z.number()).length(2),
  to: z.array(z.number()).length(2),
  capturedPieces: z.array(z.array(z.number()).length(2)).optional(),
  movedAt: z.date(),
})

export const GameSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: z.instanceof(ObjectId), // Referencia a User
  difficulty: z.enum(['beginner', 'intermediate', 'master', 'ultra']),
  status: z.enum(['active', 'completed', 'abandoned']).default('active'),
  currentPlayer: z.number().min(1).max(2).default(1),
  result: z.enum(['victory', 'defeat', 'draw']).optional(),
  
  // Estado del tablero
  board: z.array(z.array(z.number())).length(8), // 8x8 board state
  
  // Información de jugadas
  moves: z.array(MoveSchema),
  totalMoves: z.number(),
  playerMoves: z.number().default(0),
  aiMoves: z.number().default(0),
  
  // Tiempos
  duration: z.number().optional(), // en segundos
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  completedAt: z.date().optional(),
  
  // Modo de juego: ranked (afecta ranking) o practice (no afecta)
  mode: z.enum(['ranked', 'practice']).default('practice'),
  
  // Liga del jugador al iniciar la partida (solo ranked)
  leagueAtPlay: z.string().optional(),
  
  // Puntuación ganada/perdida
  pointsEarned: z.number().optional(),
  
  // Skins usados
  playerSkinId: z.instanceof(ObjectId).optional(),
  aiSkinId: z.instanceof(ObjectId).optional(),
})

export type Game = z.infer<typeof GameSchema>
export type Move = z.infer<typeof MoveSchema>

export const GAME_COLLECTION = 'games'

// Índices para colección games
export const GAME_INDEXES = [
  { key: { userId: 1 } },
  { key: { status: 1 } },
  { key: { createdAt: -1 } },
  { key: { difficulty: 1 } },
  { key: { result: 1 } },
  { key: { userId: 1, createdAt: -1 } },
]
