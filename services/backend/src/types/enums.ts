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

// =========================================================================
// Sistema de Ligas y Ranking
// =========================================================================

export interface League {
  name: string
  title: string // Título para Top 3
  minPoints: number
  maxPoints: number
  difficulty: string
  icon: string
}

export const LEAGUES: League[] = [
  { name: 'Principiante', title: 'Aprendiz Estelar', minPoints: 0, maxPoints: 400, difficulty: 'beginner', icon: '🌌' },
  { name: 'Intermedio', title: 'Viajero Astral', minPoints: 401, maxPoints: 1000, difficulty: 'intermediate', icon: '⚡' },
  { name: 'Master', title: 'Señor de las Estrellas', minPoints: 1001, maxPoints: 2000, difficulty: 'master', icon: '🧠' },
  { name: 'Elite Cósmica', title: 'Titán Galáctico', minPoints: 2001, maxPoints: Infinity, difficulty: 'ultra', icon: '👾' },
]

// Títulos especiales para el Top 3 global
export const TOP_3_TITLES = [
  { rank: 1, title: 'Singularidad Suprema' },
  { rank: 2, title: 'HiperNova' },
  { rank: 3, title: 'SuperNova' },
]
