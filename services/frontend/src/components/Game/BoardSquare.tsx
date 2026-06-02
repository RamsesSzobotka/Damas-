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
  theme?: 'classic' | 'pixel' | 'cyberpunk'
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
  theme,
}: Props) {
  const isDark = (row + col) % 2 !== 0

  const getSquareStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      aspectRatio: '1',
      outline: 'none',
      cursor: piece !== 0 || isValidMove ? 'pointer' : 'default',
    }

    if (theme === 'pixel') {
      return {
        ...base,
        backgroundColor: isDark ? darkColor : lightColor,
        border: isSelected
          ? '3px solid #FFD700'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isSelected
          ? '0 0 8px #FFD700'
          : 'none',
        imageRendering: 'pixelated',
        transition: 'background-color 0.15s step-start, box-shadow 0.15s step-start, border-color 0.15s step-start',
      }
    }

    if (theme === 'cyberpunk') {
      return {
        ...base,
        backgroundColor: isDark ? darkColor : lightColor,
        border: isSelected
          ? '2px solid #FFD700'
          : `1px solid rgba(255, 255, 255, ${isDark ? '0.06' : '0.04'})`,
        boxShadow: isSelected
          ? '0 0 12px #FFD700, inset 0 0 12px rgba(255, 215, 0, 0.25)'
          : isDark
            ? 'inset 0 0 6px rgba(192, 38, 211, 0.15), 0 0 4px rgba(103, 232, 249, 0.05)'
            : 'none',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }
    }

    // Classic / default
    return {
      ...base,
      backgroundColor: isDark ? darkColor : lightColor,
      border: isSelected
        ? '2px solid #FFD700'
        : '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: isSelected
        ? '0 0 12px #FFD700, inset 0 0 12px rgba(255, 215, 0, 0.25)'
        : 'none',
      transition: 'background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    }
  }

  const getValidMoveDotStyle = (): React.CSSProperties => {
    if (theme === 'pixel') {
      return {
        width: '36%',
        height: '36%',
        borderRadius: '2px',
        backgroundColor: '#67E8F9',
        opacity: 0.65,
        position: 'absolute',
        boxShadow: '0 0 4px rgba(103, 232, 249, 0.4)',
        imageRendering: 'pixelated',
      }
    }

    if (theme === 'cyberpunk') {
      return {
        width: '36%',
        height: '36%',
        borderRadius: '50%',
        backgroundColor: '#67E8F9',
        opacity: 0.7,
        position: 'absolute',
        boxShadow: '0 0 6px #67E8F9, 0 0 12px rgba(103, 232, 249, 0.5), 0 0 20px rgba(103, 232, 249, 0.2)',
        animation: 'pulse-neon 1.5s ease-in-out infinite',
      }
    }

    // Classic / default
    return {
      width: '36%',
      height: '36%',
      borderRadius: '50%',
      backgroundColor: '#67E8F9',
      opacity: 0.65,
      position: 'absolute',
      boxShadow: '0 0 8px rgba(103, 232, 249, 0.5)',
    }
  }

  return (
    <div
      onClick={onClick}
      style={getSquareStyle()}
    >
      {piece !== 0 && <Piece piece={piece} skinColor={playerSkinColor} secondaryColor={playerSecondaryColor} theme={theme} />}

      {isValidMove && piece === 0 && (
        <div style={getValidMoveDotStyle()} />
      )}
    </div>
  )
}
