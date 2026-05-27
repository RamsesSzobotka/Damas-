import { MongoClient, Db, Collection } from 'mongodb'
import { 
  USER_COLLECTION, USER_INDEXES,
  GAME_COLLECTION, GAME_INDEXES,
  RANKING_COLLECTION, RANKING_INDEXES,
  SKIN_COLLECTION, SKIN_INDEXES,
  PURCHASE_COLLECTION, PURCHASE_INDEXES,
  USER_SKIN_COLLECTION, USER_SKIN_INDEXES,
  AI_ANALYTIC_COLLECTION, AI_ANALYTIC_INDEXES,
} from '../models/index'

export class Database {
  private client: MongoClient
  private db: Db | null = null

  constructor(uri: string) {
    this.client = new MongoClient(uri)
  }

  /**
   * Conectar a la base de datos
   */
  async connect(dbName: string): Promise<Db> {
    try {
      await this.client.connect()
      this.db = this.client.db(dbName)
      console.log(`✅ Conectado a MongoDB: ${dbName}`)
      return this.db
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error)
      throw error
    }
  }

  /**
   * Inicializar colecciones e índices
   */
  async initializeCollections(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }

    try {
      console.log('🔧 Inicializando colecciones e índices...')

      // Users
      await this.createCollection(USER_COLLECTION)
      await this.createIndexes(USER_COLLECTION, USER_INDEXES)

      // Games
      await this.createCollection(GAME_COLLECTION)
      await this.createIndexes(GAME_COLLECTION, GAME_INDEXES)

      // Rankings
      await this.createCollection(RANKING_COLLECTION)
      await this.createIndexes(RANKING_COLLECTION, RANKING_INDEXES)

      // Skins
      await this.createCollection(SKIN_COLLECTION)
      await this.createIndexes(SKIN_COLLECTION, SKIN_INDEXES)

      // Purchases
      await this.createCollection(PURCHASE_COLLECTION)
      await this.createIndexes(PURCHASE_COLLECTION, PURCHASE_INDEXES)

      // User Skins
      await this.createCollection(USER_SKIN_COLLECTION)
      await this.createIndexes(USER_SKIN_COLLECTION, USER_SKIN_INDEXES)

      // AI Analytics
      await this.createCollection(AI_ANALYTIC_COLLECTION)
      await this.createIndexes(AI_ANALYTIC_COLLECTION, AI_ANALYTIC_INDEXES)

      console.log('✅ Colecciones e índices inicializados correctamente')
    } catch (error) {
      console.error('❌ Error inicializando colecciones:', error)
      throw error
    }
  }

  /**
   * Crear colección si no existe
   */
  private async createCollection(name: string): Promise<Collection> {
    try {
      const collections = await this.db!.listCollections().toArray()
      const exists = collections.some((col) => col.name === name)

      if (!exists) {
        await this.db!.createCollection(name)
        console.log(`  ✓ Colección creada: ${name}`)
      } else {
        console.log(`  ✓ Colección ya existe: ${name}`)
      }

      return this.db!.collection(name)
    } catch (error) {
      console.error(`  ✗ Error creando colección ${name}:`, error)
      throw error
    }
  }

  /**
   * Crear índices para una colección solo si no existen.
   * MongoDB createIndex es idempotente, pero这一 verificación evita logs innecesarios.
   */
  private async createIndexes(
    collectionName: string,
    indexes: Array<{ key: Record<string, number>; unique?: boolean }>
  ): Promise<void> {
    try {
      const collection = this.db!.collection(collectionName)
      const existingIndexes = await collection.indexes()
      const existingKeys = existingIndexes.map((idx) =>
        JSON.stringify(idx.key)
      )

      let created = 0
      for (const indexSpec of indexes) {
        const keyStr = JSON.stringify(indexSpec.key)
        if (!existingKeys.includes(keyStr)) {
          await collection.createIndex(indexSpec.key, {
            unique: indexSpec.unique || false,
          })
          created++
        }
      }

      if (created > 0) {
        console.log(`  ✓ ${created} índice(s) creado(s) para: ${collectionName}`)
      } else {
        console.log(`  ✓ Índices ya existen para: ${collectionName}`)
      }
    } catch (error) {
      console.error(`  ✗ Error creando índices para ${collectionName}:`, error)
      throw error
    }
  }

  /**
   * Obtener referencia a la base de datos
   */
  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected')
    }
    return this.db
  }

  /**
   * Obtener colección
   */
  getCollection(name: string): Collection {
    return this.getDb().collection(name)
  }

  /**
   * Cerrar conexión
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.close()
      console.log('✅ Desconectado de MongoDB')
    } catch (error) {
      console.error('❌ Error desconectando de MongoDB:', error)
      throw error
    }
  }

  /**
   * Verificar conexión
   */
  async ping(): Promise<boolean> {
    try {
      const result = await this.getDb().admin().ping()
      return result.ok === 1
    } catch (error) {
      console.error('❌ Error en ping de MongoDB:', error)
      return false
    }
  }

  /**
   * Limpiar todas las colecciones (CUIDADO: solo para testing)
   */
  async clearAllCollections(): Promise<void> {
    try {
      const collections = await this.db!.listCollections().toArray()

      for (const col of collections) {
        await this.db!.collection(col.name).deleteMany({})
      }

      console.log('🗑️  Todas las colecciones vaciadas')
    } catch (error) {
      console.error('❌ Error vaciando colecciones:', error)
      throw error
    }
  }
}

// Export singleton instance
let dbInstance: Database | null = null

export function initializeDatabase(uri: string): Database {
  if (!dbInstance) {
    dbInstance = new Database(uri)
  }
  return dbInstance
}

export function getDatabase(): Database {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return dbInstance
}
