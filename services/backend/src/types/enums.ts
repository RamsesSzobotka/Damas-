/**
 * Tipos y constantes globales del backend
 */

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  MASTER = 'master',
  ULTRA = 'ultra',
}

export enum GameStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum GameResult {
  VICTORY = 'victory',
  DEFEAT = 'defeat',
  DRAW = 'draw',
}

export enum SkinType {
  PIECE = 'piece',
  BOARD = 'board',
  PIECE_AND_BOARD = 'piece_and_board',
}

export enum SkinRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export enum PurchaseStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CARD = 'card',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

export const BOARD_SIZE = 8
export const INITIAL_PIECES_PER_PLAYER = 12
