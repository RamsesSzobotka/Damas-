import { Board, Move } from '@models/Board'
import { getAllValidMoves } from '@utils/rulesEngine'

/** All valid moves for the player. If captures exist, only captures are returned. */
export function generateMoves(board: Board, player: number): Move[] {
  return getAllValidMoves(board, player)
}

/** Pick a random move from a list. Returns null for an empty list. */
export function getRandomMove(moves: Move[]): Move | null {
  if (moves.length === 0) return null
  return moves[Math.floor(Math.random() * moves.length)]
}

/** Filter moves that are captures (have a non-empty captured array). */
export function getCaptureMoves(moves: Move[]): Move[] {
  return moves.filter(m => m.captured !== undefined && m.captured.length > 0)
}
