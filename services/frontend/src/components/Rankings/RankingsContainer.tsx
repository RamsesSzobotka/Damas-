'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUser, useAuth } from '@clerk/tanstack-react-start'
import Stars from '@/components/ui/Stars'
import bgImage from '@/assets/background/back1.png'

const COLORS = {
  spaceDark: '#0B0D2B',
  spacePanel: '#1E2547',
  magenta: '#C026D3',
  gold: '#FFD700',
  cyan: '#67E8F9',
  textWhite: '#FFFFFF',
  textSpace: '#B0E0FF',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
} as const

const pixelFont = {
  WebkitFontSmoothing: 'none',
  MozOsxFontSmoothing: 'unset',
} as React.CSSProperties

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface RankingEntry {
  rank: number
  username: string
  league: {
    name: string
    title: string
    icon: string
    minPoints: number
    maxPoints: number | string
    difficulty: string
  }
  title: string | null
  totalPoints: number
  victories: number
  totalGames: number
  winRate: number
  currentStreak: number
  bestStreak: number
  averageMovements: number
}

interface MyStats {
  rank: number
  username: string
  totalPoints: number
  league: {
    name: string
    icon: string
    difficulty: string
    minPoints: number
    maxPoints: number | string
  }
  nextLeaguePoints: number | null
  stats: {
    totalVictories: number
    totalDefeats: number
    totalGames: number
    winRate: number
    currentStreak: number
    bestStreak: number
  }
}

const LEAGUE_COLORS: Record<string, string> = {
  Principiante: '#67E8F9',
  Intermedio: '#C026D3',
  Master: '#FFD700',
  'Elite Cósmica': '#FF4500',
}

const TOP_3_BORDERS = [
  { shadow: `0 0 20px ${COLORS.gold}, 0 0 40px #FFD700`, color: COLORS.gold, label: '#1' },
  { shadow: `0 0 15px ${COLORS.silver}, 0 0 30px #C0C0C0`, color: COLORS.silver, label: '#2' },
  { shadow: `0 0 12px ${COLORS.bronze}, 0 0 24px #CD7F32`, color: COLORS.bronze, label: '#3' },
]

export default function RankingsContainer() {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const { getToken } = useAuth()
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [myStats, setMyStats] = useState<MyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [myPosition, setMyPosition] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const fetchRankings = useCallback(async (token?: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/rankings?limit=100`)
      if (res.ok) {
        const data = await res.json()
        setRankings(data.rankings || [])
      }
    } catch (err) {
      console.error('Error fetching rankings:', err)
    }
  }, [])

  const fetchMyStats = useCallback(async () => {
    if (!isSignedIn) return
    try {
      const token = await getToken()
      const res = await fetch(`${API_BASE}/api/rankings/position`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMyPosition(data.rank)
        setMyStats(data)
      }
    } catch {}
  }, [isSignedIn, getToken])

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await fetchRankings()
      await fetchMyStats()
      setIsLoading(false)
    })()
  }, [fetchRankings, fetchMyStats])

  const handleBack = () => navigate({ to: '/' })

  const filteredRankings = filter === 'all'
    ? rankings
    : rankings.filter((r) => r.league.name === filter)

  const getRankStyle = (rank: number, isMe: boolean) => {
    if (rank <= 3) return TOP_3_BORDERS[rank - 1]
    if (isMe) return { shadow: `0 0 8px ${COLORS.gold}`, color: COLORS.gold, label: `#${rank}` }
    return null
  }

  /** Obtiene el título o indicador de top 3 */
  const getRankLabel = (entry: RankingEntry): string => {
    if (entry.title) return entry.title
    return `#${entry.rank}`
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
        ...pixelFont,
      }}
    >
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 20%, rgba(192, 38, 211, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(103, 232, 249, 0.08) 0%, transparent 50%)
          `,
        }}
      />
      <Stars />

      {/* Header */}
      <div className="relative z-10 px-4 pt-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="px-3 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-200"
            style={{
              backgroundColor: COLORS.spacePanel,
              border: `2px solid ${COLORS.magenta}`,
              color: COLORS.cyan,
              boxShadow: `0 0 4px ${COLORS.magenta}`,
              cursor: 'pointer',
              ...pixelFont,
            }}
          >
            ← VOLVER
          </button>
        </div>
      </div>

      <main className="relative z-10 flex-1 px-4 py-6 overflow-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl font-black uppercase tracking-widest"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: COLORS.magenta,
              textShadow: `0 0 8px ${COLORS.magenta}, 0 0 24px ${COLORS.magenta}`,
              ...pixelFont,
            }}
          >
            RANKINGS
          </h1>
          <p
            className="text-sm uppercase tracking-[0.3em] mt-2"
            style={{
              fontFamily: 'VT323, monospace',
              color: COLORS.cyan,
              textShadow: `0 0 8px ${COLORS.cyan}`,
              fontSize: '18px',
            }}
          >
            Tabla de líderes global
          </p>
        </div>

        {/* My stats card */}
        {myStats && (
          <div
            className="mx-auto mb-6"
            style={{ maxWidth: '780px' }}
          >
            <div
              style={{
                backgroundColor: 'rgba(30, 37, 71, 0.85)',
                border: `2px solid ${COLORS.gold}`,
                padding: '14px 20px',
                boxShadow: `0 0 16px rgba(255, 215, 0, 0.2)`,
              }}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <span style={{ fontFamily: 'VT323, monospace', color: COLORS.gold, fontSize: '20px' }}>
                  ⭐ TU POSICIÓN
                </span>
                <span style={{ fontFamily: '"Press Start 2P", monospace', color: COLORS.cyan, fontSize: '14px', ...pixelFont }}>
                  #{myPosition}
                </span>
                <span style={{ fontFamily: 'VT323, monospace', color: LEAGUE_COLORS[myStats.league.name] || COLORS.cyan, fontSize: '18px' }}>
                  {myStats.league.icon} {myStats.league.name}
                </span>
                <span style={{ fontFamily: 'VT323, monospace', color: COLORS.textWhite, fontSize: '18px' }}>
                  {myStats.totalPoints} pts
                </span>
                {myStats.nextLeaguePoints !== null && (
                  <span style={{ fontFamily: 'VT323, monospace', color: COLORS.textSpace, fontSize: '16px' }}>
                    ({myStats.nextLeaguePoints} pts para siguiente liga)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div
          className="mx-auto mb-4 flex gap-2 justify-center flex-wrap"
          style={{ maxWidth: '780px' }}
        >
          {['all', 'Principiante', 'Intermedio', 'Master', 'Elite Cósmica'].map((l) => (
            <button
              key={l}
              onClick={() => setFilter(l)}
              style={{
                backgroundColor: filter === l ? 'rgba(103, 232, 249, 0.15)' : 'transparent',
                border: 'none',
                borderBottom: filter === l ? `2px solid ${COLORS.cyan}` : '2px solid transparent',
                color: filter === l ? COLORS.cyan : '#9CA3AF',
                padding: '6px 12px',
                fontFamily: 'VT323, monospace',
                fontSize: '16px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.textSpace }}
              onMouseLeave={(e) => { e.currentTarget.style.color = filter === l ? COLORS.cyan : '#9CA3AF' }}
            >
              {l === 'all' ? 'TODOS' : l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Rankings table */}
        <div
          className="mx-auto"
          style={{ maxWidth: '780px' }}
        >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: COLORS.cyan,
                  boxShadow: `0 0 8px ${COLORS.cyan}`,
                }}
              />
            </div>
          ) : filteredRankings.length === 0 ? (
            <p
              className="text-center py-12"
              style={{
                fontFamily: 'VT323, monospace',
                color: COLORS.textSpace,
                fontSize: '20px',
              }}
            >
              No hay rankings disponibles aún.
            </p>
          ) : (
            <div
              style={{
                backgroundColor: 'rgba(30, 37, 71, 0.7)',
                border: `1px solid ${COLORS.magenta}`,
                boxShadow: `0 0 12px rgba(192, 38, 211, 0.2)`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Table header */}
              <div
                className="grid gap-0"
                style={{
                  gridTemplateColumns: '50px 1fr 110px 90px 80px 70px',
                  borderBottom: `1px solid ${COLORS.magenta}`,
                  padding: '10px 12px',
                  fontFamily: 'VT323, monospace',
                  fontSize: '14px',
                  color: COLORS.gold,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <span>#</span>
                <span>JUGADOR</span>
                <span>LIGA</span>
                <span style={{ textAlign: 'right' }}>PUNTOS</span>
                <span style={{ textAlign: 'right' }}>VICS</span>
                <span style={{ textAlign: 'right' }}>WIN%</span>
              </div>

              {/* Table rows */}
              {filteredRankings.map((entry) => {
                const isMe = myStats?.username === entry.username
                const rankStyle = getRankStyle(entry.rank, isMe)

                return (
                  <div
                    key={entry.rank}
                    className="grid gap-0 items-center"
                    style={{
                      gridTemplateColumns: '50px 1fr 110px 90px 80px 70px',
                      padding: '8px 12px',
                      borderBottom: `1px solid rgba(51, 51, 51, 0.6)`,
                      backgroundColor: isMe ? 'rgba(30, 37, 71, 0.9)' : 'transparent',
                      borderLeft: isMe ? `3px solid ${COLORS.gold}` : '3px solid transparent',
                      fontFamily: 'VT323, monospace',
                      fontSize: '16px',
                      color: COLORS.textWhite,
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isMe) e.currentTarget.style.backgroundColor = 'rgba(30, 37, 71, 0.8)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isMe) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {/* Rank */}
                    <span
                      style={{
                        color: rankStyle?.color || COLORS.textSpace,
                        textShadow: rankStyle?.shadow || 'none',
                        fontWeight: entry.rank <= 3 ? 'bold' : 'normal',
                      }}
                    >
                      {getRankLabel(entry)}
                    </span>

                    {/* Username */}
                    <span style={{ color: isMe ? COLORS.gold : COLORS.cyan }}>
                      {entry.username}
                      {isMe && ' ⭐'}
                    </span>

                    {/* League */}
                    <span style={{ color: LEAGUE_COLORS[entry.league.name] || COLORS.textSpace }}>
                      {entry.league.icon} {entry.league.name}
                    </span>

                    {/* Points */}
                    <span style={{ textAlign: 'right', color: COLORS.gold }}>
                      {entry.totalPoints.toLocaleString()}
                    </span>

                    {/* Victories */}
                    <span style={{ textAlign: 'right', color: COLORS.textWhite }}>
                      {entry.victories}
                    </span>

                    {/* Win Rate */}
                    <span
                      style={{
                        textAlign: 'right',
                        color: entry.winRate >= 60 ? COLORS.cyan : entry.winRate >= 40 ? COLORS.gold : COLORS.magenta,
                      }}
                    >
                      {entry.winRate}%
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
