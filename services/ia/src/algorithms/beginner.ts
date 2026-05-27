import { Board, Move, AI } from '@models/Board'
import { getAllValidMoves } from '@utils/rulesEngine'
import { getCaptureMoves, getRandomMove } from '@algorithms/moveGenerator'

/**
 * Beginner AI strategy:
 *   1. If any capture move exists → execute the first available capture.
 *   2. Otherwise → pick a random valid move.
 * Returns null if no moves are available.
 */
export function getBeginnerMove(board: Board, player: number = AI): Move | null {
  const moves = getAllValidMoves(board, player)
  if (moves.length === 0) return null

  const captures = getCaptureMoves(moves)
  if (captures.length > 0) {
    return captures[0]
  }

  return getRandomMove(moves)
}
