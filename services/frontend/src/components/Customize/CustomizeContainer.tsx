'use client'

import { useState, useEffect } from 'react'
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
} as const

const pixelFont = {
  WebkitFontSmoothing: 'none',
  MozOsxFontSmoothing: 'unset',
} as React.CSSProperties

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface OwnedSkin {
  skinId: string
  isEquipped: boolean
  equipType: string | null
  name: string
  type: string
  rarity: string
  price: number
  primaryColor: string | null
  secondaryColor: string | null
  imageUrl: string | null
}

const RARITY_COLORS: Record<string, string> = {
  common: '#B0E0FF',
  uncommon: '#67E8F9',
  rare: '#C026D3',
  epic: '#FFD700',
  legendary: '#F0F8FF',
}

export default function CustomizeContainer() {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const { getToken } = useAuth()
  const [ownedSkins, setOwnedSkins] = useState<OwnedSkin[]>([])
  const [loading, setLoading] = useState(true)
  const [equipping, setEquipping] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'pieces' | 'boards'>('pieces')

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${API_BASE}/api/shop/owned-skins`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setOwnedSkins(data.ownedSkins || [])
        }
      } catch {
        setOwnedSkins([])
      } finally {
        setLoading(false)
      }
    })()
  }, [isSignedIn, getToken])

  async function handleEquip(skinId: string, equipType?: string) {
    setEquipping(skinId)
    setMessage(null)
    try {
      const token = await getToken()
      const res = await fetch(`${API_BASE}/api/shop/equip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(equipType ? { skinId, equipType } : { skinId }),
      })
      if (res.ok) {
        setOwnedSkins(prev =>
          prev.map(s => {
            if (s.skinId === skinId) return { ...s, isEquipped: true }
            if (equipType) {
              if (s.equipType === equipType || (!s.equipType && equipType === 'piece')) return { ...s, isEquipped: false }
              return s
            }
            return { ...s, isEquipped: false }
          })
        )
        setMessage({ type: 'success', text: equipType === 'board' ? '¡Tablero equipado!' : '¡Skin equipada!' })
      } else {
        setMessage({ type: 'error', text: 'Error al equipar' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setEquipping(null)
    }
  }

  const pieceSkins = ownedSkins.filter(s => s.type === 'piece')
  const boardSkins = ownedSkins.filter(s => s.type === 'board')

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
          className="w-full max-w-3xl p-8 rounded-lg"
          style={{
            backgroundColor: 'rgba(11, 13, 43, 0.85)',
            border: '1px solid rgba(192, 38, 211, 0.3)',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(192, 38, 211, 0.05)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button
            onClick={() => navigate({ to: '/' })}
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
            PERSONALIZAR
          </h1>

          {message && (
            <div
              className="mb-6 p-4 text-center"
              style={{
                border: `2px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
                backgroundColor: message.type === 'success'
                  ? 'rgba(34, 197, 94, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
              }}
            >
              <p style={{ fontFamily: 'VT323, monospace', color: message.type === 'success' ? '#22c55e' : '#ef4444', fontSize: '18px' }}>
                {message.text}
              </p>
            </div>
          )}

          {!isSignedIn ? (
            <div className="flex justify-center">
              <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textSpace, fontSize: '18px' }}>
                Inicia sesión para personalizar tus fichas
              </p>
            </div>
          ) : loading ? (
            <div className="flex justify-center">
              <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textSpace, fontSize: '20px' }}>Cargando...</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('pieces')}
                  style={{
                    padding: '10px 24px',
                    fontSize: '14px',
                    fontFamily: '"Press Start 2P", monospace',
                    backgroundColor: activeTab === 'pieces' ? COLORS.magenta : 'transparent',
                    border: `2px solid ${activeTab === 'pieces' ? COLORS.magenta : COLORS.cyan}`,
                    color: activeTab === 'pieces' ? '#fff' : COLORS.cyan,
                    cursor: 'pointer',
                    textShadow: activeTab === 'pieces' ? `0 0 8px ${COLORS.magenta}` : 'none',
                    transition: 'all 0.2s ease',
                    ...pixelFont,
                  }}
                >
                  FICHAS
                </button>
                <button
                  onClick={() => setActiveTab('boards')}
                  style={{
                    padding: '10px 24px',
                    fontSize: '14px',
                    fontFamily: '"Press Start 2P", monospace',
                    backgroundColor: activeTab === 'boards' ? COLORS.magenta : 'transparent',
                    border: `2px solid ${activeTab === 'boards' ? COLORS.magenta : COLORS.cyan}`,
                    color: activeTab === 'boards' ? '#fff' : COLORS.cyan,
                    cursor: 'pointer',
                    textShadow: activeTab === 'boards' ? `0 0 8px ${COLORS.magenta}` : 'none',
                    transition: 'all 0.2s ease',
                    ...pixelFont,
                  }}
                >
                  TABLEROS
                </button>
              </div>

              {/* Tab content */}
              {activeTab === 'pieces' ? (
                pieceSkins.length === 0 ? (
                  <div className="flex justify-center">
                    <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textSpace, fontSize: '18px' }}>
                      No tienes skins. ¡Ve a la tienda a comprar algunas!
                    </p>
                  </div>
                ) : (
                  <>
                    <p
                      className="mb-6 text-center uppercase tracking-wider"
                      style={{
                        fontFamily: 'VT323, monospace',
                        color: COLORS.textSpace,
                        fontSize: '16px',
                      }}
                    >
                      Selecciona qué fichas usar en tus partidas
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                      {pieceSkins.map(skin => {
                        const isEquipped = skin.isEquipped
                        const primaryColor = skin.primaryColor || '#2d2d44'
                        const secondaryColor = skin.secondaryColor || '#444'
                        const rarityColor = RARITY_COLORS[skin.rarity] || COLORS.magenta

                        return (
                          <div
                            key={skin.skinId}
                            className="flex flex-col items-center"
                            style={{
                              width: '180px',
                              backgroundColor: COLORS.spacePanel,
                              border: `2px solid ${isEquipped ? '#22c55e' : rarityColor}`,
                              boxShadow: isEquipped
                                ? `0 0 16px rgba(34, 197, 94, 0.4)`
                                : `0 0 4px ${rarityColor}66`,
                              opacity: isEquipped ? 1 : 0.8,
                            }}
                          >
                            <div className="w-full p-4 flex flex-col items-center gap-3">
                              {/* Piece preview */}
                              <div
                                className="w-20 h-20 rounded-full flex items-center justify-center"
                                style={{
                                  backgroundColor: `${primaryColor}22`,
                                  border: `3px solid ${isEquipped ? '#22c55e' : primaryColor}`,
                                  boxShadow: isEquipped
                                    ? `0 0 12px rgba(34, 197, 94, 0.3)`
                                    : `0 0 8px ${primaryColor}44`,
                                }}
                              >
                                <div
                                  className="w-12 h-12 rounded-full"
                                  style={{
                                    background: `radial-gradient(circle at 35% 35%, ${primaryColor}, ${secondaryColor})`,
                                    boxShadow: `0 0 8px ${primaryColor}66, inset 0 -2px 4px rgba(0,0,0,0.4)`,
                                    border: '2px solid rgba(255,255,255,0.15)',
                                  }}
                                />
                              </div>

                              {/* Rarity badge */}
                              <span
                                className="text-xs font-bold uppercase tracking-widest px-2 py-1"
                                style={{
                                  color: rarityColor,
                                  border: `1px solid ${rarityColor}`,
                                  textShadow: `0 0 4px ${rarityColor}`,
                                  fontFamily: 'VT323, monospace',
                                  fontSize: '12px',
                                }}
                              >
                                {skin.rarity}
                              </span>

                              {/* Name */}
                              <h2
                                className="font-bold uppercase tracking-widest text-center"
                                style={{
                                  color: COLORS.textWhite,
                                  fontFamily: '"Press Start 2P", monospace',
                                  fontSize: '10px',
                                  lineHeight: 1.4,
                                  ...pixelFont,
                                }}
                              >
                                {skin.name}
                              </h2>

                              {/* Equip button */}
                              <button
                                onClick={() => handleEquip(skin.skinId)}
                                disabled={isEquipped || equipping === skin.skinId}
                                style={{
                                  width: '100%',
                                  padding: '10px 0',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                  fontSize: '11px',
                                  fontFamily: '"Press Start 2P", monospace',
                                  backgroundColor: isEquipped ? '#1a3a1a' : rarityColor,
                                  border: `2px solid ${isEquipped ? '#22c55e' : rarityColor}`,
                                  color: isEquipped ? '#22c55e' : COLORS.textWhite,
                                  cursor: isEquipped ? 'default' : 'pointer',
                                  boxShadow: isEquipped ? 'none' : `0 0 8px ${rarityColor}`,
                                  ...pixelFont,
                                }}
                              >
                                {equipping === skin.skinId ? '...' : isEquipped ? 'EQUIPADO ✓' : 'EQUIPAR'}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              ) : (
                boardSkins.length === 0 ? (
                  <div className="flex justify-center">
                    <p style={{ fontFamily: 'VT323, monospace', color: COLORS.textSpace, fontSize: '18px' }}>
                      No tienes tableros. ¡Ve a la tienda a comprar algunos!
                    </p>
                  </div>
                ) : (
                  <>
                    <p
                      className="mb-6 text-center uppercase tracking-wider"
                      style={{
                        fontFamily: 'VT323, monospace',
                        color: COLORS.textSpace,
                        fontSize: '16px',
                      }}
                    >
                      Selecciona qué tablero usar en tus partidas
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                      {boardSkins.map(skin => {
                        const isEquipped = skin.isEquipped
                        const darkColor = skin.primaryColor || '#1A1040'
                        const lightColor = skin.secondaryColor || '#4C3F91'
                        const rarityColor = RARITY_COLORS[skin.rarity] || COLORS.magenta

                        return (
                          <div
                            key={skin.skinId}
                            className="flex flex-col items-center"
                            style={{
                              width: '180px',
                              backgroundColor: COLORS.spacePanel,
                              border: `2px solid ${isEquipped ? '#22c55e' : rarityColor}`,
                              boxShadow: isEquipped
                                ? `0 0 16px rgba(34, 197, 94, 0.4)`
                                : `0 0 4px ${rarityColor}66`,
                              opacity: isEquipped ? 1 : 0.8,
                            }}
                          >
                            <div className="w-full p-4 flex flex-col items-center gap-3">
                              {/* Board preview 4x4 */}
                              <div
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(4, 1fr)',
                                  border: `2px solid ${isEquipped ? '#22c55e' : 'rgba(255,255,255,0.15)'}`,
                                  boxShadow: isEquipped
                                    ? `0 0 12px rgba(34, 197, 94, 0.3)`
                                    : `0 0 8px ${darkColor}44`,
                                }}
                              >
                                {Array.from({ length: 16 }).map((_, i) => {
                                  const r = Math.floor(i / 4)
                                  const c = i % 4
                                  return (
                                    <div
                                      key={i}
                                      style={{
                                        backgroundColor: (r + c) % 2 !== 0 ? darkColor : lightColor,
                                      }}
                                    />
                                  )
                                })}
                              </div>

                              {/* Rarity badge */}
                              <span
                                className="text-xs font-bold uppercase tracking-widest px-2 py-1"
                                style={{
                                  color: rarityColor,
                                  border: `1px solid ${rarityColor}`,
                                  textShadow: `0 0 4px ${rarityColor}`,
                                  fontFamily: 'VT323, monospace',
                                  fontSize: '12px',
                                }}
                              >
                                {skin.rarity}
                              </span>

                              {/* Name */}
                              <h2
                                className="font-bold uppercase tracking-widest text-center"
                                style={{
                                  color: COLORS.textWhite,
                                  fontFamily: '"Press Start 2P", monospace',
                                  fontSize: '10px',
                                  lineHeight: 1.4,
                                  ...pixelFont,
                                }}
                              >
                                {skin.name}
                              </h2>

                              {/* Equip button */}
                              <button
                                onClick={() => handleEquip(skin.skinId, 'board')}
                                disabled={isEquipped || equipping === skin.skinId}
                                style={{
                                  width: '100%',
                                  padding: '10px 0',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                  fontSize: '11px',
                                  fontFamily: '"Press Start 2P", monospace',
                                  backgroundColor: isEquipped ? '#1a3a1a' : rarityColor,
                                  border: `2px solid ${isEquipped ? '#22c55e' : rarityColor}`,
                                  color: isEquipped ? '#22c55e' : COLORS.textWhite,
                                  cursor: isEquipped ? 'default' : 'pointer',
                                  boxShadow: isEquipped ? 'none' : `0 0 8px ${rarityColor}`,
                                  ...pixelFont,
                                }}
                              >
                                {equipping === skin.skinId ? '...' : isEquipped ? 'EQUIPADO ✓' : 'EQUIPAR'}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
