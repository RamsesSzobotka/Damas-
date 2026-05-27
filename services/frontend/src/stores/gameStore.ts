'use client'

import { create } from 'zustand'

interface GameState {
  gameId: string | null
  board: number[][]
  currentPlayer: number
  selectedPiece: [number, number] | null
  status: 'idle' | 'playing' | 'gameOver'
  result: string | null
  difficulty: string
  isLoading: boolean
  error: string | null

  setGameId: (id: string) => void
  setBoard: (board: number[][]) => void
  setCurrentPlayer: (player: number) => void
  selectPiece: (pos: [number, number] | null) => void
  setStatus: (status: 'idle' | 'playing' | 'gameOver') => void
  setResult: (result: string | null) => void
  setDifficulty: (difficulty: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const createEmptyBoard = (): number[][] =>
  Array.from({ length: 8 }, () => Array(8).fill(0))

const initialState = {
  gameId: null as string | null,
  board: createEmptyBoard(),
  currentPlayer: 1,
  selectedPiece: null as [number, number] | null,
  status: 'idle' as const,
  result: null as string | null,
  difficulty: 'principiante',
  isLoading: false,
  error: null as string | null,
}

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  setGameId: (id: string) => set({ gameId: id }),
  setBoard: (board: number[][]) => set({ board }),
  setCurrentPlayer: (player: number) => set({ currentPlayer: player }),
  selectPiece: (pos: [number, number] | null) => set({ selectedPiece: pos }),
  setStatus: (status: 'idle' | 'playing' | 'gameOver') => set({ status }),
  setResult: (result: string | null) => set({ result }),
  setDifficulty: (difficulty: string) => set({ difficulty }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  reset: () => set({ ...initialState, board: createEmptyBoard() }),
}))
