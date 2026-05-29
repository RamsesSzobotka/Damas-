'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUser, useAuth } from '@clerk/tanstack-react-start'
import { useGame } from '@/hooks/useGame'
import { useGameStore } from '@/stores/gameStore'
import GameBoard from '@/components/Game/GameBoard'
import Stars from '@/components/ui/Stars'
import bgImage from '@/assets/background/backPlay.png'

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
  routeMode?: 'ranked' | 'practice'
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/** Colores por liga */
const LEAGUE_COLORS: Record<string, string> = {
  Principiante: '#67E8F9',
  Intermedio: '#C026D3',
  Master: '#FFD700',
  'Elite Cósmica': '#FF4500',
}

const LEAGUE_ICONS: Record<string, string> = {
  Principiante: '🌌',
  Intermedio: '⚡',
  Master: '🧠',
  'Elite Cósmica': '👾',
}

export default function GameContainer({ difficulty, routeMode = 'practice' }: Props) {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const { getToken } = useAuth()
  const reset = useGameStore((s) => s.reset)
  const [playerSkinColor, setPlayerSkinColor] = useState<string | undefined>()
  const [playerSecondaryColor, setPlayerSecondaryColor] = useState<string | undefined>()
  const [playerLeague, setPlayerLeague] = useState<string | null>(null)
  const [playerPoints, setPlayerPoints] = useState<number>(0)

  // Modo: viene del search param (routeMode). Ranked solo si autenticado.
  const mode = routeMode === 'ranked' && isSignedIn ? 'ranked' : 'practice'

  const getAuthToken = useMemo(
    () => isSignedIn ? async () => { try { return await getToken() } catch { return null } } : undefined,
    [isSignedIn, getToken],
  )

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
    rankingUpdate,
  } = useGame(difficulty, mode, getAuthToken)

  // Fetch equipped skin
  useEffect(() => {
    if (!isSignedIn) return
    ;(async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${API_BASE}/api/shop/owned-skins`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          const equipped = data.ownedSkins?.find((s: any) => s.isEquipped)
          if (equipped) {
            setPlayerSkinColor(equipped.primaryColor)
            setPlayerSecondaryColor(equipped.secondaryColor)
          }
        }
      } catch {}
    })()
  }, [isSignedIn, getToken])

  // Cleanup on unmount
  // Fetch player's ranking info if ranked and signed in
  useEffect(() => {
    if (!isSignedIn || mode !== 'ranked') return
    ;(async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${API_BASE}/api/rankings/position`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setPlayerLeague(data.league.name)
          setPlayerPoints(data.totalPoints)
        }
      } catch {}
    })()
  }, [isSignedIn, mode, getToken])

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const handleBack = () => {
    reset()
    navigate({ to: '/' })
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
        backgroundAttachment: 'fixed',
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
      <Stars />

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
              {playerLeague && mode === 'ranked' && (
                <p style={{ color: LEAGUE_COLORS[playerLeague] || COLORS.cyan }}>
                  {LEAGUE_ICONS[playerLeague] || ''} {playerLeague} · {playerPoints} pts
                </p>
              )}
              <p>IA: {difficulty}</p>
              <p>Tiempo: {formatTime(elapsed)}</p>
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
                Rendirse
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
                playerSkinColor={playerSkinColor}
                playerSecondaryColor={playerSecondaryColor}
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
              maxWidth: '420px',
            }}
          >
            <p
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: COLORS.gold,
                fontSize: '16px',
                textShadow: `0 0 8px ${COLORS.gold}`,
                marginBottom: '16px',
              }}
            >
              {result === 'victory' ? 'VICTORIA' : result === 'defeat' ? 'DERROTA' : result}
            </p>

            {/* Ranking result */}
            {rankingUpdate && (
              <div
                style={{
                  backgroundColor: 'rgba(11, 13, 43, 0.8)',
                  border: `1px solid ${rankingUpdate.pointsEarned > 0 ? COLORS.cyan : COLORS.magenta}`,
                  padding: '14px',
                  marginBottom: '20px',
                }}
              >
                <p style={{ fontFamily: 'VT323, monospace', color: rankingUpdate.pointsEarned > 0 ? COLORS.cyan : COLORS.magenta, fontSize: '24px' }}>
                  {rankingUpdate.pointsEarned > 0 ? '+' : ''}{rankingUpdate.pointsEarned} pts
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px', fontFamily: 'VT323, monospace', fontSize: '16px' }}>
                  <span>
                    <span style={{ color: COLORS.textSpace }}>Liga: </span>
                    <span style={{ color: LEAGUE_COLORS[rankingUpdate.leagueBefore] || COLORS.cyan }}>
                      {rankingUpdate.leagueBefore}
                    </span>
                    {rankingUpdate.leagueBefore !== rankingUpdate.leagueAfter && (
                      <>
                        <span style={{ color: COLORS.textSpace }}> → </span>
                        <span style={{ color: LEAGUE_COLORS[rankingUpdate.leagueAfter] || COLORS.gold, textShadow: `0 0 6px ${COLORS.gold}` }}>
                          {rankingUpdate.leagueAfter}
                        </span>
                      </>
                    )}
                  </span>
                </div>
                <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textSpace, fontSize: '15px', marginTop: '6px' }}>
                  Total: {rankingUpdate.totalPoints} pts · Racha: {rankingUpdate.streak}
                </p>
              </div>
            )}

            {/* Time and moves summary */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '20px',
                fontFamily: 'VT323, monospace',
                fontSize: '15px',
                color: COLORS.textSpace,
              }}
            >
              <span>Tiempo: {formatTime(elapsed)}</span>
              <span>Movimientos: {moveHistory.length}</span>
            </div>

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
