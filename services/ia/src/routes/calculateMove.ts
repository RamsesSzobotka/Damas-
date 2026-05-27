import { Hono } from 'hono'
import { z } from 'zod'
import { AI } from '@models/Board'
import type { Board } from '@models/Board'
import { getBeginnerMove } from '@algorithms/beginner'

const calculateSchema = z.object({
  board: z.array(z.array(z.number().min(0).max(4))).length(8),
  currentPlayer: z.number().min(1).max(2).default(AI),
})

const calculateRoute = new Hono()

calculateRoute.post('/calculate-move', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = calculateSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: 'Invalid input', details: parsed.error.issues }, 400)
    }

    const { board, currentPlayer } = parsed.data
    const move = getBeginnerMove(board as Board, currentPlayer)

    if (!move) {
      return c.json({ error: 'No valid moves available' }, 400)
    }

    return c.json({
      from: move.from,
      to: move.to,
    })
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { calculateRoute }
