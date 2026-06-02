// Board representation constants and types for checkers

export const EMPTY = 0
export const PLAYER = 1
export const AI = 2
export const PLAYER_KING = 3
export const AI_KING = 4
export const BOARD_SIZE = 8

/** 8×8 matrix — 0=empty, 1=player, 2=AI, 3=player king, 4=AI king */
export type Board = number[][]

/** [row, col] tuple */
export type Position = [number, number]

export interface Move {
  from: Position
  to: Position
  captured?: Position[]
  /** All landing positions in sequence, including from and to. e.g. [A, C, E] for A→C→E multi-capture */
  path?: Position[]
}
