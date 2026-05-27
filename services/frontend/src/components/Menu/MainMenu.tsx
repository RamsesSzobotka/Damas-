'use client'

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

// ─── Color Palette (GBA Retro Damas) ──────────────────────────────────────
const COLORS = {
  bgDark: '#0A0A0F',
  bgPanel: '#1C1C24',
  primary: '#E31C2B',
  primaryLight: '#FF4D5C',
  gold: '#FFD700',
  goldDark: '#B8960F',
  textWhite: '#FFFFFF',
  textGray: '#B0B0C8',
} as const

const pixelFont = {
  WebkitFontSmoothing: 'none',
  MozOsxFontSmoothing: 'unset',
} as React.CSSProperties

// ─── Menu Item Interface ──────────────────────────────────────────────────
interface MenuItem {
  icon: string
  label: string
  action: 'play' | 'rankings' | 'shop' | 'settings' | 'exit'
  description?: string
}

const MENU_ITEMS: MenuItem[] = [
  { icon: '▶', label: 'JUGAR', action: 'play', description: 'Nueva partida vs IA' },
  { icon: '📊', label: 'RANKINGS', action: 'rankings', description: 'Tabla de puntuaciones' },
  { icon: '🛍️', label: 'TIENDA', action: 'shop', description: 'Comprar skins' },
  { icon: '⚙️', label: 'OPCIONES', action: 'settings', description: 'Ajustes del juego' },
  { icon: '❌', label: 'SALIR', action: 'exit', description: 'Cerrar juego' },
]

// ─── RetroMenuButton ──────────────────────────────────────────────────────
interface RetroMenuButtonProps {
  icon: string
  label: string
  description?: string
  onClick: () => void
  isActive?: boolean
}

function RetroMenuButton({
  icon,
  label,
  description,
  onClick,
  isActive,
}: RetroMenuButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const bgColor = isPressed
    ? '#7A0A15'
    : isHovered
      ? COLORS.primary
      : COLORS.bgPanel

  const borderColor = isPressed ? COLORS.primaryLight : COLORS.primary
  const shadowInset = isPressed
    ? `inset 2px 2px 0 ${COLORS.bgDark}`
    : `2px 2px 0 ${COLORS.bgDark}`

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
      className="w-64 group transition-all duration-100"
      style={pixelFont}
      aria-pressed={isActive}
    >
      <div
        className="px-6 py-4 flex items-center gap-4"
        style={{
          backgroundColor: bgColor,
          border: `2px solid ${borderColor}`,
          boxShadow: shadowInset,
          cursor: 'pointer',
        }}
      >
        <span
          className="text-2xl"
          style={{
            filter: isHovered ? 'drop-shadow(0 0 4px #FFD700)' : 'none',
          }}
        >
          {icon}
        </span>
        <div className="flex-1 text-left">
          <p
            className="text-sm font-bold uppercase tracking-wider"
            style={{
              color: isHovered ? COLORS.textWhite : COLORS.primaryLight,
              textShadow: isHovered
                ? `0 0 8px ${COLORS.primaryLight}`
                : '1px 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {label}
          </p>
          {description && (
            <p
              className="text-xs uppercase tracking-wider opacity-70"
              style={{
                color: COLORS.textGray,
              }}
            >
              {description}
            </p>
          )}
        </div>
        <span
          className="text-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: COLORS.gold }}
        >
          →
        </span>
      </div>
    </button>
  )
}

// ─── AuthButton ───────────────────────────────────────────────────────────
function AuthButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const bgColor = isPressed
    ? '#7A0A15'
    : isHovered
      ? COLORS.primary
      : COLORS.bgPanel

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-100"
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${COLORS.primary}`,
        color: isHovered ? COLORS.textWhite : COLORS.primaryLight,
        boxShadow: isPressed
          ? `inset 2px 2px 0 ${COLORS.bgDark}`
          : `2px 2px 0 ${COLORS.bgDark}`,
        textShadow: isHovered ? `0 0 4px ${COLORS.primaryLight}` : 'none',
        cursor: 'pointer',
        ...pixelFont,
      }}
    >
      👤 PERFIL
    </button>
  )
}

// ─── Logo Component ───────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="text-center mb-8 space-y-2">
      <h1
        className="text-4xl font-black uppercase tracking-widest"
        style={{
          fontFamily: '"Press Start 2P", monospace',
          color: COLORS.primary,
          textShadow: `3px 3px 0 ${COLORS.goldDark}, -1px -1px 0 ${COLORS.gold}`,
          ...pixelFont,
        }}
      >
        DAMAS
      </h1>
      <p
        className="text-xs uppercase tracking-widest"
        style={{
          color: COLORS.gold,
          fontFamily: '"Press Start 2P", monospace',
          ...pixelFont,
        }}
      >
        Checkers • Retro Edition
      </p>
      <div
        className="flex justify-center gap-1 text-lg pt-2"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(227, 28, 43, 0.3))' }}
      >
        {[...Array(8)].map((_, i) => (
          <span key={i} style={{ color: i % 2 === 0 ? COLORS.primary : COLORS.gold }}>
            ⬜
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Footer Component ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="w-full py-3 px-4 border-t-2 text-center text-xs uppercase tracking-wider"
      style={{
        backgroundColor: COLORS.bgDark,
        borderColor: COLORS.primary,
        color: COLORS.textGray,
        ...pixelFont,
      }}
    >
      v1.0.0 © 2026 • DAMAS DIGITAL • Equipo SDD IX
    </footer>
  )
}

// ─── MainMenu Component ───────────────────────────────────────────────────
export default function MainMenu() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleMenuAction = async (action: MenuItem['action']) => {
    setIsLoading(true)

    // Simular pequeño delay para feedback visual
    await new Promise((resolve) => setTimeout(resolve, 200))

    const routes: Record<MenuItem['action'], string> = {
      play: '/game/difficulty',
      rankings: '/rankings',
      shop: '/shop',
      settings: '/settings',
      exit: '/',
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
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundColor: COLORS.bgDark,
        backgroundImage:
          'radial-gradient(circle at 20% 50%, rgba(227, 28, 43, 0.1) 0%, transparent 50%)',
        ...pixelFont,
      }}
    >
      {/* Auth Button */}
      <div className="absolute top-4 right-4 z-20">
        <AuthButton />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <Logo />

        {/* Menu Panel */}
        <div
          className="bg-opacity-50 backdrop-blur-sm"
          style={{
            borderRadius: '4px',
            border: `3px solid ${COLORS.gold}`,
            padding: '24px',
            boxShadow: `
              inset 1px 1px 0 ${COLORS.bgDark},
              inset -2px -2px 0 ${COLORS.goldDark},
              0 0 16px rgba(227, 28, 43, 0.2)
            `,
          }}
        >
          <div className="flex flex-col gap-3">
            {MENU_ITEMS.map((item) => (
              <RetroMenuButton
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

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mt-8 flex items-center gap-2">
            <div
              className="w-2 h-2 animate-pulse"
              style={{ backgroundColor: COLORS.gold }}
            />
            <p
              className="text-xs uppercase tracking-wider"
              style={{ color: COLORS.textGray }}
            >
              Cargando...
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
