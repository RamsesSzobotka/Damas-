import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'
import { playButtonSound } from '@/utils/playButtonSound'
import SpectatorSetup, { type SpectatorDifficulty } from '@/components/Spectator/SpectatorSetup'
import bgImage from '@/assets/background/backPlay.png'
import Stars from '@/components/ui/Stars'

export const SPECTATOR_DIFFICULTIES: SpectatorDifficulty[] = [
  { icon: '🌌', label: 'PRINCIPIANTE', value: 'principiante', description: 'Movimientos simples, profundidad 1-2' },
  { icon: '⚡', label: 'INTERMEDIO', value: 'intermedio', description: 'Evalúa capturas y defensa básica' },
  { icon: '🧠', label: 'MASTER', value: 'master', description: 'Analiza múltiples escenarios (A*)' },
  { icon: '👾', label: 'ULTRA', value: 'ultra', description: 'Optimización heurística avanzada' },
]

const VALID_DIFFICULTIES = SPECTATOR_DIFFICULTIES.map((d) => d.value)

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

export interface SpectatorSearch {
  difficulty?: string
}

export const Route = createFileRoute('/spectator/')({
  validateSearch: (search: Record<string, string>): SpectatorSearch => {
    const raw = search.difficulty
    const difficulty = raw && VALID_DIFFICULTIES.includes(raw) ? raw : 'principiante'
    return { difficulty }
  },
  component: SpectatorSetupPage,
})

function SpectatorSetupPage() {
  useBackgroundMusic(true)
  const navigate = Route.useNavigate()
  const { difficulty } = Route.useSearch()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const selectedDifficulty = difficulty ?? 'principiante'

  const handleSelect = async (value: string) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      await navigate({
        to: '/spectator/watch',
        search: { difficulty: value },
      } as never)
    } catch (err) {
      console.error('Navigation to /spectator/watch failed:', err)
      setErrorMsg('No se pudo abrir la vista de espectador todavía.')
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    playButtonSound()
    navigate({ to: '/' })
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundColor: COLORS.spaceDark,
        ...pixelFont,
      }}
    >
      <div
        className="absolute inset-0 bg-drift"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
        aria-hidden="true"
      />
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

      <div
        className="absolute top-4 left-4 z-20"
        style={{
          animation: 'float 3s ease-in-out infinite',
          animationDelay: '0s',
        }}
      >
        <button
          onClick={handleBack}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div
          className="text-center mb-6"
          style={{
            animation: 'float 2.8s ease-in-out infinite',
            animationDelay: '0s',
          }}
        >
          <h1
            className="text-3xl sm:text-4xl font-black uppercase tracking-widest"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: COLORS.magenta,
              textShadow: `
                0 0 8px ${COLORS.magenta},
                0 0 24px ${COLORS.magenta},
                2px 2px 0 ${COLORS.spaceDark},
                -2px -2px 0 ${COLORS.cyan}
              `,
              ...pixelFont,
            }}
          >
            🛰️ MODO ESPECTADOR
          </h1>
          <p
            className="mt-3 uppercase tracking-[0.25em]"
            style={{
              fontFamily: 'VT323, monospace',
              color: COLORS.cyan,
              textShadow: `0 0 10px ${COLORS.cyan}`,
              fontSize: '20px',
            }}
          >
            Observa 2 IAs enfrentarse. Elige la dificultad.
          </p>
        </div>

        <div
          style={{
            animation: 'float 3s ease-in-out infinite',
            animationDelay: '0.2s',
          }}
        >
          <SpectatorSetup
            difficulties={SPECTATOR_DIFFICULTIES}
            selectedDifficulty={selectedDifficulty}
            onSelect={handleSelect}
          />
        </div>

        {isLoading && (
          <div className="mt-8 flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: COLORS.cyan,
                boxShadow: `0 0 8px ${COLORS.cyan}`,
              }}
            />
            <p
              className="text-xs uppercase tracking-wider"
              style={{
                fontFamily: 'VT323, monospace',
                color: COLORS.textSpace,
                fontSize: '16px',
              }}
            >
              Preparando la arena cósmica...
            </p>
          </div>
        )}

        {errorMsg && !isLoading && (
          <p
            className="mt-6 uppercase tracking-wider"
            style={{
              fontFamily: 'VT323, monospace',
              color: '#FF4D6B',
              textShadow: '0 0 6px rgba(255, 77, 107, 0.4)',
              fontSize: '16px',
            }}
          >
            {errorMsg}
          </p>
        )}
      </main>
    </div>
  )
}
