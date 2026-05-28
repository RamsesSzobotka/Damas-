import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { initializeDatabase } from './database/Database'
import { seedShopSkins } from './database/seed'
import { gameRoutes, addGameConnection, removeGameConnection, broadcastToGame } from '@/routes/game'
import { authRoute } from '@/routes/auth'
import { shopRoute } from '@/routes/shop'
import { paymentRoute } from '@/routes/payment'
import { getGame, handlePlayerMove } from '@/services/gameService'

const app = new Hono()

// Middleware global
app.use('*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use('*', logger())

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'damas-backend',
    timestamp: new Date().toISOString(),
  })
})

// Registrar rutas (REST)
app.route('/', gameRoutes)
app.route('/', authRoute)
app.route('/', shopRoute)
app.route('/', paymentRoute)

// Inicializar base de datos y arrancar servidor
const PORT = parseInt(process.env.PORT || '3001')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/damas'
const MONGODB_NAME = process.env.MONGODB_NAME || 'damas'

async function start() {
  try {
    // Conectar a MongoDB
    const db = initializeDatabase(MONGODB_URI)
    await db.connect(MONGODB_NAME)
    await db.initializeCollections()

    await seedShopSkins()

    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
  } catch (error) {
    console.error('❌ Error iniciando backend:', error)
    // No hacer exit para permitir que el servidor arranque igual
    // (útil para desarrollo sin MongoDB corriendo)
  }
}

start()

// Iniciar servidor HTTP + WebSocket con Bun
const server = Bun.serve<{ gameId: string }>({
  port: PORT,
  fetch(req, server) {
    const url = new URL(req.url)

    // WebSocket upgrade para conexiones de juego
    if (url.pathname === '/ws') {
      const gameId = url.searchParams.get('gameId')
      if (!gameId) {
        return new Response('Missing gameId parameter', { status: 400 })
      }

      const success = server.upgrade(req, { data: { gameId } })
      if (success) return
      return new Response('WebSocket upgrade failed', { status: 400 })
    }

    // Todas las demás rutas pasan por Hono
    return app.fetch(req)
  },
  websocket: {
    /**
     * Se ejecuta al abrirse una conexión WebSocket.
     * Registra la conexión y envía el estado actual de la partida.
     */
    async open(ws) {
      const { gameId } = ws.data
      addGameConnection(gameId, ws)

      try {
        const game = await getGame(gameId)
        if (game) {
          ws.send(JSON.stringify({
            type: 'game_state',
            board: game.board,
            currentPlayer: game.currentPlayer ?? 1,
            status: game.status,
            gameId,
          }))
        }
      } catch (err) {
        console.error('Error enviando estado inicial:', err)
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Error al cargar el estado del juego',
        }))
      }
    },

    /**
     * Procesa mensajes entrantes desde el frontend.
     * Tipos soportados: player_move
     */
    async message(ws, message) {
      try {
        const data = JSON.parse(message.toString())
        const { gameId } = ws.data

        if (data.type === 'player_move') {
          const from: [number, number] = data.from
          const to: [number, number] = data.to

          const result = await handlePlayerMove(gameId, from, to)

          // Notificar a todos los clientes de la partida
          broadcastToGame(gameId, {
            type: 'move_applied',
            board: result.board,
            lastMove: result.lastMove,
            nextPlayer: result.nextPlayer,
            forcedPiece: result.forcedPiece,
          })

          if (result.aiMove) {
            broadcastToGame(gameId, {
              type: 'ai_move',
              board: result.board,
              nextPlayer: 1,
              lastMove: {
                from: result.aiMove.from,
                to: result.aiMove.to,
                player: 'ai',
              },
            })
          }

          if (result.gameOver) {
            broadcastToGame(gameId, {
              type: 'game_over',
              result: result.result,
              board: result.board,
            })
          }
        }
      } catch (error) {
        const { gameId } = ws.data
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.error('Error en mensaje WebSocket:', errorMessage)

        broadcastToGame(gameId, {
          type: 'error',
          message: errorMessage,
        })
      }
    },

    /**
     * Limpieza al cerrarse la conexión.
     */
    close(ws) {
      const { gameId } = ws.data
      removeGameConnection(gameId, ws)
    },
  },
})

console.log(`🚀 Backend escuchando en http://localhost:${PORT}`)
