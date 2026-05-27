import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { initializeDatabase } from './database/Database'

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

    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
  } catch (error) {
    console.error('❌ Error iniciando backend:', error)
    // No hacer exit para permitir que el servidor arranque igual
    // (útil para desarrollo sin MongoDB corriendo)
  }
}

start()

// Iniciar servidor HTTP con Bun
Bun.serve({
  fetch: app.fetch,
  port: PORT,
})

console.log(`🚀 Backend escuchando en http://localhost:${PORT}`)
