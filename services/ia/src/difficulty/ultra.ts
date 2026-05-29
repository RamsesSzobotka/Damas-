import { Board, Move, AI, PLAYER, EMPTY, AI_KING, PLAYER_KING, BOARD_SIZE } from '@models/Board'
import { getAllValidMoves } from '@utils/rulesEngine'
import { applyMove } from '@utils/boardUtils'
import { getRandomMove } from '@algorithms/moveGenerator'

// ─── Configuración ──────────────────────────────────────────────────

/** Profundidad máxima del árbol de búsqueda. */
const MAX_DEPTH = 8

/** Tiempo máximo por jugada (ms). */
const TIME_LIMIT_MS = 5000

// ─── Tabla de Transposición ─────────────────────────────────────────

interface TTEntry {
  /** Profundidad a la que se evaluó esta posición. */
  depth: number
  /** Puntuación almacenada. */
  score: number
  /** Mejor movimiento desde esta posición (para reordenar). */
  bestMove?: Move
}

/**
 * Genera una clave única para un tablero.
 * Se usa como key en la tabla de transposición.
 */
function boardKey(board: Board): string {
  // Ej: "0,2,0,2,0,2,0,2|2,0,2,0,2,0,2,0|..."
  return board.map(row => row.join(',')).join('|')
}

// ─── Heurística ─────────────────────────────────────────────────────

/**
 * Evalúa el tablero desde la perspectiva de la IA.
 * Factores con más peso que en master para guiar mejor la búsqueda.
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

      // Control del centro (más peso que en master)
      const centerBonus = (3 - Math.abs(r - 3.5)) * 0.15 + (3 - Math.abs(c - 3.5)) * 0.15

      // Avance hacia coronación
      const advanceBonus = isAI ? (BOARD_SIZE - 1 - r) * 0.12 : r * 0.12

      // Seguridad en bordes
      const edgeBonus = (c === 0 || c === 7) ? 0.08 : 0

      if (isAI) {
        score += value + centerBonus + advanceBonus + edgeBonus
      } else {
        score -= value + centerBonus + advanceBonus + edgeBonus
      }
    }
  }

  return score
}

// ─── Minimax con Transposición ──────────────────────────────────────

/**
 * Minimax con poda Alfa-Beta y tabla de transposición.
 *
 * La TT cachea posiciones ya evaluadas para no recalcular.
 * Si una posición ya fue evaluada a profundidad >= depth,
 * se reusa la puntuación directamente.
 */
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  tt: Map<string, TTEntry>,
  startTime: number,
): { score: number; bestMove?: Move } {
  // ── Cortar si nos quedamos sin tiempo ──
  if (Date.now() - startTime > TIME_LIMIT_MS) {
    return { score: evaluateBoard(board) }
  }

  const key = boardKey(board)

  // ── Consultar tabla de transposición ──
  const cached = tt.get(key)
  if (cached && cached.depth >= depth) {
    // Cache válido: reusar puntuación y mejor movimiento
    return { score: cached.score, bestMove: cached.bestMove }
  }

  // ── Caso base: profundidad agotada ──
  if (depth === 0) {
    const score = evaluateBoard(board)
    return { score }
  }

  const currentPlayer = maximizing ? AI : PLAYER
  const moves = getAllValidMoves(board, currentPlayer)

  // ── Sin movimientos = partida terminada ──
  if (moves.length === 0) {
    const score = maximizing
      ? -100000 + (MAX_DEPTH - depth)
      : 100000 - (MAX_DEPTH - depth)
    return { score }
  }

  // ── Orden de movimientos ──
  // 1. Poner el bestMove cacheado primero (si existe)
  // 2. Luego capturas (mejora la poda)
  if (cached?.bestMove) {
    const idx = moves.findIndex(m =>
      m.from[0] === cached.bestMove!.from[0] &&
      m.from[1] === cached.bestMove!.from[1] &&
      m.to[0] === cached.bestMove!.to[0] &&
      m.to[1] === cached.bestMove!.to[1],
    )
    if (idx > 0) {
      const [best] = moves.splice(idx, 1)
      moves.unshift(best)
    }
  }
  // Ordenar resto por capturas (estable, mantiene el bestMove al inicio)
  if (moves.length > 1) {
    const rest = moves.slice(1)
    rest.sort((a, b) => {
      const aCap = a.captured ? a.captured.length : 0
      const bCap = b.captured ? b.captured.length : 0
      return bCap - aCap
    })
    for (let i = 1; i < moves.length; i++) {
      moves[i] = rest[i - 1]
    }
  }

  let bestMove: Move | undefined
  let bestScore: number

  if (maximizing) {
    bestScore = -Infinity

    for (const move of moves) {
      const newBoard = applyMove(board, move)
      const result = minimax(newBoard, depth - 1, alpha, beta, false, tt, startTime)

      if (result.score > bestScore) {
        bestScore = result.score
        bestMove = move
      }

      alpha = Math.max(alpha, bestScore)
      if (beta <= alpha) break // Poda α-β
    }
  } else {
    bestScore = Infinity

    for (const move of moves) {
      const newBoard = applyMove(board, move)
      const result = minimax(newBoard, depth - 1, alpha, beta, true, tt, startTime)

      if (result.score < bestScore) {
        bestScore = result.score
        bestMove = move
      }

      beta = Math.min(beta, bestScore)
      if (beta <= alpha) break // Poda α-β
    }
  }

  // ── Guardar en tabla de transposición ──
  tt.set(key, { depth, score: bestScore, bestMove })

  return { score: bestScore, bestMove }
}

// ── Estrategia Ultra ────────────────────────────────────────────────

/**
 * Estrategia Ultra: Minimax + Alfa-Beta + Tabla de Transposición
 * + Búsqueda Iterativa (Iterative Deepening).
 *
 * Características:
 *  - Profundidad máxima: 8 (configurable vía MAX_DEPTH)
 *  - Límite de tiempo: 5 segundos (configurable vía TIME_LIMIT_MS)
 *  - Tabla de transposición: cachea posiciones ya evaluadas
 *    entre niveles de profundidad para no recalcular
 *  - Búsqueda iterativa: empieza en profundidad 1 y sube hasta
 *    MAX_DEPTH o hasta agotar el tiempo. Si se acaba el tiempo
 *    en profundidad N, devuelve el mejor movimiento de N-1
 *  - Orden de movimientos: bestMove cacheado primero, luego capturas
 *  - Corte temprano: si encuentra posición ganadora (> 90000), para
 */
export function getUltraMove(board: Board, player: number = AI): Move | null {
  const moves = getAllValidMoves(board, player)
  if (moves.length === 0) return null

  // Un solo movimiento disponible — no hay que buscar
  if (moves.length === 1) return moves[0]

  // Tabla de transposición: persiste entre niveles de profundidad
  const tt: Map<string, TTEntry> = new Map()
  const startTime = Date.now()

  let bestMove: Move | null = null
  let completedDepth = 0

  // ── Búsqueda iterativa ──
  // Empieza en 1, sube hasta MAX_DEPTH
  // Si una búsqueda se queda sin tiempo, devuelve el mejor de la
  // profundidad anterior (más rápida pero menos precisa)
  for (let depth = 1; depth <= MAX_DEPTH; depth++) {
    const result = minimax(board, depth, -Infinity, Infinity, true, tt, startTime)

    // Si nos quedamos sin tiempo, usar resultado de profundidad anterior
    if (Date.now() - startTime > TIME_LIMIT_MS) {
      break
    }

    if (result.bestMove) {
      bestMove = result.bestMove
      completedDepth = depth
    }

    // Corte temprano: posición ganadora asegurada
    if (result.score > 90000) {
      break
    }
  }

  // Si la búsqueda no encontró nada (caso borde), fallback a random
  return bestMove || getRandomMove(moves)
}
