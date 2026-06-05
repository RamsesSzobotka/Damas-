'use client'

import { useId } from 'react'

const COLORS = {
  spaceDark: '#0B0D2B',
  spacePanel: '#1E2547',
  magenta: '#C026D3',
  gold: '#FFD700',
  cyan: '#67E8F9',
  textWhite: '#FFFFFF',
  textSpace: '#B0E0FF',
} as const

export interface SpeedControlProps {
  delayMs: number
  onChange: (ms: number) => void
  min?: number
  max?: number
  step?: number
}

export default function SpeedControl({
  delayMs,
  onChange,
  min = 200,
  max = 2000,
  step = 100,
}: SpeedControlProps) {
  const id = useId()
  const clampedMs = Math.min(Math.max(delayMs, min), max)
  const fillPercent = ((clampedMs - min) / (max - min)) * 100

  return (
    <div
      style={{
        backgroundColor: 'rgba(11, 13, 43, 0.85)',
        border: `1px solid ${COLORS.cyan}`,
        boxShadow: `0 0 10px rgba(103, 232, 249, 0.18)`,
        padding: '10px 14px',
        backdropFilter: 'blur(8px)',
        fontFamily: 'VT323, monospace',
        color: COLORS.textSpace,
        minWidth: '260px',
      }}
    >
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: '15px',
          color: COLORS.cyan,
          textShadow: `0 0 6px ${COLORS.cyan}`,
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        ⚡ Velocidad: {clampedMs}ms entre jugadas
      </label>
      <div
        style={{
          position: 'relative',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: 'rgba(103, 232, 249, 0.18)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${fillPercent}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${COLORS.cyan} 0%, ${COLORS.gold} 100%)`,
              boxShadow: `0 0 6px ${COLORS.gold}`,
              transition: 'width 0.08s linear',
            }}
          />
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampedMs}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'relative',
            width: '100%',
            appearance: 'none',
            WebkitAppearance: 'none',
            background: 'transparent',
            accentColor: COLORS.gold,
            cursor: 'pointer',
            height: '18px',
            margin: 0,
            padding: 0,
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: COLORS.textSpace,
          opacity: 0.7,
          marginTop: '4px',
        }}
      >
        <span>{min}ms · rápido</span>
        <span>{max}ms · lento</span>
      </div>
    </div>
  )
}
