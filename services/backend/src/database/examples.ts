/**
 * Ejemplo de inicialización de base de datos
 * Este archivo muestra cómo conectar y usar los modelos
 */

import { ObjectId } from 'mongodb'
import { initializeDatabase, getDatabase } from './Database'
import {
  USER_COLLECTION,
  GAME_COLLECTION,
  RANKING_COLLECTION,
  SKIN_COLLECTION,
  PURCHASE_COLLECTION,
  USER_SKIN_COLLECTION,
  AI_ANALYTIC_COLLECTION,
  UserSchema,
  GameSchema,
  RankingSchema,
  SkinSchema,
  PurchaseSchema,
  UserSkinSchema,
  AIAnalyticSchema,
} from '../models/index'

/**
 * Inicializar la base de datos
 * Llamar esta función al iniciar el servidor
 */
export async function setupDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/damas'
    const dbName = process.env.MONGODB_NAME || 'damas'

    console.log('🚀 Inicializando base de datos...')

    // Crear instancia y conectar
    const db = initializeDatabase(mongoUri)
    await db.connect(dbName)

    // Verificar conexión
    const isConnected = await db.ping()
    if (!isConnected) {
      throw new Error('No se pudo verificar la conexión a MongoDB')
    }

    // Inicializar colecciones e índices
    await db.initializeCollections()

    console.log('✅ Base de datos inicializada correctamente')
    return db
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error)
    process.exit(1)
  }
}

/**
 * Ejemplo: Crear un nuevo usuario
 */
export async function exampleCreateUser() {
  const db = getDatabase()
  const usersCollection = db.getCollection(USER_COLLECTION)

  const newUser = {
    clerkId: 'user_test_123',
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    stats: {
      totalVictories: 0,
      totalDefeats: 0,
      totalDraws: 0,
      totalGames: 0,
      totalPoints: 0,
      winRate: 0,
      averageMovements: 0,
      bestStreak: 0,
      currentStreak: 0,
    },
    inventory: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  }

  // Validar con Zod
  const validated = UserSchema.parse(newUser)

  // Insertar
  const result = await usersCollection.insertOne(validated)
  console.log('Usuario creado:', result.insertedId)

  return result.insertedId
}

/**
 * Ejemplo: Obtener usuario por Clerk ID
 */
export async function exampleGetUserByClerkId(clerkId: string) {
  const db = getDatabase()
  const usersCollection = db.getCollection(USER_COLLECTION)

  const user = await usersCollection.findOne({ clerkId })
  console.log('Usuario encontrado:', user)

  return user
}

/**
 * Ejemplo: Obtener top 10 rankings
 */
export async function exampleGetTopRankings() {
  const db = getDatabase()
  const rankingsCollection = db.getCollection(RANKING_COLLECTION)

  const topPlayers = await rankingsCollection
    .find({})
    .sort({ totalPoints: -1 })
    .limit(10)
    .toArray()

  console.log('Top 10 jugadores:', topPlayers)
  return topPlayers
}

/**
 * Ejemplo: Obtener historial de partidas de un usuario
 */
export async function exampleGetUserGames(userId: string) {
  const db = getDatabase()
  const gamesCollection = db.getCollection(GAME_COLLECTION)

  const games = await gamesCollection
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray()

  console.log('Partidas del usuario:', games)
  return games
}

/**
 * Ejemplo: Obtener skins disponibles para compra
 */
export async function exampleGetAvailableSkins() {
  const db = getDatabase()
  const skinsCollection = db.getCollection(SKIN_COLLECTION)

  const skins = await skinsCollection
    .find({ isActive: true })
    .sort({ createdAt: -1 })
    .toArray()

  console.log('Skins disponibles:', skins)
  return skins
}

/**
 * Ejemplo: Obtener inventario del usuario
 */
export async function exampleGetUserInventory(userId: string) {
  const db = getDatabase()
  const userSkinsCollection = db.getCollection(USER_SKIN_COLLECTION)

  const inventory = await userSkinsCollection
    .find({ userId: new ObjectId(userId) })
    .toArray()

  console.log('Inventario del usuario:', inventory)
  return inventory
}

/**
 * Ejemplo: Registrar una compra
 */
export async function exampleCreatePurchase(
  userId: string,
  skinId: string,
  stripePaymentId: string,
  amount: number
) {
  const db = getDatabase()
  const purchasesCollection = db.getCollection(PURCHASE_COLLECTION)

  const newPurchase = {
    userId: new ObjectId(userId),
    skinId: new ObjectId(skinId),
    stripePaymentId,
    amount,
    currency: 'USD',
    status: 'completed',
    skinName: 'Example Skin',
    skinType: 'piece',
    skinRarity: 'rare',
    paymentMethod: 'card',
    purchasedAt: new Date(),
    processedAt: new Date(),
  }

  // Validar
  const validated = PurchaseSchema.parse(newPurchase)

  // Insertar
  const result = await purchasesCollection.insertOne(validated)
  console.log('Compra registrada:', result.insertedId)

  return result.insertedId
}

export default setupDatabase
