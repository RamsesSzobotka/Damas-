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

interface MenuItem {
  icon: string
  label: string
  action: 'play' | 'rankings' | 'shop'
  description?: string
}

const MENU_ITEMS: MenuItem[] = [
  { icon: '▶', label: 'JUGAR', action: 'play', description: 'Nueva partida vs IA' },
  { icon: '📊', label: 'RANKINGS', action: 'rankings', description: 'Tabla de puntuaciones' },
  { icon: '🛍️', label: 'TIENDA', action: 'shop', description: 'Comprar skins' },
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

interface CosmicButtonProps {
  icon: string
  label: string
  description?: string
  onClick: () => void
  isActive?: boolean
}

function CosmicButton({ icon, label, description, onClick, isActive }: CosmicButtonProps) {
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
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseEnter={() => setIsHovered(true)}
      className="w-64 group transition-all duration-200"
      style={pixelFont}
      aria-pressed={isActive}
    >
      <div
        className="px-6 py-4 flex items-center gap-4"
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
          className="text-2xl"
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
              textShadow: isHovered
                ? `0 0 8px ${COLORS.cyan}`
                : 'none',
            }}
          >
            {label}
          </p>
          {description && (
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
          )}
        </div>
        <span
          className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: COLORS.gold, textShadow: `0 0 8px ${COLORS.gold}` }}
        >
          →
        </span>
      </div>
    </button>
  )
}

function CosmicLogo() {
  return (
    <div className="text-center mb-10 space-y-3">
      <h1
        className="text-4xl font-black uppercase tracking-widest"
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
        DAMAS
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
      <div className="flex justify-center gap-2 pt-4">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="text-xl"
            style={{
              color: i % 2 === 0 ? COLORS.magenta : COLORS.cyan,
              textShadow: i % 2 === 0
                ? `0 0 6px ${COLORS.magenta}`
                : `0 0 6px ${COLORS.cyan}`,
            }}
          >
            ⬜
          </span>
        ))}
      </div>
    </div>
  )
}

function AuthButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      className="px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200"
      style={{
        backgroundColor: isPressed ? '#2A1B5E' : isHovered ? COLORS.magenta : COLORS.spacePanel,
        border: `2px solid ${isHovered ? COLORS.cyan : COLORS.magenta}`,
        color: isHovered ? COLORS.textWhite : COLORS.cyan,
        boxShadow: isHovered ? `0 0 10px ${COLORS.cyan}` : `0 0 4px ${COLORS.magenta}`,
        textShadow: isHovered ? `0 0 6px ${COLORS.cyan}` : 'none',
        cursor: 'pointer',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.15s ease, background-color 0.2s ease',
        ...pixelFont,
      }}
    >
      👤 PERFIL
    </button>
  )
}

function Footer() {
  return (
    <footer
      className="w-full py-3 px-4 border-t-2 text-center text-xs uppercase tracking-wider"
      style={{
        backgroundColor: 'rgba(11, 13, 43, 0.8)',
        borderColor: COLORS.magenta,
        color: COLORS.textSpace,
        fontFamily: 'VT323, monospace',
        fontSize: '14px',
        ...pixelFont,
      }}
    >
      v1.0.0 © 2026 • DAMAS UNIVERSE • Equipo SDD IX
    </footer>
  )
}

export default function MainMenu() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleMenuAction = async (action: MenuItem['action']) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 200))

    const routes: Record<MenuItem['action'], string> = {
      play: '/game/difficulty',
      rankings: '/rankings',
      shop: '/shop',
    }

    try {
      await navigate({ to: routes[action] })
    } catch (error) {
      console.error('Navigation failed:', error)
      setIsLoading(false)
    }
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

      <div className="absolute top-4 right-4 z-20">
        <AuthButton />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <CosmicLogo />

        <div
          className="backdrop-blur-sm"
          style={{
            borderRadius: '4px',
            border: `2px solid ${COLORS.magenta}`,
            padding: '28px',
            boxShadow: `
              0 0 16px rgba(192, 38, 211, 0.3),
              0 0 32px rgba(103, 232, 249, 0.1),
              inset 0 0 16px rgba(192, 38, 211, 0.05)
            `,
            backgroundColor: 'rgba(30, 37, 71, 0.6)',
          }}
        >
          <div className="flex flex-col gap-3">
            {MENU_ITEMS.map((item) => (
              <CosmicButton
                key={item.action}
                icon={item.icon}
                label={item.label}
                description={item.description}
                onClick={() => handleMenuAction(item.action)}
                isActive={isLoading}
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
              Cargando...
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
