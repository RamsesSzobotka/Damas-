/**
 * Ranking Service
 *
 * Sistema de ranking competitivo tipo ELO/Ligas.
 * Gestiona puntuación dinámica, ligas, rachas y estadísticas.
 * Progresión rápida al inicio, más competitiva en rangos altos.
 */

import { ObjectId } from 'mongodb'
import { getDatabase } from '@/database/Database'
import { RANKING_COLLECTION } from '@/models/Ranking'
import { USER_COLLECTION } from '@/models/User'
import { GAME_COLLECTION } from '@/models/Game'
import { LEAGUES } from '@/types/enums'
import type { Ranking } from '@/models/Ranking'
import type { User } from '@/models/User'
import type { Game } from '@/models/Game'

// =========================================================================
// Tipos
// =========================================================================

export interface LeagueInfo {
  name: string
  title: string
  minPoints: number
  maxPoints: number
  difficulty: string
  icon: string
}

export interface RankingResult {
  pointsEarned: number
  leagueBefore: string
  leagueAfter: string
  won: boolean
  streak: number
  totalPoints: number
}

// =========================================================================
// Constantes de puntuación
// =========================================================================

/** Puntos base por dificultad enfrentada */
const BASE_WIN_POINTS: Record<string, number> = {
  beginner: 50,
  intermediate: 70,
  master: 100,
  ultra: 130,
}

/** Puntos base a perder por liga del jugador */
const BASE_LOSE_POINTS: Record<string, number> = {
  'Plutón': 15,
  Nebulosa: 20,
  'Quásar': 25,
  'Elite Cósmica': 30,
}

const MAX_PIECES = 12

// =========================================================================
// Funciones de liga
// =========================================================================

/**
 * Obtiene la liga correspondiente a un puntaje.
 */
export function getLeagueForPoints(points: number): LeagueInfo {
  for (const league of LEAGUES) {
    if (points >= league.minPoints && points <= league.maxPoints) {
      return league
    }
  }
  return LEAGUES[LEAGUES.length - 1] // Elite Cósmica (default)
}

/**
 * Obtiene la dificultad de IA que debe enfrentar un jugador según su puntaje.
 */
export function getDifficultyForPoints(points: number): string {
  return getLeagueForPoints(points).difficulty
}

/**
 * Obtiene el título especial para un ranking (Top 3).
 */
export function getTopTitle(rank: number): string | null {
  const entry = [
    { rank: 1, title: 'Singularidad Suprema' },
    { rank: 2, title: 'HiperNova' },
    { rank: 3, title: 'SuperNova' },
  ].find((e) => e.rank === rank)
  return entry?.title ?? null
}

// =========================================================================
// Cálculo de puntuación
// =========================================================================

interface ScoreInput {
  won: boolean
  difficulty: string // beginner | intermediate | master | ultra
  playerPiecesLeft: number // fichas del jugador al final
  aiPiecesLeft: number // fichas de la IA al final
  totalMoves: number
  durationSeconds: number
  streak: number // racha de victorias actual
  playerTotalPoints: number // puntos totales del jugador antes de esta partida
  playerLeague: LeagueInfo
  aiLeague: LeagueInfo
}

/**
 * Calcula el multiplicador por tiempo (solo victorias).
 * Partidas rápidas = más puntos.
 */
function getTimeMultiplier(durationSeconds: number): number {
  if (durationSeconds < 120) return 1.5 // < 2 min → dominante
  if (durationSeconds < 300) return 1.3 // < 5 min
  if (durationSeconds < 600) return 1.1 // < 10 min
  return 1.0 // ≥ 10 min
}

/**
 * Calcula el multiplicador por eficiencia (fichas sobrevivientes).
 */
function getEfficiencyMultiplier(piecesLeft: number): number {
  return 0.5 + (piecesLeft / MAX_PIECES) * 0.5 // 0.5 (sin fichas) → 1.0 (12 fichas)
}

/**
 * Calcula el multiplicador por racha de victorias.
 */
function getStreakMultiplier(streak: number): number {
  if (streak <= 0) return 1.0
  if (streak === 1) return 1.0
  if (streak === 2) return 1.15
  if (streak === 3) return 1.3
  if (streak === 4) return 1.5
  return 1.5 + (streak - 4) * 0.1 // +0.1 por victoria extra
}

/**
 * Calcula el bonus por vencer a una IA de liga superior.
 */
function getDifficultyBonus(playerLeague: LeagueInfo, aiLeague: LeagueInfo): number {
  if (aiLeague.minPoints > playerLeague.maxPoints) {
    return 1.5 // Victoriacontra IA de liga superior
  }
  return 1.0
}

/**
 * Calcula el multiplicador de penalización por derrota según fichas restantes de la IA.
 * Más fichas vivas de la IA = derrota más clara = más penalización.
 */
function getDefeatPenalty(aiPiecesLeft: number): number {
  if (aiPiecesLeft >= 10) return 1.8 // Derrota aplastante
  if (aiPiecesLeft >= 7) return 1.4
  if (aiPiecesLeft >= 4) return 1.0 // Derrota ajustada
  return 0.6 // Derrota muy ajustada (casi ganó)
}

/**
 * Ajuste por diferencia de rango en derrotas.
 * Perder contra IA más débil = más penalización.
 * Perder contra IA más fuerte = menos penalización.
 */
function getRankDifferencePenalty(playerLeague: LeagueInfo, aiLeague: LeagueInfo): number {
  const playerIdx = LEAGUES.findIndex((l) => l.name === playerLeague.name)
  const aiIdx = LEAGUES.findIndex((l) => l.name === aiLeague.name)
  const diff = playerIdx - aiIdx

  if (diff > 0) return 1.0 + diff * 0.3 // Perdió contra IA más débil → +30% por liga
  if (diff < 0) return Math.max(0.5, 1.0 + diff * 0.1) // Perdió contra IA más fuerte → -10% por liga
  return 1.0 // Misma liga
}

/**
 * Calcula los puntos ganados o perdidos después de una partida.
 */
export function calculatePoints(input: ScoreInput): { points: number; isRankUp: boolean; isRankDown: boolean } {
  const newTotal = Math.max(0, input.playerTotalPoints)

  if (input.won) {
    // =====================================================================
    // Cálculo de VICTORIA
    // =====================================================================
    const base = BASE_WIN_POINTS[input.difficulty] || 50
    const timeMult = getTimeMultiplier(input.durationSeconds)
    const effMult = getEfficiencyMultiplier(input.playerPiecesLeft)
    const streakMult = getStreakMultiplier(input.streak)
    const diffBonus = getDifficultyBonus(input.playerLeague, input.aiLeague)

    let points = Math.round(base * effMult * timeMult * streakMult * diffBonus)

    // Victoria dominante y rápida → +90 a +140
    // Victoria estándar → +40 a +80
    points = Math.max(30, Math.min(200, points))

    // Verificar subida de liga
    const projectedTotal = newTotal + points
    const currentLeague = getLeagueForPoints(newTotal)
    const projectedLeague = getLeagueForPoints(projectedTotal)
    const isRankUp = projectedLeague.minPoints > currentLeague.minPoints

    return { points, isRankUp, isRankDown: false }
  } else {
    // =====================================================================
    // Cálculo de DERROTA
    // =====================================================================
    const baseLose = BASE_LOSE_POINTS[input.playerLeague.name] || 20
    const defeatPenalty = getDefeatPenalty(input.aiPiecesLeft)
    const rankDiff = getRankDifferencePenalty(input.playerLeague, input.aiLeague)

    let points = -Math.round(baseLose * defeatPenalty * rankDiff)

    // Derrota ajustada: -15 a -30
    // Derrota clara: -50 a -100
    points = Math.max(-100, Math.min(-10, points))

    // Verificar bajada de liga
    const projectedTotal = Math.max(0, newTotal + points)
    const currentLeague = getLeagueForPoints(newTotal)
    const projectedLeague = getLeagueForPoints(projectedTotal)
    const isRankDown = projectedLeague.maxPoints < currentLeague.minPoints && currentLeague.minPoints > 0

    return { points, isRankUp: false, isRankDown }
  }
}

// =========================================================================
// Persistencia de ranking
// =========================================================================

/**
 * Actualiza el ranking y estadísticas del usuario después de una partida.
 */
export async function updateRankingAfterGame(
  userId: ObjectId,
  gameResult: {
    won: boolean
    difficulty: string
    playerPiecesLeft: number
    aiPiecesLeft: number
    totalMoves: number
    durationSeconds: number
    mode: 'ranked' | 'practice'
  }
): Promise<RankingResult | null> {
  // Solo ranked afecta el ranking
  if (gameResult.mode !== 'ranked') {
    return null
  }

  const db = getDatabase()
  const rankingsCol = db.getCollection(RANKING_COLLECTION)
  const usersCol = db.getCollection(USER_COLLECTION)

  // Obtener ranking actual del usuario
  let ranking = await rankingsCol.findOne({ userId }) as Ranking | null

  if (!ranking) {
    // Si no existe ranking, crearlo
    const user = await usersCol.findOne({ _id: userId }) as User | null
    if (!user) return null

    const newRanking: Ranking = {
      userId,
      username: user.username,
      totalPoints: 0,
      victories: 0,
      totalGames: 0,
      winRate: 0,
      averageMovements: 0,
      victoriesByDifficulty: { beginner: 0, intermediate: 0, master: 0, ultra: 0 },
      bestStreak: 0,
      currentStreak: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await rankingsCol.insertOne(newRanking)
    ranking = { ...newRanking, _id: result.insertedId }
  }

  const playerLeague = getLeagueForPoints(ranking.totalPoints)

  // Mapear dificultad → liga de la IA
  const DIFFICULTY_LEAGUE_MAP: Record<string, string> = {
    beginner: 'Plutón',
    intermediate: 'Nebulosa',
    master: 'Quásar',
    ultra: 'Elite Cósmica',
  }
  const aiLeagueName = DIFFICULTY_LEAGUE_MAP[gameResult.difficulty] || 'Plutón'
  const aiLeague = LEAGUES.find((l) => l.name === aiLeagueName) || LEAGUES[0]

  // Calcular puntos
  const scoreResult = calculatePoints({
    won: gameResult.won,
    difficulty: gameResult.difficulty,
    playerPiecesLeft: gameResult.playerPiecesLeft,
    aiPiecesLeft: gameResult.aiPiecesLeft,
    totalMoves: gameResult.totalMoves,
    durationSeconds: gameResult.durationSeconds,
    streak: ranking.currentStreak,
    playerTotalPoints: ranking.totalPoints,
    playerLeague,
    aiLeague,
  })

  const newTotalPoints = Math.max(0, ranking.totalPoints + scoreResult.points)
  const newStreak = gameResult.won ? ranking.currentStreak + 1 : 0
  const newVictories = ranking.victories + (gameResult.won ? 1 : 0)
  const newTotalGames = ranking.totalGames + 1
  const newWinRate = Math.round((newVictories / Math.max(1, newTotalGames)) * 1000) / 10

  // Calcular nuevo promedio de movimientos
  const oldTotalMoves = ranking.averageMovements * (ranking.totalGames || 1)
  const newAvgMoves = Math.round(((oldTotalMoves + gameResult.totalMoves) / newTotalGames) * 10) / 10

  // Actualizar victorias por dificultad
  const victoriesByDifficulty = { ...ranking.victoriesByDifficulty }
  if (gameResult.won) {
    const diffKey = gameResult.difficulty as keyof typeof victoriesByDifficulty
    if (diffKey in victoriesByDifficulty) {
      victoriesByDifficulty[diffKey]++
    }
  }

  // Mejor racha
  const newBestStreak = Math.max(ranking.bestStreak, newStreak)

  // Actualizar ranking en MongoDB
  const updateData: Record<string, unknown> = {
    $set: {
      totalPoints: newTotalPoints,
      victories: newVictories,
      totalGames: newTotalGames,
      winRate: newWinRate,
      averageMovements: newAvgMoves,
      victoriesByDifficulty,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      lastGameAt: new Date(),
      updatedAt: new Date(),
    },
  }

  // Actualizar username por si cambió
  const user = await usersCol.findOne({ _id: userId }) as User | null
  if (user && user.username !== ranking.username) {
    (updateData.$set as any).username = user.username
  }

  await rankingsCol.updateOne({ userId }, updateData)

  // Actualizar stats del usuario
  const userUpdate: Record<string, unknown> = {
    $set: {
      'stats.totalPoints': newTotalPoints,
      'stats.winRate': newWinRate,
      'stats.averageMovements': newAvgMoves,
      'stats.bestStreak': newBestStreak,
      'stats.currentStreak': newStreak,
      updatedAt: new Date(),
    },
    $inc: {
      'stats.totalGames': 1,
      'stats.totalVictories': gameResult.won ? 1 : 0,
      'stats.totalDefeats': gameResult.won ? 0 : 1,
    },
  }

  await usersCol.updateOne({ _id: userId }, userUpdate as any)

  // Determinar ligas
  const leagueBefore = playerLeague.name
  const leagueAfter = getLeagueForPoints(newTotalPoints).name

  return {
    pointsEarned: scoreResult.points,
    leagueBefore,
    leagueAfter,
    won: gameResult.won,
    streak: newStreak,
    totalPoints: newTotalPoints,
  }
}

/**
 * Obtiene el ranking de un usuario por su ID de usuario (MongoDB).
 */
export async function getUserRanking(userId: ObjectId): Promise<(Ranking & { _id: ObjectId }) | null> {
  const db = getDatabase()
  const rankingsCol = db.getCollection(RANKING_COLLECTION)
  return await rankingsCol.findOne({ userId }) as (Ranking & { _id: ObjectId }) | null
}

/**
 * Obtiene el ranking de un usuario por su clerkId.
 */
export async function getUserRankingByClerkId(clerkId: string): Promise<(Ranking & { _id: ObjectId }) | null> {
  const db = getDatabase()
  const usersCol = db.getCollection(USER_COLLECTION)
  const user = await usersCol.findOne({ clerkId }) as User | null
  if (!user?._id) return null

  const rankingsCol = db.getCollection(RANKING_COLLECTION)
  return await rankingsCol.findOne({ userId: user._id }) as (Ranking & { _id: ObjectId }) | null
}

/**
 * Obtiene el Top N del ranking global.
 */
export async function getTopRankings(
  limit: number = 100,
  skip: number = 0
): Promise<Array<Ranking & { _id: ObjectId; league: LeagueInfo; title: string | null }>> {
  const db = getDatabase()
  const rankingsCol = db.getCollection(RANKING_COLLECTION)

  const rankings = await rankingsCol
    .find()
    .sort({ totalPoints: -1 })
    .skip(skip)
    .limit(limit)
    .toArray()

  // Actualizar posición (rank)
  const enrichedRankings = rankings.map((r, index) => {
    const rank = skip + index + 1
    const league = getLeagueForPoints(r.totalPoints)
    const title = getTopTitle(rank)
    return { ...r, rank, league, title }
  })

  // Persistir rank en MongoDB (solo para top 100)
  for (const r of enrichedRankings) {
    await rankingsCol.updateOne(
      { _id: r._id },
      { $set: { rank: r.rank } }
    )
  }

  return enrichedRankings
}

/**
 * Obtiene la posición de un usuario en el ranking.
 */
export async function getUserRankPosition(userId: ObjectId): Promise<number> {
  const db = getDatabase()
  const rankingsCol = db.getCollection(RANKING_COLLECTION)

  const ranking = await rankingsCol.findOne({ userId }) as Ranking | null
  if (!ranking) return 0

  // Contar cuántos tienen más puntos
  const higherCount = await rankingsCol.countDocuments({
    totalPoints: { $gt: ranking.totalPoints },
  })

  return higherCount + 1
}

/**
 * Inicializa un documento de ranking para un usuario nuevo.
 */
export async function initializeRanking(userId: ObjectId, username: string): Promise<void> {
  const db = getDatabase()
  const rankingsCol = db.getCollection(RANKING_COLLECTION)

  // Solo crear si no existe
  const existing = await rankingsCol.findOne({ userId })
  if (existing) return

  const newRanking: Ranking = {
    userId,
    username,
    totalPoints: 0,
    victories: 0,
    totalGames: 0,
    winRate: 0,
    averageMovements: 0,
    victoriesByDifficulty: { beginner: 0, intermediate: 0, master: 0, ultra: 0 },
    bestStreak: 0,
    currentStreak: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await rankingsCol.insertOne(newRanking)
  console.log(`🏆 Ranking inicializado para usuario: ${username}`)
}
