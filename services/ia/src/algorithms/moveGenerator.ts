import { Move } from '@models/Board'

/** Pick a random move from a list. Returns null for an empty list. */
export function getRandomMove(moves: Move[]): Move | null {
  if (moves.length === 0) return null
  return moves[Math.floor(Math.random() * moves.length)]
}


