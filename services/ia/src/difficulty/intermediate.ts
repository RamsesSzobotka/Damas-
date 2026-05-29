import { Board, Move, AI, EMPTY, AI_KING, PLAYER_KING, BOARD_SIZE } from '@models/Board'
import { getAllValidMoves } from '@utils/rulesEngine'
import { applyMove } from '@utils/boardUtils'
import { getRandomMove } from '@algorithms/moveGenerator'

/**
 * Heurística de evaluación del tablero desde la perspectiva de la IA.
 * Puntúa más alto cuanto mejor está la IA.
 *
 * Factores considerados:
 *  - Material: +1 por ficha normal, +3 por rey
 *  - Control del centro: bonificación por proximidad al centro
 *  - Avance: bonificación por fichas más cerca de la coronación
 *  - Seguridad en bordes: fichas en columna 0 o 7 son más difíciles de capturar
 */
function evaluateBoard(board: Board): number {
  let score = 0

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c]
      if (piece === EMPTY) continue

      const isAI = piece === AI || piece === AI_KING
      const isKing = piece === AI_KING || piece === PLAYER_KING
      const value = isKing ? 3 : 1

      // Bonificación por control del centro (más peso en casillas centrales)
      const centerBonus = (3 - Math.abs(r - 3.5)) * 0.05 + (3 - Math.abs(c - 3.5)) * 0.05

      // Bonificación por avance hacia la coronación
      const advanceBonus = isAI ? (BOARD_SIZE - 1 - r) * 0.05 : r * 0.05

      if (isAI) {
        score += value + centerBonus + advanceBonus
      } else {
        score -= value + centerBonus + advanceBonus
      }
    }
  }

  return score
}

/**
 * Estrategia Intermediate (A* profundidad 1):
 *   1. Obtiene todos los movimientos válidos (con captura forzada).
 *   2. Para cada movimiento, simula el resultado del tablero.
 *   3. Evalúa cada tablero resultante con la heurística.
 *   4. Selecciona el movimiento con mejor puntuación.
 *   5. En caso de empate, elige aleatoriamente entre los mejores (variedad).
 *
 * Esto es esencialmente una búsqueda A* donde:
 *   - g(n) = 0 (no hay costo de camino, solo se evalúa el estado)
 *   - h(n) = evaluateBoard(n)  (heurística del estado resultante)
 *   - f(n) = h(n)
 *   - Se expande el vecino con mejor f(n) → se elige el movimiento con mejor evaluación
 */
export function getIntermediateMove(board: Board, player: number = AI): Move | null {
  const moves = getAllValidMoves(board, player)
  if (moves.length === 0) return null

  let bestScore = -Infinity
  const bestMoves: Move[] = []

  for (const move of moves) {
    const newBoard = applyMove(board, move)
    const score = evaluateBoard(newBoard)

    if (score > bestScore) {
      bestScore = score
      bestMoves.length = 0
      bestMoves.push(move)
    } else if (score === bestScore) {
      bestMoves.push(move)
    }
  }

  // Variedad: entre movimientos igual de buenos, elige aleatorio
  return getRandomMove(bestMoves)
}
