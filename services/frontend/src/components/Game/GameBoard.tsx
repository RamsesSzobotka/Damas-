'use client'

import { useMemo } from 'react'
import BoardSquare from './BoardSquare'
import Piece from './Piece'
import { calculateValidMoves } from '@/utils/checkersMoves'

interface Props {
  board: number[][]
  selectedPiece: [number, number] | null
  onSquareClick: (row: number, col: number) => void
  validMoves: [number, number][]
  moveAnimation?: {
    from: [number, number]
    to: [number, number]
    piece: number
    actor: 'player' | 'ai'
    delayMs: number
    durationMs: number
  } | null
}

export default function GameBoard({
  board,
  selectedPiece,
  onSquareClick,
  validMoves,
  moveAnimation,
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

  const animationDelta = moveAnimation
    ? {
        dx: `${(moveAnimation.to[1] - moveAnimation.from[1]) * 100}%`,
        dy: `${(moveAnimation.to[0] - moveAnimation.from[0]) * 100}%`,
      }
    : null

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        overflow: 'hidden',
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

      {moveAnimation && animationDelta && (
        <>
          <div
            style={{
              position: 'absolute',
              left: `${moveAnimation.from[1] * 12.5}%`,
              top: `${moveAnimation.from[0] * 12.5}%`,
              width: '12.5%',
              height: '12.5%',
              pointerEvents: 'none',
              zIndex: 4,
              animation: `move-travel ${moveAnimation.durationMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${moveAnimation.delayMs}ms forwards`,
              ['--move-dx' as never]: animationDelta.dx,
              ['--move-dy' as never]: animationDelta.dy,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '80%', height: '80%' }}>
                <Piece piece={moveAnimation.piece} />
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: `${moveAnimation.to[1] * 12.5}%`,
              top: `${moveAnimation.to[0] * 12.5}%`,
              width: '12.5%',
              height: '12.5%',
              pointerEvents: 'none',
              zIndex: 3,
              borderRadius: '50%',
              border: `1px solid ${moveAnimation.actor === 'ai' ? '#F0F8FF' : '#67E8F9'}`,
              animation: `move-pulse ${moveAnimation.durationMs}ms ease-in-out ${moveAnimation.delayMs}ms`,
            }}
          />
        </>
      )}
    </div>
  )
}
