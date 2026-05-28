'use client'

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
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

const pixelFont = {
  WebkitFontSmoothing: 'none',
  MozOsxFontSmoothing: 'unset',
} as React.CSSProperties

interface Difficulty {
  icon: string
  label: string
  value: string
  description: string
}

const DIFFICULTIES: Difficulty[] = [
  { icon: '🌌', label: 'PRINCIPIANTE', value: 'principiante', description: 'Movimientos simples, profundidad 1-2' },
  { icon: '⚡', label: 'INTERMEDIO', value: 'intermedio', description: 'Evalúa capturas y defensa básica' },
  { icon: '🧠', label: 'MASTER', value: 'master', description: 'Analiza múltiples escenarios (A*)' },
  { icon: '👾', label: 'ULTRA', value: 'ultra', description: 'Optimización heurística avanzada' },
]

function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: { x: number; y: number; r: number; speed: number }[] = []
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.2 + 0.05,
      })
    }

    let frame: number
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const s of stars) {
        s.y -= s.speed
        if (s.y < 0) {
          s.y = canvas.height
          s.x = Math.random() * canvas.width
        }
        const alpha = Math.random() > 0.98 ? 0.9 + Math.random() * 0.1 : 0.3 + Math.random() * 0.5
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()
      }
      frame = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  )
}

interface DifficultyButtonProps {
  icon: string
  label: string
  description: string
  onClick: () => void
  isActive?: boolean
  index: number
}

function DifficultyButton({ icon, label, description, onClick, isActive, index }: DifficultyButtonProps) {
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
        onClick={onClick}
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
            border: `2px solid ${isHovered ? COLORS.cyan : COLORS.magenta}`,
            boxShadow: borderGlow,
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

const TITLE_LETTERS = ['D', 'A', 'M', 'A', 'S']

function TitleLogo() {
  return (
    <div className="text-center mb-6">
      <h1
        className="text-4xl font-black uppercase tracking-widest flex justify-center gap-1"
        style={{
          fontFamily: '"Press Start 2P", monospace',
          ...pixelFont,
        }}
      >
        {TITLE_LETTERS.map((letter, i) => (
          <span
            key={i}
            style={{
              color: COLORS.magenta,
              textShadow: `
                0 0 8px ${COLORS.magenta},
                0 0 24px ${COLORS.magenta},
                2px 2px 0 ${COLORS.spaceDark},
                -2px -2px 0 ${COLORS.cyan}
              `,
              animation: 'float 3s ease-in-out infinite',
              animationDelay: `${i * 0.12}s`,
              display: 'inline-block',
            }}
          >
            {letter}
          </span>
        ))}
      </h1>
      <p
        className="text-lg uppercase tracking-[0.3em]"
        style={{
          fontFamily: 'VT323, monospace',
          color: COLORS.cyan,
          textShadow: `0 0 12px ${COLORS.cyan}`,
          fontSize: '22px',
        }}
      >
        Universe
      </p>
    </div>
  )
}

export default function DifficultySelect() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSelect = async (difficulty: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 200))
    try {
      await navigate({ to: '/game/play', search: { difficulty } })
    } catch (error) {
      console.error('Navigation failed:', error)
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate({ to: '/' })
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
            radial-gradient(ellipse at 50% 30%, rgba(192, 38, 211, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(103, 232, 249, 0.1) 0%, transparent 50%)
          `,
        }}
      />
      <Stars />

      {/* Back Button */}
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
            const target = e.currentTarget
            target.style.transform = 'scale(0.95)'
          }}
          onMouseUp={(e) => {
            const target = e.currentTarget
            target.style.transform = 'scale(1)'
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget
            target.style.transform = 'scale(1)'
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
          style={{
            animation: 'float 2.8s ease-in-out infinite',
            animationDelay: '0s',
          }}
        >
          <TitleLogo />
        </div>

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
            {DIFFICULTIES.map((d, i) => (
              <DifficultyButton
                key={d.value}
                icon={d.icon}
                label={d.label}
                description={d.description}
                onClick={() => handleSelect(d.value)}
                isActive={isLoading}
                index={i}
              />
            ))}
          </div>
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
              Iniciando partida...
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
