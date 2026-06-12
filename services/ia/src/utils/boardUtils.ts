import { Board, Move, EMPTY, PLAYER, AI, PLAYER_KING, AI_KING, BOARD_SIZE } from '@models/Board'

/** Deep clone of the board matrix. */
export function cloneBoard(board: Board): Board {
  return board.map(row => [...row])
}

/**
 * Applies a move to a board clone and returns the new board.
 * Removes captured pieces and promotes to king when reaching the king row.
 */
export function applyMove(board: Board, move: Move): Board {
  const newBoard = cloneBoard(board)
  const [fromRow, fromCol] = move.from
  const [toRow, toCol] = move.to
  const piece = newBoard[fromRow][fromCol]

  // Move the piece
  newBoard[toRow][toCol] = piece
  newBoard[fromRow][fromCol] = EMPTY

  // Remove captured pieces
  if (move.captured) {
    for (const [cr, cc] of move.captured) {
      newBoard[cr][cc] = EMPTY
    }
  }

  // Promote to king when reaching the opposite end
  if (piece === PLAYER && toRow === 0) {
    newBoard[toRow][toCol] = PLAYER_KING
  } else if (piece === AI && toRow === BOARD_SIZE - 1) {
    newBoard[toRow][toCol] = AI_KING
  }

  return newBoard
}

/** Returns true if (row, col) is within the 8×8 board. */
export function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}
