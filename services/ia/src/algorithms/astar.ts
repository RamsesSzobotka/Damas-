/**
 * A* Search Algorithm for Checkers (A* puro — sin minimax, sin alfa-beta).
 *
 * La IA del oponente usa exclusivamente A* para elegir sus movimientos.
 * La dificultad se controla únicamente por profundidad de búsqueda.
 *
 * f(n) = w × depth + h_adjusted(n)
 *
 * - w: peso de la profundidad (default 10)
 * - depth: número de movimientos desde la raíz
 * - h_adjusted: -evaluate(board) en turno de IA, +evaluate(board) en turno del oponente
 *
 * Con esta formulación, los estados más prometedores tienen f más bajo
 * y se exploran primero (priority queue ordenada por f ascendente).
 */

import { Board, Move, AI, PLAYER, EMPTY, AI_KING, PLAYER_KING, BOARD_SIZE } from '@models/Board'
import { getAllValidMoves, isGameOver } from '@utils/rulesEngine'
import { applyMove } from '@utils/boardUtils'

// ─── Tipos internos ──────────────────────────────────────────────────

interface AStarNode {
  board: Board
  player: number // Turno de quién es en este nodo
  depth: number
  rootMove: Move  // Movimiento original desde la raíz (para reportar)
}

interface AStarResult {
  bestMove: Move | null
  bestScore: number
  nodesExplored: number
}

// ─── Heurística de evaluación h(n) ──────────────────────────────────

/**
 * Evalúa el tablero desde la perspectiva de la IA.
 * Retorna > 0 cuando la IA está en ventaja, < 0 cuando el oponente está mejor.
 *
 * Factores:
 *  - Material: +1 ficha normal, +3 rey
 *  - Control del centro
 *  - Avance hacia coronación
 *  - Seguridad en bordes
 *  - Bonus por ventaja material general
 */
function evaluateBoard(board: Board): number {
  let score = 0
  let aiMaterial = 0
  let playerMaterial = 0

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c]
      if (piece === EMPTY) continue

      const isAI = piece === AI || piece === AI_KING
      const isKing = piece === AI_KING || piece === PLAYER_KING
      const value = isKing ? 3 : 1

      // Control del centro: casillas más centrales tienen más peso
      const centerBonus = (3 - Math.abs(r - 3.5)) * 0.1 + (3 - Math.abs(c - 3.5)) * 0.1

      // Avance hacia coronación
      const advanceBonus = isAI
        ? (BOARD_SIZE - 1 - r) * 0.08
        : r * 0.08

      // Seguridad en bordes (difícil de capturar en columna 0 o 7)
      const edgeBonus = (c === 0 || c === 7) ? 0.05 : 0

      const total = value + centerBonus + advanceBonus + edgeBonus

      if (isAI) {
        score += total
        aiMaterial += value
      } else {
        score -= total
        playerMaterial += value
      }
    }
  }

  // Bonus adicional por ventaja material general (evita cambios desfavorables)
  const materialAdvantage = (aiMaterial - playerMaterial) * 0.5
  score += materialAdvantage

  return score
}

// ─── Priority Queue simple pero eficiente ──────────────────────────

class PriorityQueue<T> {
  private items: { item: T; priority: number }[] = []

  push(item: T, priority: number): void {
    // Inserción con binary search para O(log n)
    let lo = 0
    let hi = this.items.length
    while (lo < hi) {
      const mid = (lo + hi) >>> 1
      if (this.items[mid].priority < priority) {
        lo = mid + 1
      } else {
        hi = mid
      }
    }
    this.items.splice(lo, 0, { item, priority })
  }

  pop(): T | undefined {
    return this.items.shift()?.item
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}

// ─── Hashing de tablero para conjunto cerrado ─────────────────────

function boardKey(board: Board): string {
  return board.map(row => row.join(',')).join('|')
}

// ─── A* Search ─────────────────────────────────────────────────────

/**
 * Busca el mejor movimiento usando exclusivamente A*.
 *
 * @param board         - Estado actual del tablero
 * @param currentPlayer - Jugador al que le toca mover (AI o PLAYER)
 * @param maxDepth      - Profundidad máxima de búsqueda
 * @param timeLimitMs   - Límite de tiempo en ms (Infinity para ilimitado)
 * @param depthWeight   - Peso w para g(n) = w × depth
 * @returns El mejor movimiento encontrado y metadatos
 */
export function asteriskSearch(
  board: Board,
  currentPlayer: number,
  maxDepth: number,
  timeLimitMs: number = Infinity,
  depthWeight: number = 10,
): AStarResult {
  const initialMoves = getAllValidMoves(board, currentPlayer)
  if (initialMoves.length === 0) {
    return { bestMove: null, bestScore: -Infinity, nodesExplored: 0 }
  }
  if (initialMoves.length === 1) {
    return { bestMove: initialMoves[0], bestScore: 0, nodesExplored: 0 }
  }

  const aiPlayer = currentPlayer
  const startTime = Date.now()
  const openSet = new PriorityQueue<AStarNode>()
  const closedSet = new Set<string>()
  let nodesExplored = 0

  let bestMove: Move = initialMoves[0]
  let bestScore = -Infinity

  // ── Inicializar con los hijos de la raíz (primer nivel) ──
  for (const move of initialMoves) {
    const newBoard = applyMove(board, move)
    const h = evaluateBoard(newBoard)
    const g = depthWeight * 1  // profundidad 1
    const f = g - h            // Turno de IA: f = g - h

    const nextPlayer = (currentPlayer === AI) ? PLAYER : AI

    openSet.push(
      { board: newBoard, player: nextPlayer, depth: 1, rootMove: move },
      f,
    )

    // Mejor movimiento inmediato como fallback
    if (h > bestScore) {
      bestScore = h
      bestMove = move
    }
  }

  // ── Bucle principal de A* ──
  while (!openSet.isEmpty()) {
    // Cortar por tiempo si es necesario
    if (Date.now() - startTime > timeLimitMs) break

    const current = openSet.pop()!
    nodesExplored++

    // No profundizar más allá del límite
    if (current.depth >= maxDepth) continue

    // Verificar si el juego terminó
    const gameOver = isGameOver(current.board)
    if (gameOver.over) {
      const finalScore = gameOver.winner === aiPlayer
        ? 100000 - current.depth   // Victoria: preferir rápida
        : -100000 + current.depth  // Derrota: intentar retrasar

      if (finalScore > bestScore) {
        bestScore = finalScore
        bestMove = current.rootMove
      }
      continue
    }

    // Generar movimientos legales para el jugador actual
    const legalMoves = getAllValidMoves(current.board, current.player)

    // Sin movimientos = jugador actual pierde
    if (legalMoves.length === 0) {
      const finalScore = (current.player === aiPlayer)
        ? -100000 + current.depth  // IA pierde
        : 100000 - current.depth   // Oponente pierde → IA gana

      if (finalScore > bestScore) {
        bestScore = finalScore
        bestMove = current.rootMove
      }
      continue
    }

    const isAITurn = (current.player === aiPlayer)

    for (const move of legalMoves) {
      const newBoard = applyMove(current.board, move)
      const h = evaluateBoard(newBoard)
      const g = depthWeight * (current.depth + 1)

      // Fórmula de f(n) según quién mueve:
      // - Turno IA:  f = g - h  (buenas posiciones PARA IA → f bajo)
      // - Turno op.: f = g + h  (buenas posiciones PARA OPONENTE → h negativo → f bajo)
      const f = isAITurn ? g - h : g + h

      // Closed set con clave única (posición + profundidad)
      const key = boardKey(newBoard) + '|' + (current.depth + 1)
      if (closedSet.has(key)) continue
      closedSet.add(key)

      // Actualizar mejor puntuación global
      if (h > bestScore) {
        bestScore = h
        bestMove = current.rootMove
      }

      const nextPlayer = (current.player === AI) ? PLAYER : AI

      openSet.push(
        { board: newBoard, player: nextPlayer, depth: current.depth + 1, rootMove: current.rootMove },
        f,
      )
    }
  }

  return { bestMove, bestScore, nodesExplored }
}
