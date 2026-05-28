/**
 * Game Routes
 *
 * Rutas REST y gestión de conexiones WebSocket para partidas de damas.
 * - REST: creación y consulta de partidas
 * - WebSocket: juego en tiempo real con comunicación bidireccional
 */

import { Hono } from 'hono'
import { verifyToken } from '@clerk/backend'
import { ObjectId } from 'mongodb'
import { createGame, getGame } from '@/services/gameService'
import { getDatabase } from '@/database/Database'
import { USER_COLLECTION } from '@/models/User'
import { USER_SKIN_COLLECTION } from '@/models/UserSkin'

// ---------------------------------------------------------------------------
// WebSocket Connection Management
// ---------------------------------------------------------------------------

/**
 * Interfaz mínima para conexiones WebSocket rastreadas por el sistema.
 * Compatible con ServerWebSocket de Bun.
 */
export interface GameWS {
  send(data: string | Uint8Array | ArrayBufferLike): number | undefined
  readyState: number
  data: { gameId: string }
  close(code?: number, reason?: string): void
}

/**
 * Mapa de conexiones WebSocket agrupadas por ID de partida.
 * gameConnections: Map<gameId, Set<WebSocket>>
 */
const gameConnections = new Map<string, Set<GameWS>>()

/**
 * Envía un mensaje JSON a todas las conexiones WebSocket de una partida.
 * @param gameId - ID de la partida
 * @param message - Objeto a serializar y enviar
 */
export function broadcastToGame(gameId: string, message: object): void {
  const connections = gameConnections.get(gameId)
  if (!connections) return

  const payload = JSON.stringify(message)
  for (const ws of connections) {
    try {
      if (ws.readyState === 1) {
        // WebSocket.OPEN
        ws.send(payload)
      }
    } catch (err) {
      console.error('Error sending WebSocket message:', err)
    }
  }
}

/**
 * Agrega una conexión WebSocket al seguimiento de una partida.
 */
export function addGameConnection(gameId: string, ws: GameWS): void {
  if (!gameConnections.has(gameId)) {
    gameConnections.set(gameId, new Set())
  }
  gameConnections.get(gameId)!.add(ws)
}

/**
 * Remueve una conexión WebSocket del seguimiento de una partida.
 * Si no quedan conexiones, limpia la entrada del mapa.
 */
export function removeGameConnection(gameId: string, ws: GameWS): void {
  const connections = gameConnections.get(gameId)
  if (!connections) return

  connections.delete(ws)
  if (connections.size === 0) {
    gameConnections.delete(gameId)
  }
}

/**
 * Obtiene las conexiones activas de una partida (para inspección/depuración).
 */
export function getGameConnections(gameId: string): Set<GameWS> | undefined {
  return gameConnections.get(gameId)
}

// ---------------------------------------------------------------------------
// REST Routes
// ---------------------------------------------------------------------------

const gameRoutes = new Hono()

/**
 * POST /api/game/create
 * Crea una nueva partida con la dificultad especificada.
 * Body: { difficulty: "beginner" | "intermediate" | "master" | "ultra" }
 */
// Map Spanish difficulty names to English (DB format)
const DIFFICULTY_MAP: Record<string, string> = {
  principiante: 'beginner',
  beginner: 'beginner',
  intermedio: 'intermediate',
  intermediate: 'intermediate',
  master: 'master',
  ultra: 'ultra',
}

gameRoutes.post('/api/game/create', async (c) => {
  try {
    const { difficulty } = await c.req.json()

    if (!difficulty) {
      return c.json({ error: 'Missing difficulty' }, 400)
    }

    const mappedDifficulty = DIFFICULTY_MAP[difficulty.toLowerCase()]
    if (!mappedDifficulty) {
      return c.json({ error: 'Invalid difficulty' }, 400)
    }

    // Resolver skin equipada del usuario si está autenticado
    let playerSkinId: string | undefined
    const authHeader = c.req.header('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const payload = await verifyToken(authHeader.slice(7), {
          secretKey: process.env.CLERK_SECRET_KEY || '',
        })
        const users = getDatabase().getCollection(USER_COLLECTION)
        const user = await users.findOne({ clerkId: payload.sub })
        if (user) {
          const userSkinsCol = getDatabase().getCollection(USER_SKIN_COLLECTION)
          const equipped = await userSkinsCol.findOne({ userId: user._id, isEquipped: true })
          if (equipped) {
            playerSkinId = equipped.skinId.toString()
          }
        }
      } catch {
        // Token inválido — se crea partida sin skin
      }
    }

    const result = await createGame(mappedDifficulty, playerSkinId)
    return c.json({ ...result, playerSkinId }, 201)
  } catch (error) {
    console.error('Error creating game:', error)
    return c.json({ error: 'Failed to create game' }, 500)
  }
})

/**
 * GET /api/game/:gameId
 * Obtiene el estado completo de una partida.
 */
gameRoutes.get('/api/game/:gameId', async (c) => {
  try {
    const { gameId } = c.req.param()
    const game = await getGame(gameId)

    if (!game) {
      return c.json({ error: 'Game not found' }, 404)
    }

    return c.json({
      gameId: game._id!.toString(),
      board: game.board,
      status: game.status,
      currentPlayer: game.currentPlayer,
      difficulty: game.difficulty,
      moves: game.moves,
      playerMoves: game.playerMoves,
      aiMoves: game.aiMoves,
      result: game.result,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
      completedAt: game.completedAt,
      pointsEarned: game.pointsEarned,
    })
  } catch (error) {
    console.error('Error getting game:', error)
    return c.json({ error: 'Failed to get game' }, 500)
  }
})

export { gameRoutes }
