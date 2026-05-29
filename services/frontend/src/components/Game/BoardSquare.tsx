'use client'

import Piece from './Piece'

interface Props {
  row: number
  col: number
  piece: number
  isSelected: boolean
  isValidMove: boolean
  onClick: () => void
  playerSkinColor?: string
  playerSecondaryColor?: string
  darkColor?: string
  lightColor?: string
}

export default function BoardSquare({
  row,
  col,
  piece,
  isSelected,
  isValidMove,
  onClick,
  playerSkinColor,
  playerSecondaryColor,
  darkColor = '#1A1040',
  lightColor = '#4C3F91',
}: Props) {
  const isDark = (row + col) % 2 !== 0

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: isDark ? darkColor : lightColor,
        border: isSelected
          ? '2px solid #FFD700'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isSelected
          ? '0 0 12px #FFD700, inset 0 0 12px rgba(255, 215, 0, 0.25)'
          : 'none',
        cursor: piece !== 0 || isValidMove ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        aspectRatio: '1',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        outline: 'none',
      }}
    >
      {piece !== 0 && <Piece piece={piece} skinColor={playerSkinColor} secondaryColor={playerSecondaryColor} />}

      {isValidMove && piece === 0 && (
        <div
          style={{
            width: '36%',
            height: '36%',
            borderRadius: '50%',
            backgroundColor: '#67E8F9',
            opacity: 0.65,
            position: 'absolute',
            boxShadow: '0 0 8px rgba(103, 232, 249, 0.5)',
          }}
        />
      )}
    </div>
  )
}
