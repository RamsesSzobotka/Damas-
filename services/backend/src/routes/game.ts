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
import { getDifficultyForPoints, getLeagueForPoints, updateRankingAfterGame } from '@/services/rankingService'
import { GAME_COLLECTION } from '@/models/Game'

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
 * Crea una nueva partida.
 * Body: {
 *   mode: "ranked" | "practice" (default: "practice")
 *   difficulty?: "beginner" | "intermediate" | "master" | "ultra" (opcional en ranked, se auto-asigna)
 * }
 *
 * - En modo "ranked": requiere auth, la dificultad se auto-asigna según la liga
 * - En modo "practice": difficulty es obligatorio, sin auth requerido
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
    const body = await c.req.json()
    const mode: string = body.mode || 'practice'
    let difficulty: string = body.difficulty || ''
    let leagueAtPlay: string | undefined
    let userId: string | undefined

    // Validar modo
    if (mode !== 'ranked' && mode !== 'practice') {
      return c.json({ error: 'Invalid mode. Use "ranked" or "practice"' }, 400)
    }

    // Resolver auth
    let playerSkinId: string | undefined
    let userClerkId: string | undefined
    const authHeader = c.req.header('Authorization')

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const payload = await verifyToken(authHeader.slice(7), {
          secretKey: process.env.CLERK_SECRET_KEY || '',
        })
        userClerkId = payload.sub
        const users = getDatabase().getCollection(USER_COLLECTION)
        const user = await users.findOne({ clerkId: payload.sub })
        if (user) {
          userId = user._id!.toHexString()
          const userSkinsCol = getDatabase().getCollection(USER_SKIN_COLLECTION)
          const equipped = await userSkinsCol.findOne({ userId: user._id, isEquipped: true })
          if (equipped) {
            playerSkinId = equipped.skinId.toString()
          }
        }
      } catch {
        // Token inválido
      }
    }

    if (mode === 'ranked') {
      // =============================================================
      // MODO RANKED: requiere auth, auto-dificultad según liga
      // =============================================================
      if (!userId) {
        return c.json({ error: 'Ranked mode requires authentication' }, 401)
      }

      // Obtener puntos del usuario (del ranking o de stats)
      const users = getDatabase().getCollection(USER_COLLECTION)
      const user = await users.findOne({ _id: new ObjectId(userId) })
      const playerPoints = user?.stats?.totalPoints || 0

      // Auto-asignar dificultad según liga
      const autoDifficulty = getDifficultyForPoints(playerPoints)
      difficulty = autoDifficulty

      // Registrar en qué liga está el jugador
      const league = getLeagueForPoints(playerPoints)
      leagueAtPlay = league.name

      console.log(`🏆 Partida RANKED: usuario ${userClerkId} - Liga ${leagueAtPlay} (${autoDifficulty}), ${playerPoints} pts`)
    } else {
      // =============================================================
      // MODO PRACTICE: difficulty obligatorio
      // =============================================================
      if (!difficulty) {
        return c.json({ error: 'Missing difficulty for practice mode' }, 400)
      }

      const mappedDifficulty = DIFFICULTY_MAP[difficulty.toLowerCase()]
      if (!mappedDifficulty) {
        return c.json({ error: 'Invalid difficulty' }, 400)
      }
      difficulty = mappedDifficulty
    }

    const result = await createGame(difficulty, playerSkinId, mode as 'ranked' | 'practice', userId, leagueAtPlay)

    return c.json({
      ...result,
      mode,
      difficulty,
      leagueAtPlay,
      playerSkinId,
    }, 201)
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

/**
 * POST /api/game/surrender/:gameId
 * Se rinde el jugador actual: marca la partida como derrota y procesa ranking si es ranked.
 */
gameRoutes.post('/api/game/surrender/:gameId', async (c) => {
  try {
    const { gameId } = c.req.param()
    const collection = getDatabase().getCollection(GAME_COLLECTION)
    const game = await collection.findOne({ _id: new ObjectId(gameId) })

    if (!game) {
      return c.json({ error: 'Game not found' }, 404)
    }

    if (game.status !== 'active') {
      return c.json({ error: 'Game is not active' }, 400)
    }

    const duration = Math.floor((Date.now() - game.createdAt.getTime()) / 1000)

    await collection.updateOne(
      { _id: new ObjectId(gameId) },
      {
        $set: {
          status: 'completed',
          result: 'defeat',
          completedAt: new Date(),
          duration,
        },
      }
    )

    let rankingResult = null
    if (game.mode === 'ranked' && game.userId) {
      const playerPieces = game.board
        .flat()
        .filter((v: number) => v === 1 || v === 3).length
      const aiPieces = game.board
        .flat()
        .filter((v: number) => v === 2 || v === 4).length

      rankingResult = await updateRankingAfterGame(
        game.userId,
        {
          won: false,
          difficulty: game.difficulty,
          playerPiecesLeft: playerPieces,
          aiPiecesLeft: aiPieces,
          totalMoves: game.totalMoves || 0,
          durationSeconds: duration,
          mode: 'ranked',
        }
      )
    }

    return c.json({
      gameId,
      status: 'completed',
      result: 'defeat',
      duration,
      board: game.board,
      rankingUpdate: rankingResult
        ? {
            pointsEarned: rankingResult.pointsEarned,
            leagueBefore: rankingResult.leagueBefore,
            leagueAfter: rankingResult.leagueAfter,
            won: false,
            streak: rankingResult.streak,
            totalPoints: rankingResult.totalPoints,
          }
        : null,
    }, 200)
  } catch (error) {
    console.error('Error surrendering:', error)
    return c.json({ error: 'Failed to surrender' }, 500)
  }
})

export { gameRoutes }
