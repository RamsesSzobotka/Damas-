import { Hono } from 'hono'
import { z } from 'zod'
import { AI } from '@models/Board'
import type { Board } from '@models/Board'
import { getBeginnerMove } from '@algorithms/beginner'
import { getIntermediateMove } from '@difficulty/intermediate'
import { getMasterMove } from '@difficulty/master'
import { getUltraMove } from '@difficulty/ultra'

const calculateSchema = z.object({
  board: z.array(z.array(z.number().min(0).max(4))).length(8),
  currentPlayer: z.number().min(1).max(2).default(AI),
  difficulty: z.enum(['beginner', 'intermediate', 'master', 'ultra']).default('beginner'),
})

const calculateRoute = new Hono()

calculateRoute.post('/calculate-move', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = calculateSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: 'Invalid input', details: parsed.error.issues }, 400)
    }

    const { board, currentPlayer, difficulty } = parsed.data

    // Seleccionar algoritmo según dificultad
    let move = null
    switch (difficulty) {
      case 'master':
        move = getMasterMove(board as Board, currentPlayer)
        break
      case 'intermediate':
        move = getIntermediateMove(board as Board, currentPlayer)
        break
      case 'ultra':
        move = getUltraMove(board as Board, currentPlayer)
        break
      case 'beginner':
      default:
        move = getBeginnerMove(board as Board, currentPlayer)
        break
    }

    if (!move) {
      return c.json({ error: 'No valid moves available' }, 400)
    }

    return c.json({
      from: move.from,
      to: move.to,
      captured: move.captured,
    })
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { calculateRoute }
