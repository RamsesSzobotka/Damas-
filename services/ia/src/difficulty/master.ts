/**
 * Master — A* con profundidad 4.
 *
 * Busca hasta 4 movimientos adelante usando exclusivamente A*.
 * f(n) = w × depth + h_adjusted(n).
 *
 * Mayor profundidad → mejor evaluación estratégica.
 * Solo A* — sin minimax, sin alfa-beta, sin Monte Carlo.
 *
 * Para aumentar dificultad: aumentar maxDepth.
 * Para reducir tiempo: reducir maxDepth.
 */

import { Board, Move, AI } from '@models/Board'
import { asteriskSearch } from '@algorithms/astar'

const MAX_DEPTH = 4
const TIME_LIMIT_MS = 2000

export function getMasterMove(board: Board, player: number = AI): Move | null {
  const result = asteriskSearch(board, player, MAX_DEPTH, TIME_LIMIT_MS)
  return result.bestMove
}
