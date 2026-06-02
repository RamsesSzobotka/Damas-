import { z } from 'zod'
import { ObjectId } from 'mongodb'

/**
 * Skin Model
 * Catálogo de skins disponibles para compra
 */

export const SkinSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  name: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  type: z.enum(['piece', 'board', 'piece_and_board']),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  
  // Información comercial
  price: z.number().positive('Precio debe ser positivo'),
  currency: z.enum(['USD', 'EUR', 'MXN']).default('USD'),
  
  // Imágenes
  imageUrl: z.string().url('URL de imagen debe ser válida'),
  previewUrl: z.string().url('URL de preview debe ser válida').optional(),
  
  // Colores y estilos (para personalizarse)
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color debe ser hex válido').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color debe ser hex válido').optional(),
  theme: z.enum(['classic', 'pixel', 'cyberpunk']).optional(),
  components: z.array(z.string()).optional(),
  
  // Disponibilidad
  isActive: z.boolean().default(true),
  isLimited: z.boolean().default(false),
  limitedQuantity: z.number().optional(),
  soldCount: z.number().default(0),
  
  // Tiempos
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  releaseDate: z.date().optional(),
})

export type Skin = z.infer<typeof SkinSchema>

export const SKIN_COLLECTION = 'skins'

// Índices para colección skins
export const SKIN_INDEXES = [
  { key: { type: 1 } },
  { key: { price: 1 } },
  { key: { rarity: 1 } },
  { key: { isActive: 1 } },
  { key: { createdAt: -1 } },
  { key: { soldCount: -1 } },
]
