'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUser, useAuth, SignInButton } from '@clerk/tanstack-react-start'
import Stars from '@/components/ui/Stars'
import { playButtonSound } from '@/utils/playButtonSound'
import bgImage from '@/assets/background/backStore.png'

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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const RARITY_COLORS: Record<string, string> = {
  common: '#B0E0FF',
  uncommon: '#67E8F9',
  rare: '#C026D3',
  epic: '#FFD700',
  legendary: '#F0F8FF',
}

interface SkinProduct {
  _id: string
  name: string
  description: string
  price: number
  rarity: string
  type: string
  primaryColor: string
  secondaryColor: string
  imageUrl: string
  theme?: string
}

function ProductCard({
  product,
  onBuy,
  purchasing,
  owned,
  isSignedIn,
}: {
  product: { id: string; name: string; description: string; price: string; rarity: string; skinId: string; primaryColor: string; secondaryColor: string; type?: string; theme?: string }
  onBuy: () => void
  purchasing: boolean
  owned: boolean
  isSignedIn: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const rarityColor = RARITY_COLORS[product.rarity.toLowerCase()] || COLORS.magenta
  const primaryColor = product.primaryColor || '#2d2d44'
  const secondaryColor = product.secondaryColor || '#444'

  const buttonStyle = {
    width: '100%',
    padding: '12px 0',
    fontWeight: 'bold' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em' as const,
    fontSize: '12px',
    fontFamily: '"Press Start 2P", monospace',
    border: '2px solid',
    cursor: 'pointer' as const,
    transition: 'all 0.2s ease',
    ...pixelFont,
  }

  const buyButton = (
    <button
      onClick={owned ? undefined : onBuy}
      disabled={purchasing || owned}
      style={{
        ...buttonStyle,
        backgroundColor: owned ? '#1a3a1a' : purchasing ? '#555' : rarityColor,
        borderColor: owned ? '#22c55e' : rarityColor,
        color: owned ? '#22c55e' : COLORS.textWhite,
        boxShadow: owned
          ? 'none'
          : purchasing
            ? 'none'
            : `0 0 12px ${rarityColor}, 0 0 24px ${rarityColor}44`,
        cursor: owned ? 'default' : purchasing ? 'not-allowed' : 'pointer',
      }}
    >
      {owned ? 'ADQUIRIDO ✓' : purchasing ? 'PROCESANDO...' : 'COMPRAR'}
    </button>
  )

  return (
    <div
      className="flex flex-col items-center"
      style={{
        width: '200px',
        backgroundColor: COLORS.spacePanel,
        border: `2px solid ${owned ? '#22c55e' : isHovered ? rarityColor : '#2a2a5a'}`,
        boxShadow: owned
          ? `0 0 12px rgba(34, 197, 94, 0.3)`
          : isHovered
            ? `0 0 16px ${rarityColor}, 0 0 32px ${rarityColor}44`
            : `0 0 4px ${rarityColor}66`,
        transition: 'all 0.2s ease',
        opacity: owned ? 0.8 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full p-4 flex flex-col items-center gap-3">
        {/* Preview: board 4x4 grid or piece circular preview */}
        {product.type === 'board' ? (
          <div
            style={{
              width: '96px',
              height: '96px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              border: `3px solid ${owned ? '#22c55e' : primaryColor}`,
              ...(product.theme === 'pixel'
                ? { borderRadius: 0, imageRendering: 'pixelated' }
                : {}),
              boxShadow: owned
                ? `0 0 12px rgba(34, 197, 94, 0.3)`
                : product.theme === 'cyberpunk'
                  ? `0 0 8px ${primaryColor}, 0 0 16px ${primaryColor}66, 0 0 24px ${primaryColor}33, inset 0 0 8px ${primaryColor}33`
                  : `0 0 12px ${primaryColor}66, inset 0 0 8px ${primaryColor}33`,
            }}
          >
            {Array.from({ length: 16 }).map((_, i) => {
              const r = Math.floor(i / 4)
              const c = i % 4
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: (r + c) % 2 !== 0 ? primaryColor : secondaryColor,
                  }}
                />
              )
            })}
          </div>
        ) : (
          <div
            className="w-24 h-24 flex items-center justify-center"
            style={{
              backgroundColor: `${primaryColor}22`,
              border: `3px solid ${owned ? '#22c55e' : primaryColor}`,
              ...(product.theme === 'pixel'
                ? { borderRadius: '8px', imageRendering: 'pixelated' }
                : { borderRadius: '50%' }),
              boxShadow: owned
                ? `0 0 12px rgba(34, 197, 94, 0.3), inset 0 0 8px rgba(34, 197, 94, 0.2)`
                : product.theme === 'cyberpunk'
                  ? `0 0 8px ${primaryColor}, 0 0 16px ${primaryColor}66, inset 0 0 8px ${primaryColor}33`
                  : `0 0 12px ${primaryColor}66, inset 0 0 8px ${primaryColor}33`,
            }}
          >
            <div
              className="w-14 h-14"
              style={{
                ...(product.theme === 'pixel'
                  ? {
                      borderRadius: '4px',
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      imageRendering: 'pixelated',
                    }
                  : {
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 35% 35%, ${primaryColor}, ${secondaryColor})`,
                    }),
                boxShadow: product.theme === 'cyberpunk'
                  ? `0 0 6px ${primaryColor}, 0 0 12px ${primaryColor}88, 0 0 20px ${secondaryColor}44, inset 0 -3px 6px rgba(0,0,0,0.4)`
                  : `0 0 12px ${primaryColor}88, inset 0 -3px 6px rgba(0,0,0,0.4)`,
                border: `2px solid ${owned ? '#22c55e' : 'rgba(255,255,255,0.2)'}`,
              }}
            />
          </div>
        )}

        {/* Rarity badge */}
        <span
          className="text-xs font-bold uppercase tracking-widest px-3 py-1"
          style={{
            color: rarityColor,
            border: `1px solid ${rarityColor}`,
            textShadow: `0 0 6px ${rarityColor}`,
            fontFamily: 'VT323, monospace',
            fontSize: '14px',
          }}
        >
          {product.rarity}
        </span>

        {/* Name */}
        <h2
          className="font-bold uppercase tracking-widest text-center"
          style={{
            color: COLORS.textWhite,
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '11px',
            lineHeight: 1.5,
            ...pixelFont,
          }}
        >
          {product.name}
        </h2>

        {/* Price */}
        <span
          className="text-xl font-bold"
          style={{
            color: COLORS.gold,
            textShadow: owned ? 'none' : `0 0 12px ${COLORS.gold}`,
            fontFamily: '"Press Start 2P", monospace',
            textDecoration: owned ? 'line-through' : 'none',
            opacity: owned ? 0.6 : 1,
            ...pixelFont,
          }}
        >
          {product.price}
        </span>

        {/* Action button */}
        {!isSignedIn && !owned ? (
          <SignInButton mode="modal">
            <button
              style={{
                ...buttonStyle,
                backgroundColor: rarityColor,
                borderColor: rarityColor,
                color: COLORS.textWhite,
                boxShadow: `0 0 12px ${rarityColor}`,
              }}
            >
              COMPRAR
            </button>
          </SignInButton>
        ) : (
          buyButton
        )}
      </div>
    </div>
  )
}

const FILTER_OPTIONS = [
  { key: 'all', label: 'Todos' },
  { key: 'piece', label: 'Fichas' },
  { key: 'board', label: 'Tableros' },
  { key: 'piece_and_board', label: 'Paquetes' },
] as const

type SortMode = 'newest' | 'popular' | 'price_asc'

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'newest', label: 'Nuevos' },
  { key: 'popular', label: 'Populares' },
  { key: 'price_asc', label: 'Precio ↑' },
]

function SkeletonCard() {
  return (
    <div
      className="flex flex-col items-center animate-pulse"
      style={{ width: '200px', backgroundColor: COLORS.spacePanel }}
    >
      <div className="w-full p-4 flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full" style={{ backgroundColor: '#2a2a5a' }} />
        <div className="h-4 w-16" style={{ backgroundColor: '#2a2a5a' }} />
        <div className="h-6 w-24" style={{ backgroundColor: '#2a2a5a' }} />
        <div className="h-5 w-20" style={{ backgroundColor: '#2a2a5a' }} />
        <div className="h-10 w-full" style={{ backgroundColor: '#2a2a5a' }} />
      </div>
    </div>
  )
}

export default function ShopContainer() {
  const navigate = useNavigate()
  const { isSignedIn, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [purchasing, setPurchasing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [skins, setSkins] = useState<SkinProduct[]>([])
  const [loadingSkins, setLoadingSkins] = useState(true)
  const [ownedSkinIds, setOwnedSkinIds] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  const filteredSkins = skins
    .filter(s => filterType === 'all' || s.type === filterType)
    .sort((a, b) => {
      switch (sortMode) {
        case 'price_asc': return a.price - b.price
        case 'popular': return 0
        case 'newest': return 0
        default: return 0
      }
    })

  // Fetch available skins
  useEffect(() => {
    fetch(`${API_BASE}/api/shop/skins`)
      .then(res => res.json())
      .then(data => setSkins(data))
      .catch(() => setSkins([]))
      .finally(() => setLoadingSkins(false))
  }, [])

  // Fetch owned skins when authenticated
  useEffect(() => {
    if (!isSignedIn) {
      setOwnedSkinIds([])
      return
    }
    ;(async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${API_BASE}/api/shop/user-skins`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setOwnedSkinIds(data.skinIds || [])
        }
      } catch {
        setOwnedSkinIds([])
      }
    })()
  }, [isSignedIn])

  // Handle redirect back from Stripe
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const success = searchParams.get('success')
    const sessionId = searchParams.get('session_id')

    if (success === 'true' && sessionId) {
      confirmPurchase(sessionId)
    }
  }, [])

  async function confirmPurchase(sessionId: string) {
    try {
      const token = await getToken()
      const res = await fetch(`${API_BASE}/api/payment/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ sessionId }),
      })

      if (!res.ok) throw new Error('Confirmación fallida')

      const data = await res.json()
      setMessage({ type: 'success', text: '¡Compra exitosa! Tus fichas ya están disponibles.' })

      if (data.purchase?.skinId) {
        setOwnedSkinIds(prev => [...prev, data.purchase.skinId])
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al confirmar la compra. Contacta a soporte.' })
    }
  }

  async function handleBuy(skinId: string) {
    playButtonSound()
    if (!isLoaded || !isSignedIn) return

    setPurchasing(true)
    setMessage(null)

    try {
      const token = await getToken()
      const res = await fetch(`${API_BASE}/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skinId }),
      })

      if (!res.ok) throw new Error('Error al crear sesión de pago')

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No se recibió URL de checkout')
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al iniciar el pago. Intenta de nuevo.' })
      setPurchasing(false)
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

      <main className="flex-1 flex flex-col items-center px-4 py-8 relative z-10">
        <div
          className="w-full max-w-5xl p-8 rounded-lg"
          style={{
            backgroundColor: 'rgba(11, 13, 43, 0.85)',
            border: '1px solid rgba(192, 38, 211, 0.3)',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(192, 38, 211, 0.05)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button
            onClick={() => { playButtonSound(); navigate({ to: '/' }) }}
            className="flex items-center gap-2 transition-all duration-200 mb-6"
            style={{
              color: COLORS.cyan,
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '12px',
              textShadow: `0 0 8px ${COLORS.cyan}`,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              ...pixelFont,
            }}
          >
            <span style={{ fontSize: '16px' }}>←</span>
            VOLVER
          </button>

          <h1
            className="text-4xl font-black uppercase tracking-widest text-center mb-8"
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
            TIENDA — CUSTOMIZA TU JUEGO
          </h1>

          {message && (
            <div
              className="mb-6 p-4 text-center backdrop-blur-sm"
              style={{
                border: `2px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
                backgroundColor: message.type === 'success'
                  ? 'rgba(34, 197, 94, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
              }}
            >
              <p
                style={{
                  fontFamily: 'VT323, monospace',
                  color: message.type === 'success' ? '#22c55e' : '#ef4444',
                  fontSize: '18px',
                }}
              >
                {message.text}
              </p>
            </div>
          )}

          {/* Filters and sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex gap-2">
              {FILTER_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => { playButtonSound(); setFilterType(opt.key) }}
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontFamily: '"Press Start 2P", monospace',
                    backgroundColor: filterType === opt.key ? COLORS.magenta : 'transparent',
                    border: `2px solid ${filterType === opt.key ? COLORS.magenta : COLORS.cyan}`,
                    color: filterType === opt.key ? '#fff' : COLORS.cyan,
                    cursor: 'pointer',
                    textShadow: filterType === opt.key ? `0 0 8px ${COLORS.magenta}` : 'none',
                    transition: 'all 0.2s ease',
                    ...pixelFont,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1" style={{ color: COLORS.textSpace }}>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: '16px', alignSelf: 'center' }}>
                Orden:
              </span>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => { playButtonSound(); setSortMode(opt.key) }}
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontFamily: '"Press Start 2P", monospace',
                    backgroundColor: sortMode === opt.key ? COLORS.spacePanel : 'transparent',
                    border: `2px solid ${sortMode === opt.key ? COLORS.cyan : 'transparent'}`,
                    color: sortMode === opt.key ? COLORS.cyan : COLORS.textSpace,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ...pixelFont,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="overflow-y-auto pr-2"
            style={{
              maxHeight: '520px',
              scrollbarWidth: 'thin',
              scrollbarColor: `${COLORS.magenta} transparent`,
            }}
          >
            {!isLoaded || loadingSkins ? (
              <div className="flex flex-wrap justify-center gap-6">
                {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredSkins.length === 0 ? (
              <div className="flex justify-center">
                <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textSpace, fontSize: '20px' }}>
                  No hay productos disponibles
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6">
                {filteredSkins.map((skin) => (
                  <ProductCard
                    key={skin._id}
                    product={{
                      id: skin._id,
                      name: skin.name,
                      description: skin.description || 'Personaliza tu juego',
                      price: `$${(skin.price / 100).toFixed(2)}`,
                      rarity: skin.rarity?.toUpperCase() || 'COMMON',
                      skinId: skin._id,
                      primaryColor: skin.primaryColor,
                      secondaryColor: skin.secondaryColor,
                      type: skin.type,
                      theme: skin.theme,
                    }}
                    onBuy={() => handleBuy(skin._id)}
                    purchasing={purchasing}
                    owned={ownedSkinIds.includes(skin._id)}
                    isSignedIn={!!isSignedIn}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}