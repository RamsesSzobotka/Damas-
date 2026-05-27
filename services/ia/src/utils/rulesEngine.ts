import {
  Board,
  Move,
  EMPTY,
  PLAYER,
  AI,
  PLAYER_KING,
  AI_KING,
  BOARD_SIZE,
} from '@models/Board'
import { cloneBoard, isInBounds } from '@utils/boardUtils'

// ─── Colour helpers ───────────────────────────────────────────────

/** Returns 1 for player pieces (1, 3), 2 for AI pieces (2, 4), 0 for empty. */
export function getPieceColor(piece: number): number {
  if (piece === PLAYER || piece === PLAYER_KING) return PLAYER
  if (piece === AI || piece === AI_KING) return AI
  return EMPTY
}

function isKing(piece: number): boolean {
  return piece === PLAYER_KING || piece === AI_KING
}

/**
 * Diagonal directions a piece can move/capture.
 * Normal pieces: one diagonal forward.
 * Kings: all four diagonals.
 */
function getDirections(color: number, king: boolean): [number, number][] {
  const dirs: [number, number][] = []
  if (king || color === PLAYER) {
    dirs.push([-1, -1], [-1, 1]) // up (player forward)
  }
  if (king || color === AI) {
    dirs.push([1, -1], [1, 1]) // down (AI forward)
  }
  return dirs
}

// ─── Logical helpers ──────────────────────────────────────────────

/** Returns all possible captures for a piece at (row, col), including multi-capture chains. */
export function getCaptures(board: Board, row: number, col: number): Move[] {
  const piece = board[row][col]
  if (piece === EMPTY) return []

  const color = getPieceColor(piece)
  const king = isKing(piece)
  const directions = getDirections(color, king)
  const results: Move[] = []

  for (const [dr, dc] of directions) {
    const enemyRow = row + dr
    const enemyCol = col + dc
    const landRow = row + 2 * dr
    const landCol = col + 2 * dc

    if (!isInBounds(landRow, landCol)) continue

    const enemyPiece = board[enemyRow][enemyCol]
    if (enemyPiece === EMPTY) continue
    if (getPieceColor(enemyPiece) === color) continue
    if (board[landRow][landCol] !== EMPTY) continue

    // In American checkers, when a piece reaches the king row the turn ends
    const reachesPromotion =
      (color === PLAYER && landRow === 0) ||
      (color === AI && landRow === BOARD_SIZE - 1)

    if (reachesPromotion) {
      results.push({
        from: [row, col],
        to: [landRow, landCol],
        captured: [[enemyRow, enemyCol]],
      })
    } else {
      // Build temporary board to explore chain captures
      const temp = cloneBoard(board)
      temp[landRow][landCol] = piece
      temp[row][col] = EMPTY
      temp[enemyRow][enemyCol] = EMPTY

      const chain = getCaptures(temp, landRow, landCol)

      if (chain.length > 0) {
        for (const c of chain) {
          results.push({
            from: [row, col],
            to: c.to,
            captured: [[enemyRow, enemyCol], ...(c.captured || [])],
          })
        }
      } else {
        results.push({
          from: [row, col],
          to: [landRow, landCol],
          captured: [[enemyRow, enemyCol]],
        })
      }
    }
  }

  return results
}

/** Returns simple (non-capture) diagonal moves for a piece. */
function getSimpleMoves(board: Board, row: number, col: number): Move[] {
  const piece = board[row][col]
  if (piece === EMPTY) return []

  const color = getPieceColor(piece)
  const king = isKing(piece)
  const directions = getDirections(color, king)
  const results: Move[] = []

  for (const [dr, dc] of directions) {
    const toRow = row + dr
    const toCol = col + dc

    if (!isInBounds(toRow, toCol)) continue
    if (board[toRow][toCol] !== EMPTY) continue

    results.push({
      from: [row, col],
      to: [toRow, toCol],
    })
  }

  return results
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * All valid moves for the piece at (row, col).
 * Captures are mandatory at the piece level — if the piece can capture,
 * only capture moves are returned.
 */
export function getValidMoves(board: Board, row: number, col: number): Move[] {
  const piece = board[row][col]
  if (piece === EMPTY) return []

  const captures = getCaptures(board, row, col)
  if (captures.length > 0) return captures

  return getSimpleMoves(board, row, col)
}

/** Returns true if the player has *any* capture available on the board. */
export function hasAnyCapture(board: Board, player: number): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (getPieceColor(board[r][c]) === player) {
        if (getCaptures(board, r, c).length > 0) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * All valid moves for a player.
 * If ANY capture exists for the player, ONLY capture moves are returned
 * (mandatory capture rule).
 */
export function getAllValidMoves(board: Board, player: number): Move[] {
  const simpleMoves: Move[] = []
  const captureMoves: Move[] = []

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (getPieceColor(board[r][c]) !== player) continue

      const caps = getCaptures(board, r, c)
      for (const cap of caps) {
        captureMoves.push(cap)
      }

      if (caps.length === 0) {
        const moves = getSimpleMoves(board, r, c)
        for (const m of moves) {
          simpleMoves.push(m)
        }
      }
    }
  }

  if (captureMoves.length > 0) return captureMoves
  return simpleMoves
}

/**
 * Checks whether the game is over.
 * Returns `{ over: true, winner }` when one side has no pieces or no valid moves.
 */
export function isGameOver(board: Board): { over: boolean; winner?: number } {
  let hasPlayer = false
  let hasAI = false

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c]
      if (p === PLAYER || p === PLAYER_KING) hasPlayer = true
      if (p === AI || p === AI_KING) hasAI = true
    }
  }

  if (!hasPlayer) return { over: true, winner: AI }
  if (!hasAI) return { over: true, winner: PLAYER }

  if (getAllValidMoves(board, PLAYER).length === 0) return { over: true, winner: AI }
  if (getAllValidMoves(board, AI).length === 0) return { over: true, winner: PLAYER }

  return { over: false }
}
