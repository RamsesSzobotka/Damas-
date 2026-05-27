import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// Middleware global
app.use('*', cors({
  origin: '*',
  credentials: true,
}))
app.use('*', logger())

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'damas-ia',
    timestamp: new Date().toISOString(),
  })
})

// Arrancar servidor
const PORT = parseInt(process.env.PORT || '3002')

// Iniciar servidor HTTP con Bun
Bun.serve({
  fetch: app.fetch,
  port: PORT,
})

console.log(`🧠 IA Service escuchando en http://localhost:${PORT}`)
