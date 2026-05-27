'use client'

import { useEffect, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useGame } from '@/hooks/useGame'
import { useGameStore } from '@/stores/gameStore'
import GameBoard from '@/components/Game/GameBoard'
import bgImage from '@/assets/background/back1.png'

const COLORS = {
  spaceDark: '#0B0D2B',
  spacePanel: '#1E2547',
  magenta: '#C026D3',
  gold: '#FFD700',
  cyan: '#67E8F9',
  textWhite: '#FFFFFF',
  textSpace: '#B0E0FF',
} as const

interface Props {
  difficulty: string
}

export default function GameContainer({ difficulty }: Props) {
  const navigate = useNavigate()
  const reset = useGameStore((s) => s.reset)

  const {
    board,
    selectedPiece,
    status,
    result,
    isLoading,
    error,
    isConnected,
    currentPlayer,
    handleSquareClick,
  } = useGame(difficulty)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const handleBack = () => {
    reset()
    navigate({ to: '/game/difficulty' })
  }

  const handlePlayAgain = () => {
    reset()
    // Use window.location to force a full remount
    navigate({ to: '/game/play', search: { difficulty } })
  }

  const pieceCounts = useMemo(() => {
    const flat = board.flat()
    const player = flat.filter((p) => p === 1 || p === 3).length
    const ai = flat.filter((p) => p === 2 || p === 4).length
    return { player, ai }
  }, [board])

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: COLORS.spaceDark }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: COLORS.cyan,
              boxShadow: `0 0 8px ${COLORS.cyan}`,
            }}
          />
          <p
            style={{
              fontFamily: 'VT323, monospace',
              color: COLORS.textSpace,
              fontSize: '20px',
            }}
          >
            Iniciando partida...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ backgroundColor: COLORS.spaceDark }}
      >
        <p
          style={{
            fontFamily: 'VT323, monospace',
            color: COLORS.magenta,
            fontSize: '22px',
          }}
        >
          Error: {error}
        </p>
        <button
          onClick={handleBack}
          style={{
            backgroundColor: COLORS.spacePanel,
            border: `2px solid ${COLORS.magenta}`,
            color: COLORS.cyan,
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: `0 0 6px ${COLORS.magenta}`,
          }}
        >
          ← VOLVER
        </button>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundColor: COLORS.spaceDark,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 30%, rgba(192, 38, 211, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(103, 232, 249, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <button
          onClick={handleBack}
          style={{
            backgroundColor: COLORS.spacePanel,
            border: `2px solid ${COLORS.magenta}`,
            color: COLORS.cyan,
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: `0 0 4px ${COLORS.magenta}`,
          }}
        >
          ← SALIR
        </button>

        <div className="text-center">
          <p
            style={{
              fontFamily: 'VT323, monospace',
              color: COLORS.gold,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            {difficulty}
          </p>
          <p
            style={{
              fontFamily: 'VT323, monospace',
              color: COLORS.cyan,
              fontSize: '18px',
            }}
          >
            {status === 'gameOver'
              ? result || 'JUEGO TERMINADO'
              : currentPlayer === 1
                ? 'TU TURNO'
                : 'TURNO DE IA...'}
          </p>
        </div>

        <div style={{ width: '70px' }} />
      </div>

      {/* Connection indicator */}
      {!isConnected && status === 'playing' && (
        <div className="relative z-10 text-center py-1">
          <p
            style={{
              fontFamily: 'VT323, monospace',
              color: COLORS.magenta,
              fontSize: '14px',
            }}
          >
            Desconectado...
          </p>
        </div>
      )}

      {/* Board */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-4">
        {board && board.length > 0 ? (
          <GameBoard
            board={board}
            selectedPiece={selectedPiece}
            onSquareClick={handleSquareClick}
            validMoves={[]}
          />
        ) : (
          <p
            style={{
              fontFamily: 'VT323, monospace',
              color: COLORS.textSpace,
              fontSize: '20px',
            }}
          >
            Esperando tablero...
          </p>
        )}
      </main>

      {/* Bottom bar — piece count */}
      <div className="relative z-10 flex items-center justify-center px-4 py-3">
        <p
          style={{
            fontFamily: 'VT323, monospace',
            color: COLORS.textSpace,
            fontSize: '16px',
          }}
        >
          Tú: {pieceCounts.player} | IA: {pieceCounts.ai}
        </p>
      </div>

      {/* Game over overlay */}
      {status === 'gameOver' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
          <div
            style={{
              backgroundColor: COLORS.spacePanel,
              border: `2px solid ${COLORS.magenta}`,
              padding: '32px',
              textAlign: 'center',
              boxShadow: `0 0 20px rgba(192, 38, 211, 0.5)`,
            }}
          >
            <p
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.gold,
                fontSize: '16px',
                textShadow: `0 0 8px ${COLORS.gold}`,
                marginBottom: '20px',
              }}
            >
              {result}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePlayAgain}
                style={{
                  backgroundColor: COLORS.magenta,
                  border: `2px solid ${COLORS.cyan}`,
                  color: COLORS.textWhite,
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  cursor: 'pointer',
                  boxShadow: `0 0 12px ${COLORS.magenta}`,
                }}
              >
                JUGAR DE NUEVO
              </button>
              <button
                onClick={handleBack}
                style={{
                  backgroundColor: COLORS.spacePanel,
                  border: `2px solid ${COLORS.magenta}`,
                  color: COLORS.cyan,
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  cursor: 'pointer',
                }}
              >
                SALIR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
