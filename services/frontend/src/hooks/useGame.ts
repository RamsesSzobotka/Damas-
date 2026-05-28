 'use client'

import { useEffect, useCallback, useRef, useMemo, useState } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { useWebSocket } from '@/hooks/useWebSocket'
import { calculateValidMoves } from '@/utils/checkersMoves'

const API_BASE = 'http://localhost:3001'

type MoveAnimation = {
  from: [number, number]
  to: [number, number]
  piece: number
  actor: 'player' | 'ai'
  delayMs: number
  durationMs: number
}

type PendingMove = {
  board: number[][]
  animation: MoveAnimation
  nextPlayerValue: number
  nextForcedPiece: [number, number] | null
  isGameOver: boolean
}

const PLAYER_MOVE_DURATION_MS = 700
const AI_MOVE_DURATION_MS = 850
const INTER_MOVE_DELAY_MS = 200

const clearTimer = (timer: ReturnType<typeof setTimeout> | null): void => {
  if (timer) {
    clearTimeout(timer)
  }
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
  const [forcedPiece, setForcedPiece] = useState<[number, number] | null>(null)
  const [moveAnimation, setMoveAnimation] = useState<MoveAnimation | null>(null)
  const [moveHistory, setMoveHistory] = useState<
    Array<{ player: 'player' | 'ai'; from: [number, number]; to: [number, number] }>
  >([])

  const playerBoardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aiBoardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const interMoveDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const moveQueueRef = useRef<PendingMove[]>([])
  const isProcessingMoveRef = useRef(false)

  const clearTimers = useCallback(() => {
    clearTimer(playerBoardTimerRef.current)
    clearTimer(aiBoardTimerRef.current)
    clearTimer(animationClearTimerRef.current)
    clearTimer(interMoveDelayTimerRef.current)
    playerBoardTimerRef.current = null
    aiBoardTimerRef.current = null
    animationClearTimerRef.current = null
    interMoveDelayTimerRef.current = null
    moveQueueRef.current = []
    isProcessingMoveRef.current = false
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

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

  const processQueuedMove = useCallback(() => {
    if (isProcessingMoveRef.current) return

    const nextMove = moveQueueRef.current.shift()
    if (!nextMove) return

    isProcessingMoveRef.current = true
    clearTimer(animationClearTimerRef.current)
    clearTimer(interMoveDelayTimerRef.current)
    
    // Show the animation on the CURRENT board state
    setMoveAnimation(nextMove.animation)

    // Wait for the animation to finish
    // THEN update the board so the piece doesn't jump while animating
    const totalAnimationTime = nextMove.animation.durationMs

    animationClearTimerRef.current = setTimeout(() => {
      // Animation finished, now update the board state
      setBoard(nextMove.board)
      setCurrentPlayer(nextMove.nextPlayerValue)

      if (nextMove.nextForcedPiece) {
        setForcedPiece(nextMove.nextForcedPiece)
        setSelectedPiece(nextMove.nextForcedPiece)
      } else {
        setForcedPiece(null)
        setSelectedPiece(null)
      }

      // Clear the animation visual
      setMoveAnimation(null)

      if (nextMove.isGameOver) {
        isProcessingMoveRef.current = false
        processQueuedMove()
        return
      }

      // Add a small gap before processing the next move
      interMoveDelayTimerRef.current = setTimeout(() => {
        isProcessingMoveRef.current = false
        processQueuedMove()
      }, INTER_MOVE_DELAY_MS)
    }, totalAnimationTime)
  }, [setBoard, setCurrentPlayer, setSelectedPiece])

  const queueMoveAnimation = useCallback(
    (
      nextBoard: number[][],
      animation: MoveAnimation,
      nextPlayerValue: number,
      nextForcedPiece: [number, number] | null,
      isGameOver: boolean,
    ) => {
      moveQueueRef.current.push({
        board: nextBoard,
        animation,
        nextPlayerValue,
        nextForcedPiece,
        isGameOver,
      })

      processQueuedMove()
    },
    [processQueuedMove],
  )

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
      const lastMove = data.lastMove as { from?: unknown; to?: unknown } | undefined

      switch (data.type) {
        case 'game_state':
          clearTimers()
          setMoveAnimation(null)
          setMoveHistory([])
          setBoard(data.board as number[][])
          setCurrentPlayer(data.currentPlayer as number)
          setStatus((data.status === 'gameOver' ? 'gameOver' : 'playing'))
          break
        case 'move_applied':
          if (Array.isArray(lastMove?.from) && Array.isArray(lastMove?.to)) {
            const from = lastMove.from as [number, number]
            const to = lastMove.to as [number, number]
            const sourceBoard = useGameStore.getState().board
            const piece = sourceBoard[from[0]]?.[from[1]] ?? 0

            setMoveHistory((previous) => [
              ...previous,
              { player: 'player', from, to },
            ])

            queueMoveAnimation(
              data.board as number[][],
              {
                from,
                to,
                piece,
                actor: 'player',
                delayMs: 0,
                durationMs: PLAYER_MOVE_DURATION_MS,
              },
              typeof data.nextPlayer === 'number' ? (data.nextPlayer as number) : 1,
              Array.isArray(data.forcedPiece) ? (data.forcedPiece as [number, number]) : null,
              false,
            )
          }
          break
        case 'ai_move':
          if (Array.isArray(lastMove?.from) && Array.isArray(lastMove?.to)) {
            const from = lastMove.from as [number, number]
            const to = lastMove.to as [number, number]
            const sourceBoard = useGameStore.getState().board
            const piece = sourceBoard[from[0]]?.[from[1]] ?? 0

            setMoveHistory((previous) => [
              ...previous,
              { player: 'ai', from, to },
            ])

            queueMoveAnimation(
              data.board as number[][],
              {
                from,
                to,
                piece,
                actor: 'ai',
                delayMs: 0,
                durationMs: AI_MOVE_DURATION_MS,
              },
              typeof data.nextPlayer === 'number' ? (data.nextPlayer as number) : 1,
              null,
              false,
            )
          } else {
            setBoard(data.board as number[][])
            setCurrentPlayer((data.nextPlayer as number) || 1)
            setForcedPiece(null)
            setSelectedPiece(null)
          }
          break
        case 'game_over':
          clearTimers()
          setMoveAnimation(null)
          setBoard(data.board as number[][])
          setStatus('gameOver')
          setResult((data.result as string) || 'Game Over')
          setForcedPiece(null)
          setSelectedPiece(null)
          break
        case 'error':
          setError((data.message as string) || 'An error occurred')
          break
      }
    },
    [clearTimers, queueMoveAnimation, setBoard, setCurrentPlayer, setError, setResult, setStatus],
  )

  const ws = useWebSocket(wsUrl, {
    onMessage: handleMessage,
    onError: () => setError('WebSocket connection error'),
  })

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      const state = useGameStore.getState()

      if (state.status !== 'playing' || state.currentPlayer !== 1) return

      if (forcedPiece && selectedPiece === null && (forcedPiece[0] !== row || forcedPiece[1] !== col)) {
        return
      }

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
    [forcedPiece, selectedPiece, setError, setSelectedPiece, ws],
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
    moveAnimation,
    moveHistory,
  }
}
