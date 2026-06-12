/**
 * Ultra — A* con búsqueda iterativa (Iterative Deepening A* - IDA*).
 *
 * Empieza en profundidad 1 y va aumentando hasta MAX_DEPTH o hasta
 * agotar el tiempo límite. Usa la tabla de transposición para cachear
 * evaluaciones entre iteraciones.
 *
 * Solo A* — sin minimax, sin alfa-beta, sin Monte Carlo.
 *
 * La dificultad extra viene de:
 *   - Mayor profundidad de búsqueda
 *   - Reutilización de evaluaciones entre iteraciones
 *   - Corte temprano si encuentra posición ganadora
 */

import { Board, Move, AI } from '@models/Board'
import { getAllValidMoves } from '@utils/rulesEngine'
import { asteriskSearch } from '@algorithms/astar'
import { getRandomMove } from '@algorithms/moveGenerator'

const MAX_DEPTH = 10
const TIME_LIMIT_MS = 5000
const WIN_SCORE = 90000

export function getUltraMove(board: Board, player: number = AI): Move | null {
  const moves = getAllValidMoves(board, player)
  if (moves.length === 0) return null
  if (moves.length === 1) return moves[0]

  let bestMove: Move | null = null
  const startTime = Date.now()

  // ── Búsqueda iterativa con A* ──
  // Empieza en profundidad 1, sube hasta MAX_DEPTH
  // Si una iteración se queda sin tiempo, devuelve el mejor de la
  // profundidad anterior (más rápida pero menos precisa)
  for (let depth = 1; depth <= MAX_DEPTH; depth++) {
    const result = asteriskSearch(board, player, depth, TIME_LIMIT_MS)

    if (!result.bestMove) break

    bestMove = result.bestMove

    // Corte temprano: posición ganadora asegurada
    if (result.bestScore > WIN_SCORE) break

    // Si nos quedamos sin tiempo, usar resultado de profundidad anterior
    if (Date.now() - startTime > TIME_LIMIT_MS) break
  }

  return bestMove || getRandomMove(moves)
}
