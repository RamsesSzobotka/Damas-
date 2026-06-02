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
  playerSkinColor?: string
  playerSecondaryColor?: string
  boardDarkColor?: string
  boardLightColor?: string
  theme?: 'classic' | 'pixel' | 'cyberpunk'
}

export default function GameBoard({
  board,
  selectedPiece,
  onSquareClick,
  validMoves,
  moveAnimation,
  playerSkinColor,
  playerSecondaryColor,
  boardDarkColor,
  boardLightColor,
  theme,
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

  const getContainerStyle = (): React.CSSProperties => {
    if (theme === 'pixel') {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        overflow: 'hidden',
        border: '4px solid #8B4513',
        boxShadow: '4px 4px 0 #5C2E0A, 8px 8px 0 rgba(139, 69, 19, 0.15), 0 0 12px rgba(139, 69, 19, 0.2)',
        imageRendering: 'pixelated',
      }
    }

    if (theme === 'cyberpunk') {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid #FF00FF',
        boxShadow: '0 0 4px #FF00FF, 0 0 12px #FF00FF88, 0 0 24px #FF00FF44, 0 0 40px #FF00FF22, inset 0 0 8px rgba(255, 0, 255, 0.05)',
        animation: 'pulse-neon-border 2s ease-in-out infinite',
      }
    }

    // Classic / default
    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      width: '100%',
      maxWidth: '480px',
      position: 'relative',
      overflow: 'hidden',
      border: '2px solid #C026D3',
      boxShadow: '0 0 12px rgba(192, 38, 211, 0.3)',
    }
  }

  return (
    <div style={getContainerStyle()}>
      {board.map((row, rowIdx) =>
        row.map((piece, colIdx) => {
          // Hide the piece if it's being animated
          const isAnimatingPiece =
            moveAnimation &&
            moveAnimation.from[0] === rowIdx &&
            moveAnimation.from[1] === colIdx

          return (
            <BoardSquare
              key={`${rowIdx}-${colIdx}`}
              row={rowIdx}
              col={colIdx}
              piece={isAnimatingPiece ? 0 : piece}
              isSelected={
                selectedPiece?.[0] === rowIdx && selectedPiece?.[1] === colIdx
              }
              isValidMove={validSet.has(`${rowIdx},${colIdx}`)}
              onClick={() => onSquareClick(rowIdx, colIdx)}
              playerSkinColor={playerSkinColor}
              playerSecondaryColor={playerSecondaryColor}
              darkColor={boardDarkColor}
              lightColor={boardLightColor}
              theme={theme}
            />
          )
        }),
      )}

      {/* Animation layer */}
      {moveAnimation && (
        <div
          style={{
            position: 'absolute',
            left: `${moveAnimation.from[1] * 12.5}%`,
            top: `${moveAnimation.from[0] * 12.5}%`,
            width: '12.5%',
            height: '12.5%',
            pointerEvents: 'none',
            zIndex: 10,
            animation: `piece-move ${moveAnimation.durationMs}ms ease-in-out forwards`,
            ['--from-x' as never]: '0',
            ['--from-y' as never]: '0',
            ['--to-x' as never]: `${(moveAnimation.to[1] - moveAnimation.from[1]) * 100}%`,
            ['--to-y' as never]: `${(moveAnimation.to[0] - moveAnimation.from[0]) * 100}%`,
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
              <Piece piece={moveAnimation.piece} skinColor={playerSkinColor} secondaryColor={playerSecondaryColor} theme={theme} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
