import { Board, Move, AI, PLAYER, EMPTY, AI_KING, PLAYER_KING, BOARD_SIZE } from '@models/Board'
import { getAllValidMoves } from '@utils/rulesEngine'
import { applyMove } from '@utils/boardUtils'
import { getRandomMove } from '@algorithms/moveGenerator'

/** Profundidad máxima del árbol de búsqueda minimax. */
const MAX_DEPTH = 4

/**
 * Heurística de evaluación del tablero (perspectiva IA).
 * Incluye:
 *  - Material: +1 ficha, +3 rey
 *  - Control del centro
 *  - Avance hacia coronación
 *  - Seguridad en bordes (columnas extremas)
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

      // Control del centro
      const centerBonus = (3 - Math.abs(r - 3.5)) * 0.1 + (3 - Math.abs(c - 3.5)) * 0.1

      // Avance hacia la promoción
      const advanceBonus = isAI ? (BOARD_SIZE - 1 - r) * 0.08 : r * 0.08

      // Seguridad en bordes (más difícil de capturar)
      const edgeBonus = (c === 0 || c === 7) ? 0.05 : 0

      if (isAI) {
        score += value + centerBonus + advanceBonus + edgeBonus
      } else {
        score -= value + centerBonus + advanceBonus + edgeBonus
      }
    }
  }

  return score
}

/**
 * Minimax con poda Alfa-Beta.
 *
 * @param board    - Estado actual del tablero
 * @param depth    - Profundidad restante
 * @param alpha    - Mejor puntuación garantizada para el maximizador (IA)
 * @param beta     - Mejor puntuación garantizada para el minimizador (jugador)
 * @param maximizing - true si es turno de la IA, false si es turno del jugador
 * @returns Puntuación del tablero desde la perspectiva de la IA
 */
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
): number {
  // Caso base: profundidad agotada → evaluar tablero
  if (depth === 0) {
    return evaluateBoard(board)
  }

  const currentPlayer = maximizing ? AI : PLAYER
  const moves = getAllValidMoves(board, currentPlayer)

  // Sin movimientos = partida terminada
  if (moves.length === 0) {
    if (maximizing) {
      // IA sin movimientos → IA pierde → penalización grande
      return -10000 + (MAX_DEPTH - depth)
    } else {
      // Jugador sin movimientos → jugador pierde → recompensa grande
      return 10000 - (MAX_DEPTH - depth)
    }
  }

  // Ordenar movimientos: capturas primero (mejora la poda)
  moves.sort((a, b) => {
    const aCap = a.captured ? a.captured.length : 0
    const bCap = b.captured ? b.captured.length : 0
    return bCap - aCap
  })

  if (maximizing) {
    let maxEval = -Infinity

    for (const move of moves) {
      const newBoard = applyMove(board, move)
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false)
      maxEval = Math.max(maxEval, evalScore)
      alpha = Math.max(alpha, evalScore)
      if (beta <= alpha) break // Poda alfa-beta
    }

    return maxEval
  } else {
    let minEval = Infinity

    for (const move of moves) {
      const newBoard = applyMove(board, move)
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true)
      minEval = Math.min(minEval, evalScore)
      beta = Math.min(beta, evalScore)
      if (beta <= alpha) break // Poda alfa-beta
    }

    return minEval
  }
}

/**
 * Estrategia Master: Minimax con poda Alfa-Beta (profundidad 3-4).
 *
 * Evalúa el árbol de juego hasta MAX_DEPTH para encontrar el mejor movimiento,
 * usando poda alfa-beta para descartar ramas poco prometedoras.
 * El orden de movimientos (capturas primero) mejora la eficiencia de la poda.
 */
export function getMasterMove(board: Board, player: number = AI): Move | null {
  const moves = getAllValidMoves(board, player)
  if (moves.length === 0) return null

  // Solo un movimiento disponible, no hay que evaluar
  if (moves.length === 1) return moves[0]

  // Ordenar: capturas múltiples primero, luego capturas simples, luego el resto
  const orderedMoves = [...moves].sort((a, b) => {
    const aCap = a.captured ? a.captured.length : 0
    const bCap = b.captured ? b.captured.length : 0
    return bCap - aCap
  })

  let bestScore = -Infinity
  const bestMoves: Move[] = []

  for (const move of orderedMoves) {
    const newBoard = applyMove(board, move)
    const score = minimax(newBoard, MAX_DEPTH - 1, -Infinity, Infinity, false)

    if (score > bestScore) {
      bestScore = score
      bestMoves.length = 0
      bestMoves.push(move)
    } else if (score === bestScore) {
      bestMoves.push(move)
    }
  }

  return getRandomMove(bestMoves)
}
