'use client'

import { useEffect, useState } from 'react'

const COLORS = {
  spaceDark: '#0B0D2B',
  spacePanel: '#1E2547',
  magenta: '#C026D3',
  gold: '#FFD700',
  cyan: '#67E8F9',
  textWhite: '#FFFFFF',
  textSpace: '#B0E0FF',
} as const

export interface SpectatorMoveEntry {
  actor: 'player' | 'ai'
  capturedCount: number
  movedAt: Date | number
}

export interface SpectatorStatsProps {
  moveHistory: SpectatorMoveEntry[]
  startedAt: number
  isGameOver: boolean
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function SpectatorStats({ moveHistory, startedAt, isGameOver }: SpectatorStatsProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
    if (isGameOver) return
    const interval = setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt, isGameOver])

  const ia1Captures = moveHistory
    .filter((m) => m.actor === 'ai')
    .reduce((sum, m) => sum + (m.capturedCount || 0), 0)
  const ia2Captures = moveHistory
    .filter((m) => m.actor === 'player')
    .reduce((sum, m) => sum + (m.capturedCount || 0), 0)

  const totalMoves = moveHistory.length
  const nextActor = totalMoves % 2 === 0 ? 'IA 1' : 'IA 2'

  return (
    <div
      style={{
        backgroundColor: 'rgba(11, 13, 43, 0.85)',
        border: `1px solid ${COLORS.magenta}`,
        boxShadow: `0 0 10px rgba(192, 38, 211, 0.18)`,
        padding: '10px 14px',
        backdropFilter: 'blur(8px)',
        fontFamily: 'VT323, monospace',
        color: COLORS.textSpace,
        minWidth: '260px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6px 14px',
        fontSize: '15px',
      }}
    >
      <p style={{ color: COLORS.gold, textShadow: `0 0 4px ${COLORS.gold}` }}>
        🎯 Capturas IA 1: <span style={{ color: COLORS.textWhite, textShadow: 'none' }}>{ia1Captures}</span>
      </p>
      <p style={{ color: COLORS.cyan, textShadow: `0 0 4px ${COLORS.cyan}` }}>
        🎯 Capturas IA 2: <span style={{ color: COLORS.textWhite, textShadow: 'none' }}>{ia2Captures}</span>
      </p>
      <p style={{ color: COLORS.textSpace }}>
        ♟️ Jugada {totalMoves + 1} <span style={{ color: COLORS.textWhite }}>({nextActor})</span>
      </p>
      <p style={{ color: COLORS.textSpace }}>
        ⏱️ Tiempo: <span style={{ color: COLORS.textWhite }}>{formatTime(elapsed)}</span>
      </p>
    </div>
  )
}
