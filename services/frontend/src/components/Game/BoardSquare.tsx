'use client'

import Piece from './Piece'

interface Props {
  row: number
  col: number
  piece: number
  isSelected: boolean
  isValidMove: boolean
  onClick: () => void
}

export default function BoardSquare({
  row,
  col,
  piece,
  isSelected,
  isValidMove,
  onClick,
}: Props) {
  const isDark = (row + col) % 2 !== 0

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: isDark ? '#2A1B5E' : '#1E2547',
        border: isSelected
          ? '2px solid #67E8F9'
          : '1px solid transparent',
        boxShadow: isSelected
          ? '0 0 8px #67E8F9, inset 0 0 8px rgba(103, 232, 249, 0.2)'
          : 'none',
        cursor: piece !== 0 || isValidMove ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        aspectRatio: '1',
        transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      {piece !== 0 && <Piece piece={piece} />}

      {isValidMove && piece === 0 && (
        <div
          style={{
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            backgroundColor: '#67E8F9',
            opacity: 0.5,
            position: 'absolute',
          }}
        />
      )}
    </div>
  )
}
