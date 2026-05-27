import { z } from 'zod'
import { ObjectId } from 'mongodb'

/**
 * UserSkin Model
 * Tabla de unión M-N entre Users y Skins
 * Representa inventario del usuario y qué skins están equipados
 */

export const UserSkinSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: z.instanceof(ObjectId), // Referencia a User
  skinId: z.instanceof(ObjectId), // Referencia a Skin
  
  // Equipado
  isEquipped: z.boolean().default(false),
  equipType: z.enum(['piece', 'board']).optional(), // Qué está equipado
  
  // Adquisición
  purchaseId: z.instanceof(ObjectId).optional(), // Referencia a Purchase (si fue comprado)
  acquiredAt: z.date().default(() => new Date()),
  
  // Uso
  timesUsed: z.number().default(0),
  lastUsedAt: z.date().optional(),
  
  // Tiempos
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type UserSkin = z.infer<typeof UserSkinSchema>

export const USER_SKIN_COLLECTION = 'userSkins'

// Índices para colección userSkins
export const USER_SKIN_INDEXES = [
  { key: { userId: 1, skinId: 1 }, unique: true },
  { key: { userId: 1 } },
  { key: { skinId: 1 } },
  { key: { isEquipped: 1 } },
  { key: { userId: 1, isEquipped: 1 } },
  { key: { userId: 1, equipType: 1 } },
  { key: { acquiredAt: -1 } },
]
