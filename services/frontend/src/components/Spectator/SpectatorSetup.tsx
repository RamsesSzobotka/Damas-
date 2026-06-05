'use client'

import { useState } from 'react'
import { playButtonSound } from '@/utils/playButtonSound'

const COLORS = {
  spaceDark: '#0B0D2B',
  spacePanel: '#1E2547',
  magenta: '#C026D3',
  gold: '#FFD700',
  cyan: '#67E8F9',
  textWhite: '#FFFFFF',
  textSpace: '#B0E0FF',
} as const

const pixelFont = {
  WebkitFontSmoothing: 'none',
  MozOsxFontSmoothing: 'unset',
} as React.CSSProperties

export interface SpectatorDifficulty {
  icon: string
  label: string
  value: string
  description: string
}

interface SpectatorSetupProps {
  difficulties: SpectatorDifficulty[]
  selectedDifficulty: string
  onSelect: (difficulty: string) => void
}

interface SpectatorDifficultyCardProps {
  icon: string
  label: string
  description: string
  onClick: () => void
  isActive: boolean
  index: number
}

function SpectatorDifficultyCard({
  icon,
  label,
  description,
  onClick,
  isActive,
  index,
}: SpectatorDifficultyCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const bgColor = isPressed
    ? '#2A1B5E'
    : isHovered
      ? COLORS.magenta
      : COLORS.spacePanel

  const borderGlow = isHovered
    ? `0 0 12px ${COLORS.cyan}, 0 0 24px ${COLORS.magenta}`
    : `0 0 4px ${COLORS.magenta}`

  return (
    <div
      style={{
        animation: 'float 3s ease-in-out infinite',
        animationDelay: `${0.3 + index * 0.25}s`,
      }}
    >
      <button
        onClick={() => {
          playButtonSound()
          onClick()
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => {
          setIsHovered(false)
          setIsPressed(false)
        }}
        onMouseEnter={() => setIsHovered(true)}
        className="w-72 group transition-all duration-200"
        style={pixelFont}
        aria-pressed={isActive}
      >
        <div
          className="px-5 py-4 flex items-center gap-4"
          style={{
            backgroundColor: bgColor,
            border: `2px solid ${isActive ? COLORS.gold : isHovered ? COLORS.cyan : COLORS.magenta}`,
            boxShadow: isActive
              ? `0 0 14px ${COLORS.gold}, 0 0 28px ${COLORS.magenta}`
              : borderGlow,
            cursor: 'pointer',
            transform: isPressed ? 'scale(0.97)' : isHovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <span
            className="text-3xl"
            style={{
              filter: isHovered ? 'drop-shadow(0 0 6px #67E8F9)' : 'none',
            }}
          >
            {icon}
          </span>
          <div className="flex-1 text-left">
            <p
              className="text-sm font-bold uppercase tracking-widest"
              style={{
                color: isHovered ? COLORS.textWhite : COLORS.cyan,
                textShadow: isHovered ? `0 0 8px ${COLORS.cyan}` : 'none',
              }}
            >
              {label}
            </p>
            <p
              className="text-xs uppercase tracking-wider opacity-80"
              style={{
                fontFamily: 'VT323, monospace',
                color: COLORS.textSpace,
                fontSize: '14px',
              }}
            >
              {description}
            </p>
          </div>
          <span
            className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: COLORS.gold, textShadow: `0 0 8px ${COLORS.gold}` }}
          >
            →
          </span>
        </div>
      </button>
    </div>
  )
}

export default function SpectatorSetup({
  difficulties,
  selectedDifficulty,
  onSelect,
}: SpectatorSetupProps) {
  return (
    <div
      className="backdrop-blur-sm"
      style={{
        borderRadius: '4px',
        border: `2px solid ${COLORS.magenta}`,
        padding: '24px',
        boxShadow: `
          0 0 16px rgba(192, 38, 211, 0.3),
          0 0 32px rgba(103, 232, 249, 0.1),
          inset 0 0 16px rgba(192, 38, 211, 0.05)
        `,
        backgroundColor: 'rgba(30, 37, 71, 0.6)',
      }}
    >
      <div className="text-center mb-4">
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            color: COLORS.gold,
            textShadow: `0 0 8px ${COLORS.gold}`,
            ...pixelFont,
          }}
        >
          SELECCIONA
        </p>
        <p
          className="text-xs uppercase tracking-[0.2em] mt-1"
          style={{
            fontFamily: 'VT323, monospace',
            color: COLORS.textSpace,
            fontSize: '16px',
          }}
        >
          DIFICULTAD
        </p>
      </div>

      <div className="flex flex-col gap-3 items-center">
        {difficulties.map((d, i) => (
          <SpectatorDifficultyCard
            key={d.value}
            icon={d.icon}
            label={d.label}
            description={d.description}
            onClick={() => onSelect(d.value)}
            isActive={selectedDifficulty === d.value}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
