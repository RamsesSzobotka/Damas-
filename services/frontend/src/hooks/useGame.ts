 'use client'

import { useEffect, useCallback, useRef, useMemo, useState } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { useWebSocket } from '@/hooks/useWebSocket'

const API_BASE = 'http://localhost:3001'

function calculateValidMoves(
  board: number[][],
  selectedPiece: [number, number] | null,
): [number, number][] {
  if (!selectedPiece) return []

  const [row, col] = selectedPiece
  const piece = board[row]?.[col]
  if (!piece || piece === 0) return []

  const isPlayer = piece === 1 || piece === 3
  const isKing = piece === 3 || piece === 4

  if (!isPlayer) return []

  const directions: [number, number][] = isKing
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : [[-1, -1], [-1, 1]]

  const moves: [number, number][] = []

  for (const [dr, dc] of directions) {
    const nr = row + dr
    const nc = col + dc

    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === 0) {
      moves.push([nr, nc])
    }

    const cr = row + 2 * dr
    const cc = col + 2 * dc
    const midPiece = board[nr]?.[nc]

    if (
      cr >= 0 &&
      cr < 8 &&
      cc >= 0 &&
      cc < 8 &&
      midPiece !== 0 &&
      midPiece !== undefined &&
      midPiece !== piece &&
      (midPiece === 2 || midPiece === 4) &&
      board[cr][cc] === 0
    ) {
      moves.push([cr, cc])
    }
  }

  return moves
}

export function useGame(difficulty: string) {
  const initialState = useGameStore.getState()

  const [gameId, setGameIdLocal] = useState(initialState.gameId)
  const [board, setBoardLocal] = useState(initialState.board)
  const [selectedPiece, setSelectedPiece] = useState(initialState.selectedPiece)
  const [status, setStatusLocal] = useState(initialState.status)
  const [result, setResultLocal] = useState(initialState.result)
  const [isLoading, setIsLoading] = useState(initialState.isLoading)
  const [error, setErrorLocal] = useState(initialState.error)
  const [currentPlayer, setCurrentPlayerLocal] = useState(initialState.currentPlayer)

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state) => {
      setGameIdLocal(state.gameId)
      setBoardLocal(state.board)
      setStatusLocal(state.status)
      setResultLocal(state.result)
      setIsLoading(state.isLoading)
      setErrorLocal(state.error)
      setCurrentPlayerLocal(state.currentPlayer)
    })

    return unsubscribe
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    useGameStore.getState().setLoading(loading)
  }, [])

  const setError = useCallback((message: string | null) => {
    useGameStore.getState().setError(message)
  }, [])

  const setDifficulty = useCallback((value: string) => {
    useGameStore.getState().setDifficulty(value)
  }, [])

  const setGameId = useCallback((value: string) => {
    useGameStore.getState().setGameId(value)
  }, [])

  const setBoard = useCallback((value: number[][]) => {
    useGameStore.getState().setBoard(value)
  }, [])

  const setStatus = useCallback((value: 'idle' | 'playing' | 'gameOver') => {
    useGameStore.getState().setStatus(value)
  }, [])

  const setCurrentPlayer = useCallback((value: number) => {
    useGameStore.getState().setCurrentPlayer(value)
  }, [])

  const setSelectedPieceLocal = useCallback((value: [number, number] | null) => {
    setSelectedPiece(value)
  }, [])

  const setResult = useCallback((value: string | null) => {
    useGameStore.getState().setResult(value)
  }, [])

  const gameStartedRef = useRef(false)

  useEffect(() => {
    if (gameStartedRef.current) return
    gameStartedRef.current = true

    const startGame = async () => {
      setLoading(true)
      setError(null)
      setDifficulty(difficulty)

      try {
        const response = await fetch(`${API_BASE}/api/game/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ difficulty }),
        })

        if (!response.ok) {
          throw new Error(`Failed to create game: ${response.statusText}`)
        }

        const data = await response.json()
        setGameId(data.gameId)
        setBoard(data.board)
        setStatus('playing')
        setCurrentPlayer(1)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start game')
      } finally {
        setLoading(false)
      }
    }

    startGame()
  }, [
    difficulty,
    setBoard,
    setCurrentPlayer,
    setDifficulty,
    setError,
    setGameId,
    setLoading,
    setStatus,
  ])

  const wsUrl = useMemo(
    () => (gameId ? `ws://localhost:3001/ws?gameId=${gameId}` : null),
    [gameId],
  )

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = event.data as Record<string, unknown>

      switch (data.type) {
        case 'game_state':
          setBoard(data.board as number[][])
          setCurrentPlayer(data.currentPlayer as number)
          setStatus((data.status === 'gameOver' ? 'gameOver' : 'playing'))
          break
        case 'move_applied':
          setBoard(data.board as number[][])
          setCurrentPlayer(2)
          break
        case 'ai_move':
          setBoard(data.board as number[][])
          setCurrentPlayer(1)
          break
        case 'game_over':
          setBoard(data.board as number[][])
          setStatus('gameOver')
          setResult((data.result as string) || 'Game Over')
          break
        case 'error':
          setError((data.message as string) || 'An error occurred')
          break
      }
    },
    [setBoard, setCurrentPlayer, setError, setResult, setStatus],
  )

  const ws = useWebSocket(wsUrl, {
    onMessage: handleMessage,
    onError: () => setError('WebSocket connection error'),
  })

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      const state = useGameStore.getState()

      if (state.status !== 'playing' || state.currentPlayer !== 1) return

      const piece = state.board[row][col]

      if (selectedPiece === null) {
        if (piece === 1 || piece === 3) {
          setSelectedPiece([row, col])
        }
        return
      }

      const [selRow, selCol] = selectedPiece

      if (selRow === row && selCol === col) {
        setSelectedPiece(null)
        return
      }

      if (piece === 1 || piece === 3) {
        setSelectedPiece([row, col])
        return
      }

      const validMoves = calculateValidMoves(state.board, selectedPiece)
      const isValidDestination = validMoves.some(
        ([moveRow, moveCol]) => moveRow === row && moveCol === col,
      )

      if (!isValidDestination) {
        return
      }

      if (!ws.isConnected) {
        setError('Conectando al servidor...')
        return
      }

      ws.send({
        type: 'player_move',
        gameId: state.gameId,
        from: [selRow, selCol],
        to: [row, col],
      })

      setSelectedPiece(null)
    },
    [selectedPiece, setError, setSelectedPiece, ws],
  )

  return {
    board,
    selectedPiece,
    status,
    result,
    isLoading,
    error,
    isConnected: ws.isConnected,
    currentPlayer,
    handleSquareClick,
  }
}
