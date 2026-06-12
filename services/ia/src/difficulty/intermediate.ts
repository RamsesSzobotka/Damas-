/**
 * Intermedio — A* con profundidad 2.
 *
 * Busca hasta 2 movimientos adelante. Considera la respuesta del oponente
 * antes de decidir. f(n) = w × depth + h_adjusted(n).
 * Solo A* — sin minimax, sin alfa-beta.
 */

import { Board, Move, AI } from '@models/Board'
import { asteriskSearch } from '@algorithms/astar'

export function getIntermediateMove(board: Board, player: number = AI): Move | null {
  const result = asteriskSearch(board, player, 2)
  return result.bestMove
}
