'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUser, useAuth, SignInButton, UserButton } from '@clerk/tanstack-react-start'
import bgImage from '@/assets/background/back1.png'
import Stars from '@/components/ui/Stars'
import { playButtonSound } from '@/utils/playButtonSound'

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
  action: 'jugar' | 'quickplay' | 'retos' | 'rankings' | 'shop' | 'customize' | 'spectator'
  description?: string
}

const MENU_ITEMS: MenuItem[] = [
  { icon: '▶', label: 'JUGAR', action: 'jugar', description: 'Partida ranked vs IA' },
  { icon: '🛰️', label: 'ESPECTADOR', action: 'spectator', description: 'Observa 2 IAs enfrentarse' },
  { icon: '📊', label: 'RANKINGS', action: 'rankings', description: 'Tabla de puntuaciones' },
  { icon: '🛍️', label: 'TIENDA', action: 'shop', description: 'Comprar skins' },
]

interface CosmicButtonProps {
  icon: string
  label: string
  description?: string
  onClick: () => void
  isActive?: boolean
  index?: number
  ariaExpanded?: boolean
}

function CosmicButton({ icon, label, description, onClick, isActive, index = 0, ariaExpanded }: CosmicButtonProps) {
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
        animationDelay: `${0.8 + index * 0.4}s`,
      }}
    >
    <button
      onClick={() => { playButtonSound(); onClick() }}
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
      aria-expanded={ariaExpanded}
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
    </div>
  )
}

const TITLE_LETTERS = ['D', 'A', 'M', 'A', 'S']

function CosmicLogo() {
  return (
    <div className="text-center mb-10 space-y-3">
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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function AuthSection() {
  const { user, isSignedIn, isLoaded } = useUser()
  const { getToken } = useAuth()
  const syncedRef = useRef(false)

  const syncUser = useCallback(async () => {
    if (!isSignedIn || !user || syncedRef.current) return
    syncedRef.current = true

    try {
      const token = await getToken()
      await fetch(`${API_BASE}/api/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          username: user.username || user.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'player',
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          avatar: user.imageUrl || undefined,
        }),
      })
    } catch (err) {
      console.error('Error syncing user with backend:', err)
    }
  }, [isSignedIn, user, getToken])

  useEffect(() => {
    if (isSignedIn && user && !syncedRef.current) {
      syncUser()
    }
  }, [isSignedIn, user, syncUser])

  if (!isLoaded) {
    return (
      <div style={{ width: '120px', height: '36px' }} />
    )
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button
          className="px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200"
          style={{
            backgroundColor: COLORS.spacePanel,
            border: `2px solid ${COLORS.cyan}`,
            color: COLORS.cyan,
            boxShadow: `0 0 4px ${COLORS.cyan}`,
            cursor: 'pointer',
            ...pixelFont,
          }}
        >
          INICIAR SESIÓN
        </button>
      </SignInButton>
    )
  }

  return (
    <div className="flex items-center gap-3" style={{ fontFamily: 'VT323, monospace' }}>
      <span style={{ color: COLORS.textSpace, fontSize: '15px', textAlign: 'right' }}>
        {user.username || user.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Player'}
      </span>
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: {
              width: '32px',
              height: '32px',
              border: `2px solid ${COLORS.magenta}`,
              boxShadow: `0 0 6px ${COLORS.magenta}`,
            },
            userButtonPopoverCard: {
              backgroundColor: COLORS.spacePanel,
              border: `1px solid ${COLORS.magenta}`,
            },
            userButtonPopoverActionButton: {
              color: COLORS.cyan,
              fontFamily: 'VT323, monospace',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              '&:hover, &:focus': {
                color: COLORS.gold,
                textShadow: `0 0 6px ${COLORS.cyan}`,
              },
            },
            userButtonPopoverActionButtonText: {
              color: COLORS.cyan,
            },
            userButtonPopoverActionButtonIcon: {
              color: COLORS.cyan,
            },
            userPreviewMainIdentifier: {
              fontFamily: 'VT323, monospace',
            },
            userPreviewSecondaryIdentifier: {
              fontFamily: 'VT323, monospace',
            },
          },
        }}
      />
    </div>
  )
}

interface SubmenuItem {
  icon: string
  label: string
  action: 'quickplay' | 'retos' | 'customize'
}

const SUBMENU_ITEMS: SubmenuItem[] = [
  { icon: '🏆', label: 'RANKED', action: 'quickplay' },
  { icon: '🎯', label: 'RETOS', action: 'retos' },
  { icon: '🎨', label: 'PERSONALIZACIÓN', action: 'customize' },
]

function JugarSubmenu({
  isSignedIn,
  isLoading,
  onClose,
  onNavigate,
}: {
  isSignedIn: boolean
  isLoading: boolean
  onClose: () => void
  onNavigate: (action: SubmenuItem['action']) => void
}) {
  const [entered, setEntered] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setEntered(true))
  }, [])

  const handleClose = () => {
    setExiting(true)
    setTimeout(onClose, 150)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: entered && !exiting ? 'rgba(11, 13, 43, 0.85)' : 'rgba(11, 13, 43, 0)',
        transition: 'background-color 200ms ease-out',
      }}
    >
      <div
        role="dialog"
        aria-label="Opciones de juego"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: COLORS.spacePanel,
          border: `2px solid ${COLORS.magenta}`,
          borderRadius: '4px',
          padding: '32px 28px',
          boxShadow: `
            0 0 16px rgba(192, 38, 211, 0.3),
            0 0 32px rgba(103, 232, 249, 0.1),
            inset 0 0 16px rgba(192, 38, 211, 0.05)
          `,
          opacity: entered && !exiting ? 1 : 0,
          transform: entered && !exiting ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 250ms ease-out, transform 250ms ease-out',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          minWidth: '280px',
        }}
      >
        <p
          style={{
            fontFamily: '"Press Start 2P", monospace',
            ...pixelFont,
            color: COLORS.cyan,
            fontSize: '14px',
            marginBottom: '16px',
            textShadow: `0 0 8px ${COLORS.cyan}`,
          }}
        >
          ELIGE UN MODO
        </p>

        {SUBMENU_ITEMS.map((item, i) => (
          <div
            key={item.action}
            style={{
              animation: entered && !exiting ? 'float 3s ease-in-out infinite' : 'none',
              animationDelay: `${0.3 + i * 0.15}s`,
            }}
          >
            <CosmicButton
              icon={item.icon}
              label={item.label}
              onClick={() => onNavigate(item.action)}
              isActive={isLoading}
              index={i + 3}
            />
          </div>
        ))}

        <button
          onClick={() => { playButtonSound(); handleClose() }}
          aria-label="Volver al menú principal"
          style={{
            marginTop: '12px',
            fontFamily: '"Press Start 2P", monospace',
            ...pixelFont,
            fontSize: '11px',
            color: COLORS.textSpace,
            backgroundColor: 'transparent',
            border: `1px solid ${COLORS.textSpace}`,
            padding: '10px 24px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = COLORS.cyan
            e.currentTarget.style.borderColor = COLORS.cyan
            e.currentTarget.style.boxShadow = `0 0 8px ${COLORS.cyan}`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = COLORS.textSpace
            e.currentTarget.style.borderColor = COLORS.textSpace
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          ← VOLVER
        </button>
      </div>
    </div>
  )
}

export default function MainMenu() {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [showSubmenu, setShowSubmenu] = useState(false)
  const handleMenuAction = async (action: MenuItem['action']) => {
    if (action === 'jugar') {
      setShowSubmenu(true)
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 200))

    try {
      const routes: Record<string, string> = {
        rankings: '/rankings',
        shop: '/shop',
        spectator: '/spectator',
      }
      await navigate({ to: routes[action] })
    } catch (error) {
      console.error('Navigation failed:', error)
      setIsLoading(false)
    }
  }

  const handleSubmenuAction = async (action: SubmenuItem['action']) => {
    if (isLoading) return
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 200))

    try {
      if (action === 'quickplay') {
        if (!isSignedIn) {
          await navigate({ to: '/game/difficulty' })
        } else {
          await navigate({ to: '/game/play', search: { difficulty: 'principiante', mode: 'ranked' } })
        }
      } else if (action === 'retos') {
        await navigate({ to: '/game/difficulty' })
      } else if (action === 'customize') {
        await navigate({ to: '/customize' })
      }
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

      <div
        className="absolute top-4 right-4 z-20"
        style={{
          animation: 'float 3s ease-in-out infinite',
          animationDelay: '0.4s',
        }}
      >
        <AuthSection />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div
          style={{
            animation: 'float 2.8s ease-in-out infinite',
            animationDelay: '0s',
          }}
        >
          <CosmicLogo />
        </div>

        <div
          className="backdrop-blur-sm"
          style={{
            animation: 'float 3s ease-in-out infinite',
            animationDelay: '2.4s',
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
            {MENU_ITEMS.map((item, i) => (
              <CosmicButton
                key={item.action}
                icon={item.icon}
                label={item.label}
                description={item.description}
                onClick={() => handleMenuAction(item.action)}
                isActive={isLoading}
                index={i}
                ariaExpanded={item.action === 'jugar' ? showSubmenu : undefined}
              />
            ))}
          </div>
        </div>

        {showSubmenu && (
          <JugarSubmenu
            isSignedIn={!!isSignedIn}
            isLoading={isLoading}
            onClose={() => setShowSubmenu(false)}
            onNavigate={handleSubmenuAction}
          />
        )}

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
    </div>
  )
}
