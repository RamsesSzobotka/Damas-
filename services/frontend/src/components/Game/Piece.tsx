'use client'

interface Props {
  piece: number
  skinColor?: string
  secondaryColor?: string
  theme?: 'classic' | 'pixel' | 'cyberpunk'
}

export default function Piece({ piece, skinColor, secondaryColor, theme }: Props) {
  if (piece === 0) return null

  const isPlayer = piece === 1 || piece === 3
  const isKing = piece === 3 || piece === 4

  const color = isPlayer
    ? skinColor || '#FF4D6B'
    : '#F0F8FF'
  const secColor = isPlayer && secondaryColor
    ? secondaryColor
    : isPlayer ? '#FF4D6B' : '#F0F8FF'

  // -- Pixel theme --
  if (theme === 'pixel') {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          width: '80%',
          height: '80%',
          borderRadius: '4px',
          imageRendering: 'pixelated',
          background: isPlayer
            ? `linear-gradient(135deg, ${color}, ${secColor})`
            : color,
          boxShadow: isPlayer
            ? `2px 2px 0 ${color}88, -2px -2px 0 ${color}44, 0 0 6px ${color}66, inset 0 -2px 4px rgba(0,0,0,0.3)`
            : `2px 2px 0 rgba(255,255,255,0.2), -2px -2px 0 rgba(255,255,255,0.1), 0 0 6px ${color}66, inset 0 -2px 4px rgba(0,0,0,0.3)`,
          border: `2px solid ${color}`,
        }}
      >
        {isKing && (
          <span
            style={{
              fontSize: '0.75em',
              fontWeight: 'bold',
              fontFamily: '"Press Start 2P", monospace',
              color: isPlayer ? '#FFFFFF' : '#333333',
              textShadow: isPlayer ? '0 0 4px rgba(0,0,0,0.5)' : 'none',
              imageRendering: 'pixelated',
            }}
          >
            ★
          </span>
        )}
      </div>
    )
  }

  // -- Cyberpunk theme --
  if (theme === 'cyberpunk') {
    const neonColor = isPlayer ? (skinColor || '#FF4D6B') : '#00FFFF'
    const neonSecondary = isPlayer ? (secondaryColor || '#FF4D6B') : '#FF00FF'
    return (
      <div
        className="flex items-center justify-center"
        style={{
          width: '80%',
          height: '80%',
          borderRadius: '50%',
          background: isPlayer
            ? `radial-gradient(circle at 30% 30%, ${neonColor}, ${neonSecondary})`
            : `radial-gradient(circle at 30% 30%, ${neonColor}, #0B0D2B)`,
          boxShadow: isPlayer
            ? `0 0 4px ${neonColor}, 0 0 12px ${neonColor}, 0 0 24px ${neonColor}88, 0 0 40px ${neonSecondary}44, inset 0 -2px 4px rgba(0,0,0,0.4)`
            : `0 0 4px ${neonColor}, 0 0 12px ${neonColor}, 0 0 24px ${neonColor}66, inset 0 -2px 4px rgba(0,0,0,0.4)`,
          border: `2px solid ${neonColor}`,
          outline: `1px solid ${neonSecondary}66`,
          outlineOffset: '2px',
        }}
      >
        {isKing && (
          <span
            style={{
              fontSize: '0.75em',
              fontWeight: 'bold',
              color: '#FFFFFF',
              textShadow: `0 0 8px ${neonColor}, 0 0 16px ${neonSecondary}`,
            }}
          >
            ⚡
          </span>
        )}
      </div>
    )
  }

  // -- Classic / default theme --
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
