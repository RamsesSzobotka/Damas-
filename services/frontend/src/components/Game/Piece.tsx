'use client'

interface Props {
  piece: number
}

export default function Piece({ piece }: Props) {
  if (piece === 0) return null

  const isPlayer = piece === 1 || piece === 3
  const isKing = piece === 3 || piece === 4
  const color = isPlayer ? '#FF4D6B' : '#F0F8FF'

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: '80%',
        height: '80%',
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}80, inset 0 -2px 4px rgba(0,0,0,0.2)`,
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
