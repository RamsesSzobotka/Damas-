/**
 * Principiante — A* con profundidad 1.
 *
 * Evalúa cada movimiento posible con la heurística y elige el mejor.
 * Equivalente a "greedy best-first" pero usando la misma función f(n) de A*.
 */

import { Board, Move, AI } from '@models/Board'
import { asteriskSearch } from '@algorithms/astar'

export function getBeginnerMove(board: Board, player: number = AI): Move | null {
  const result = asteriskSearch(board, player, 1)
  return result.bestMove
}
