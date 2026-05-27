import { z } from 'zod'
import { ObjectId } from 'mongodb'

/**
 * Purchase Model
 * Historial de compras de usuarios
 */

export const PurchaseSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: z.instanceof(ObjectId), // Referencia a User
  skinId: z.instanceof(ObjectId), // Referencia a Skin
  
  // Información de pago (Stripe)
  stripePaymentId: z.string().min(1, 'Stripe Payment ID requerido'),
  stripeCustomerId: z.string().optional(),
  
  // Detalles de la compra
  amount: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'MXN']).default('USD'),
  
  // Estado
  status: z.enum(['pending', 'completed', 'failed', 'refunded']).default('pending'),
  
  // Información del producto en momento de compra
  skinName: z.string(),
  skinType: z.enum(['piece', 'board', 'piece_and_board']),
  skinRarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  
  // Métodos de pago y detalles
  paymentMethod: z.enum(['card', 'apple_pay', 'google_pay']).optional(),
  
  // Tiempos
  purchasedAt: z.date().default(() => new Date()),
  processedAt: z.date().optional(),
  refundedAt: z.date().optional(),
  
  // Notas
  notes: z.string().optional(),
})

export type Purchase = z.infer<typeof PurchaseSchema>

export const PURCHASE_COLLECTION = 'purchases'

// Índices para colección purchases
export const PURCHASE_INDEXES = [
  { key: { userId: 1 } },
  { key: { skinId: 1 } },
  { key: { stripePaymentId: 1 }, unique: true },
  { key: { status: 1 } },
  { key: { purchasedAt: -1 } },
  { key: { userId: 1, purchasedAt: -1 } },
]
