'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/gameStore'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

type SpectatorMove = {
  from: [number, number]
  to: [number, number]
  captured?: [number, number][]
  path?: [number, number][]
}

type UseSpectatorGameOptions = {
  gameId: string | null
  onPlayerMove: (move: SpectatorMove) => void
  isPlaying: boolean
  gameOver: boolean
  currentPlayer: number
}

export function useSpectatorGame({
  gameId,
  onPlayerMove,
  isPlaying,
  gameOver,
  currentPlayer,
}: UseSpectatorGameOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inFlightRef = useRef(false)
  const isMountedRef = useRef(true)

  const clearPending = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  const requestNextMove = useCallback(() => {
    if (!gameId || gameOver || !isPlaying) return
    if (currentPlayer !== 1) return

    if (inFlightRef.current) return
    inFlightRef.current = true

    const { spectatorDelayMs } = useGameStore.getState()
    const delay = Math.max(0, spectatorDelayMs ?? 500)

    clearPending()

    timeoutRef.current = setTimeout(async () => {
      timeoutRef.current = null
      try {
        const response = await fetch(`${API_BASE}/api/game/spectator-move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId }),
        })

        if (!isMountedRef.current) {
          inFlightRef.current = false
          return
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          console.error('[useSpectatorGame] spectator-move failed:', errData.error || response.statusText)
          inFlightRef.current = false
          return
        }

        const data = (await response.json()) as Partial<SpectatorMove>
        if (
          Array.isArray(data.from) &&
          Array.isArray(data.to) &&
          data.from.length === 2 &&
          data.to.length === 2
        ) {
          onPlayerMove({
            from: data.from as [number, number],
            to: data.to as [number, number],
            captured: Array.isArray(data.captured)
              ? (data.captured as [number, number][])
              : undefined,
            path: Array.isArray(data.path)
              ? (data.path as [number, number][])
              : undefined,
          })
        } else {
          console.error('[useSpectatorGame] spectator-move response missing from/to:', data)
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error('[useSpectatorGame] spectator-move error:', err)
        }
      } finally {
        inFlightRef.current = false
      }
    }, delay)
  }, [clearPending, currentPlayer, gameId, gameOver, isPlaying, onPlayerMove])

  const stop = useCallback(() => {
    clearPending()
    inFlightRef.current = false
  }, [clearPending])

  return { requestNextMove, stop }
}
