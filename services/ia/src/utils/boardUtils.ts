import { Board, Move, EMPTY, PLAYER, AI, PLAYER_KING, AI_KING, BOARD_SIZE } from '@models/Board'

/**
 * Creates a standard 8×8 checkers starting board.
 * Rows 0-2: AI pieces (2) on dark squares (row+col odd).
 * Rows 3-4: empty.
 * Rows 5-7: Player pieces (1) on dark squares.
 */
export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    new Array(BOARD_SIZE).fill(EMPTY),
  )

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 1) {
        if (row < 3) {
          board[row][col] = AI
        } else if (row > 4) {
          board[row][col] = PLAYER
        }
      }
    }
  }

  return board
}

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
