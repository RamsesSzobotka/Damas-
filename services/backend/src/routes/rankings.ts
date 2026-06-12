/**
 * Rankings Routes
 *
 * Endpoints REST para el sistema de ranking y ligas.
 * - GET /api/rankings → Top 100 líderes
 * - GET /api/rankings/user/:clerkId → Ranking y stats de un usuario
 * - GET /api/rankings/my-stats → Stats del usuario autenticado
 * - GET /api/rankings/leagues → Información de ligas
 * - GET /api/rankings/position → Posición del usuario autenticado
 */

import { Hono } from 'hono'
import { verifyToken } from '@clerk/backend'
import { getDatabase } from '@/database/Database'
import { USER_COLLECTION } from '@/models/User'
import { GAME_COLLECTION } from '@/models/Game'
import { LEAGUES } from '@/types/enums'
import {
  getTopRankings,
  getUserRankingByClerkId,
  getUserRankPosition,
  getLeagueForPoints,
} from '@/services/rankingService'
import type { User } from '@/models/User'

const rankingRoutes = new Hono()

/**
 * GET /api/rankings
 * Obtiene el Top 100 del ranking global.
 * Query params: limit (default: 100), skip (default: 0)
 */
rankingRoutes.get('/api/rankings', async (c) => {
  try {
    const limit = Math.min(parseInt(c.req.query('limit') || '100'), 200)
    const skip = Math.max(0, parseInt(c.req.query('skip') || '0'))

    const rankings = await getTopRankings(limit, skip)

    return c.json({
      rankings: rankings.map((r, index) => ({
        rank: skip + index + 1,
        username: r.username,
        league: r.league,
        title: r.title,
        totalPoints: r.totalPoints,
        victories: r.victories,
        totalGames: r.totalGames,
        winRate: r.winRate,
        currentStreak: r.currentStreak,
        bestStreak: r.bestStreak,
        averageMovements: r.averageMovements,
      })),
      total: rankings.length,
      skip,
      limit,
    })
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return c.json({ error: 'Error al obtener rankings' }, 500)
  }
})

/**
 * GET /api/rankings/user/:clerkId
 * Obtiene el ranking y estadísticas de un usuario específico.
 */
rankingRoutes.get('/api/rankings/user/:clerkId', async (c) => {
  try {
    const { clerkId } = c.req.param()
    const ranking = await getUserRankingByClerkId(clerkId)

    if (!ranking) {
      return c.json({ error: 'Usuario no encontrado en rankings' }, 404)
    }

    const rank = await getUserRankPosition(ranking.userId)
    const league = getLeagueForPoints(ranking.totalPoints)

    // Obtener últimas 10 partidas
    const db = getDatabase()
    const gamesCol = db.getCollection(GAME_COLLECTION)
    const recentGames = await gamesCol
      .find({ userId: ranking.userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(10)
      .toArray()

    return c.json({
      username: ranking.username,
      rank,
      league: {
        name: league.name,
        title: league.title,
        icon: league.icon,
        minPoints: league.minPoints,
        maxPoints: league.maxPoints,
        difficulty: league.difficulty,
      },
      stats: {
        totalPoints: ranking.totalPoints,
        victories: ranking.victories,
        totalGames: ranking.totalGames,
        winRate: ranking.winRate,
        averageMovements: ranking.averageMovements,
        currentStreak: ranking.currentStreak,
        bestStreak: ranking.bestStreak,
        victoriesByDifficulty: ranking.victoriesByDifficulty,
      },
      recentGames: recentGames.map((g) => ({
        result: g.result,
        difficulty: g.difficulty,
        mode: g.mode,
        pointsEarned: g.pointsEarned,
        completedAt: g.completedAt,
        duration: g.duration,
        totalMoves: g.totalMoves,
        leagueAtPlay: g.leagueAtPlay,
      })),
    })
  } catch (error) {
    console.error('Error fetching user ranking:', error)
    return c.json({ error: 'Error al obtener ranking del usuario' }, 500)
  }
})

/**
 * GET /api/rankings/my-stats
 * Obtiene ranking y estadísticas del usuario autenticado.
 */
rankingRoutes.get('/api/rankings/my-stats', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Token de autorización requerido' }, 401)
    }

    const payload = await verifyToken(authHeader.slice(7), {
      secretKey: process.env.CLERK_SECRET_KEY || '',
    })

    const db = getDatabase()
    const usersCol = db.getCollection(USER_COLLECTION)
    const user = await usersCol.findOne({ clerkId: payload.sub }) as User | null

    if (!user) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }

    const rank = await getUserRankPosition(user._id!)
    const league = getLeagueForPoints(user.stats.totalPoints)

    // Últimas 10 partidas ranked
    const gamesCol = db.getCollection(GAME_COLLECTION)
    const recentGames = await gamesCol
      .find({ userId: user._id!, status: 'completed', mode: 'ranked' })
      .sort({ completedAt: -1 })
      .limit(10)
      .toArray()

    return c.json({
      clerkId: user.clerkId,
      username: user.username,
      rank,
      league: {
        name: league.name,
        title: league.title,
        icon: league.icon,
        minPoints: league.minPoints,
        maxPoints: league.maxPoints,
        difficulty: league.difficulty,
      },
      stats: user.stats,
      recentGames: recentGames.map((g) => ({
        result: g.result,
        difficulty: g.difficulty,
        pointsEarned: g.pointsEarned,
        completedAt: g.completedAt,
        duration: g.duration,
        totalMoves: g.totalMoves,
        leagueAtPlay: g.leagueAtPlay,
      })),
    })
  } catch (error) {
    console.error('Error fetching my stats:', error)
    return c.json({ error: 'Error al obtener estadísticas' }, 500)
  }
})

/**
 * GET /api/rankings/leagues
 * Información pública de todas las ligas.
 */
rankingRoutes.get('/api/rankings/leagues', async (c) => {
  return c.json({
    leagues: LEAGUES.map((l) => ({
      name: l.name,
      title: l.title,
      minPoints: l.minPoints,
      maxPoints: l.maxPoints === Infinity ? '∞' : l.maxPoints,
      difficulty: l.difficulty,
      icon: l.icon,
    })),
  })
})

/**
 * GET /api/rankings/position
 * Obtiene solo la posición del usuario autenticado (ligero).
 */
rankingRoutes.get('/api/rankings/position', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Token de autorización requerido' }, 401)
    }

    const payload = await verifyToken(authHeader.slice(7), {
      secretKey: process.env.CLERK_SECRET_KEY || '',
    })

    const db = getDatabase()
    const usersCol = db.getCollection(USER_COLLECTION)
    const user = await usersCol.findOne({ clerkId: payload.sub }) as User | null

    if (!user) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }

    const rank = await getUserRankPosition(user._id!)
    const league = getLeagueForPoints(user.stats.totalPoints)

    return c.json({
      username: user.username,
      rank,
      totalPoints: user.stats.totalPoints,
      league: {
        name: league.name,
        icon: league.icon,
        difficulty: league.difficulty,
        minPoints: league.minPoints,
        maxPoints: league.maxPoints === Infinity ? '∞' : league.maxPoints,
      },
      nextLeaguePoints: league.maxPoints === Infinity
        ? null
        : Math.max(0, league.maxPoints - user.stats.totalPoints + 1),
    })
  } catch (error) {
    console.error('Error fetching position:', error)
    return c.json({ error: 'Error al obtener posición' }, 500)
  }
})

export { rankingRoutes }
