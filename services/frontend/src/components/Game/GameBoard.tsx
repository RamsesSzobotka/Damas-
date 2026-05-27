'use client'

import { useMemo } from 'react'
import BoardSquare from './BoardSquare'

interface Props {
  board: number[][]
  selectedPiece: [number, number] | null
  onSquareClick: (row: number, col: number) => void
  validMoves: [number, number][]
}

function calculateValidMoves(
  board: number[][],
  selectedPiece: [number, number] | null,
): [number, number][] {
  if (!selectedPiece) return []

  const [row, col] = selectedPiece
  const piece = board[row]?.[col]
  if (!piece || piece === 0) return []

  const isPlayer = piece === 1 || piece === 3
  const isKing = piece === 3 || piece === 4

  if (!isPlayer) return []

  const directions: [number, number][] = []

  if (isKing) {
    directions.push([-1, -1], [-1, 1], [1, -1], [1, 1])
  } else {
    // Player moves upward (decreasing row)
    directions.push([-1, -1], [-1, 1])
  }

  const moves: [number, number][] = []

  for (const [dr, dc] of directions) {
    const nr = row + dr
    const nc = col + dc

    // Simple move to empty square
    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === 0) {
      moves.push([nr, nc])
    }

    // Capture move: jump over enemy piece
    const cr = row + 2 * dr
    const cc = col + 2 * dc
    const midPiece = board[nr]?.[nc]

    if (
      cr >= 0 &&
      cr < 8 &&
      cc >= 0 &&
      cc < 8 &&
      midPiece !== 0 &&
      midPiece !== undefined &&
      midPiece !== piece &&
      (midPiece === 2 || midPiece === 4) &&
      board[cr][cc] === 0
    ) {
      moves.push([cr, cc])
    }
  }

  return moves
}

export default function GameBoard({
  board,
  selectedPiece,
  onSquareClick,
  validMoves,
}: Props) {
  const moves = useMemo(
    () =>
      validMoves.length > 0 ? validMoves : calculateValidMoves(board, selectedPiece),
    [board, selectedPiece, validMoves],
  )

  const validSet = useMemo(
    () => new Set(moves.map(([r, c]) => `${r},${c}`)),
    [moves],
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        width: '100%',
        maxWidth: '480px',
        border: '2px solid #C026D3',
        boxShadow: '0 0 12px rgba(192, 38, 211, 0.3)',
      }}
    >
      {board.map((row, rowIdx) =>
        row.map((piece, colIdx) => (
          <BoardSquare
            key={`${rowIdx}-${colIdx}`}
            row={rowIdx}
            col={colIdx}
            piece={piece}
            isSelected={
              selectedPiece?.[0] === rowIdx && selectedPiece?.[1] === colIdx
            }
            isValidMove={validSet.has(`${rowIdx},${colIdx}`)}
            onClick={() => onSquareClick(rowIdx, colIdx)}
          />
        )),
      )}
    </div>
  )
}
