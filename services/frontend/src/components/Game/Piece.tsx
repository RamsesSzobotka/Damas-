'use client'

interface Props {
  piece: number
  skinColor?: string
  secondaryColor?: string
}

export default function Piece({ piece, skinColor, secondaryColor }: Props) {
  if (piece === 0) return null

  const isPlayer = piece === 1 || piece === 3
  const isKing = piece === 3 || piece === 4

  const color = isPlayer
    ? skinColor || '#FF4D6B'
    : '#F0F8FF'
  const secColor = isPlayer && secondaryColor
    ? secondaryColor
    : isPlayer ? '#FF4D6B' : '#F0F8FF'

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: '80%',
        height: '80%',
        borderRadius: '50%',
        background: isPlayer
          ? `radial-gradient(circle at 35% 35%, ${color}, ${secColor})`
          : color,
        boxShadow: isPlayer
          ? `0 0 8px ${color}80, inset 0 -2px 4px rgba(0,0,0,0.2)`
          : `0 0 8px ${color}80, inset 0 -2px 4px rgba(0,0,0,0.2)`,
        border: `2px solid ${color}`,
      }}
    >
      {isKing && (
        <span
          style={{
            fontSize: '0.7em',
            fontWeight: 'bold',
            color: isPlayer ? '#FFFFFF' : '#333333',
            textShadow: isPlayer ? '0 0 4px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          K
        </span>
      )}
    </div>
  )
}
