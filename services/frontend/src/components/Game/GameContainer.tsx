'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
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
    moveAnimation,
    moveHistory,
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

  const turnLabel =
    status === 'gameOver'
      ? result || 'JUEGO TERMINADO'
      : currentPlayer === 1
        ? 'TU TURNO'
        : 'TURNO DE IA'

  const recentMoves = [...moveHistory].slice(-8).reverse()

  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (status === 'gameOver') {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

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
      <div className="relative z-10 px-4 pt-4">
        <div
          className="grid gap-3 md:grid-cols-[1fr_auto_1fr] items-stretch"
          style={{
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(30, 37, 71, 0.8)',
              border: `1px solid ${COLORS.cyan}`,
              boxShadow: `0 0 12px rgba(103, 232, 249, 0.18)`,
              padding: '12px 14px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p style={{ fontFamily: 'VT323, monospace', color: COLORS.cyan, fontSize: '16px' }}>
              YOU
            </p>
            <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textWhite, fontSize: '20px' }}>
              Red Cosmic
            </p>
            <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textSpace, fontSize: '15px' }}>
              Fichas: {pieceCounts.player}
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(11, 13, 43, 0.88)',
              border: `1px solid ${COLORS.gold}`,
              boxShadow: `0 0 16px rgba(255, 215, 0, 0.15)`,
              padding: '12px 18px',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p style={{ fontFamily: 'VT323, monospace', color: COLORS.gold, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              {difficulty}
            </p>
            <p style={{ fontFamily: 'VT323, monospace', color: COLORS.cyan, fontSize: '22px' }}>
              {turnLabel}
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(30, 37, 71, 0.8)',
              border: `1px solid ${COLORS.magenta}`,
              boxShadow: `0 0 12px rgba(192, 38, 211, 0.18)`,
              padding: '12px 14px',
              textAlign: 'right',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p style={{ fontFamily: 'VT323, monospace', color: COLORS.magenta, fontSize: '16px' }}>
              IA
            </p>
            <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textWhite, fontSize: '20px' }}>
              {difficulty}
            </p>
            <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textSpace, fontSize: '15px' }}>
              Fichas: {pieceCounts.ai}
            </p>

          </div>
        </div>
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

      {/* Board and side panels */}
      <main className="relative z-10 flex-1 px-4 py-4">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_220px] items-start h-full">
          <aside
            style={{
              backgroundColor: 'rgba(30, 37, 71, 0.76)',
              border: `1px solid ${COLORS.cyan}`,
              boxShadow: `0 0 12px rgba(103, 232, 249, 0.12)`,
              padding: '14px',
              backdropFilter: 'blur(8px)',
              animation: 'float 5s ease-in-out infinite',
            }}
          >
            <p style={{ fontFamily: 'VT323, monospace', color: COLORS.gold, fontSize: '16px', marginBottom: '10px' }}>
              CONTROL
            </p>
            <div style={{ display: 'grid', gap: '8px', color: COLORS.textSpace, fontFamily: 'VT323, monospace', fontSize: '15px' }}>
              <p>IA: {difficulty}</p>
              <p>Tiempo: {formatTime(elapsed)}</p>
              <p>Capturas: visibles</p>
              <p>Jugador: {pieceCounts.player}</p>
              <p>IA: {pieceCounts.ai}</p>
            </div>
            <div style={{ marginTop: '12px', display: 'grid', gap: '8px' }}>
              <button
                onClick={handleBack}
                style={{
                  backgroundColor: COLORS.magenta,
                  border: `1px solid ${COLORS.cyan}`,
                  color: COLORS.textWhite,
                  padding: '8px 10px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                Menú
              </button>
              <button
                onClick={handlePlayAgain}
                style={{
                  backgroundColor: COLORS.spacePanel,
                  border: `1px solid ${COLORS.gold}`,
                  color: COLORS.gold,
                  padding: '8px 10px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                Reiniciar
              </button>
            </div>
          </aside>

          <section className="flex items-center justify-center">
            {board && board.length > 0 ? (
              <GameBoard
                board={board}
                selectedPiece={selectedPiece}
                onSquareClick={handleSquareClick}
                validMoves={[]}
                moveAnimation={moveAnimation}
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
          </section>

          <aside
            style={{
              backgroundColor: 'rgba(30, 37, 71, 0.76)',
              border: `1px solid ${COLORS.cyan}`,
              boxShadow: `0 0 12px rgba(103, 232, 249, 0.12)`,
              padding: '14px',
              backdropFilter: 'blur(8px)',
              animation: 'float 5s ease-in-out infinite',
              animationDelay: '0.2s',
            }}
          >
            <p style={{ fontFamily: 'VT323, monospace', color: COLORS.gold, fontSize: '16px', marginBottom: '10px' }}>
              HISTORIAL
            </p>
            <div style={{ display: 'grid', gap: '8px', maxHeight: '460px', overflowY: 'auto' }}>
              {recentMoves.length === 0 ? (
                <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textSpace, fontSize: '15px' }}>
                  Sin movimientos aún.
                </p>
              ) : (
                recentMoves.map((entry, index) => (
                  <div
                    key={`${entry.player}-${index}-${entry.from.join('-')}-${entry.to.join('-')}`}
                    style={{
                      backgroundColor: 'rgba(11, 13, 43, 0.6)',
                      border: `1px solid ${entry.player === 'player' ? COLORS.cyan : COLORS.magenta}`,
                      padding: '8px 10px',
                      color: COLORS.textWhite,
                      fontFamily: 'VT323, monospace',
                      fontSize: '15px',
                      animation: 'float 3.6s ease-in-out infinite',
                      animationDelay: `${index * 0.12}s`,
                    }}
                  >
                    <p style={{ color: entry.player === 'player' ? COLORS.cyan : COLORS.gold }}>
                      {entry.player === 'player' ? 'JUGADOR' : 'IA'}
                    </p>
                    <p>
                      {entry.from[0]},{entry.from[1]} → {entry.to[0]},{entry.to[1]}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
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
          Tú: {pieceCounts.player} | IA: {pieceCounts.ai} | {turnLabel}
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
