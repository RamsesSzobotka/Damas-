import { getDatabase } from './Database'
import { SKIN_COLLECTION } from '@/models/Skin'

interface SeedSkin {
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
  imageUrl: string
  previewUrl: string
}

const SEED_SKINS: SeedSkin[] = [
  {
    name: 'Fichas Negras',
    description: 'Fichas de color negro clásico. Un estilo sobrio y elegante para tus partidas.',
    primaryColor: '#1A1A1A',
    secondaryColor: '#404040',
    imageUrl: 'https://via.placeholder.com/200x200/1A1A1A/FFFFFF?text=Negras',
    previewUrl: 'https://via.placeholder.com/400x400/1A1A1A/FFFFFF?text=Fichas+Negras',
  },
  {
    name: 'Fichas Amarillas',
    description: 'Fichas de color amarillo brillante. Ilumina el tablero con este vibrante tono.',
    primaryColor: '#FFD700',
    secondaryColor: '#FFA500',
    imageUrl: 'https://via.placeholder.com/200x200/FFD700/000000?text=Amarillas',
    previewUrl: 'https://via.placeholder.com/400x400/FFD700/000000?text=Fichas+Amarillas',
  },
  {
    name: 'Fichas Verdes',
    description: 'Fichas de color verde esmeralda. Un tono fresco y natural para tus juegos.',
    primaryColor: '#32CD32',
    secondaryColor: '#228B22',
    imageUrl: 'https://via.placeholder.com/200x200/32CD32/000000?text=Verdes',
    previewUrl: 'https://via.placeholder.com/400x400/32CD32/000000?text=Fichas+Verdes',
  },
  {
    name: 'Fichas Magenta',
    description: 'Fichas de color magenta intenso. Destaca en el tablero con este llamativo tono.',
    primaryColor: '#FF00FF',
    secondaryColor: '#8B008B',
    imageUrl: 'https://via.placeholder.com/200x200/FF00FF/FFFFFF?text=Magenta',
    previewUrl: 'https://via.placeholder.com/400x400/FF00FF/FFFFFF?text=Fichas+Magenta',
  },
  {
    name: 'Fichas Azul Claro',
    description: 'Fichas de color azul cielo. Un tono suave y relajante para partidas tranquilas.',
    primaryColor: '#87CEEB',
    secondaryColor: '#4682B4',
    imageUrl: 'https://via.placeholder.com/200x200/87CEEB/000000?text=Azul+Claro',
    previewUrl: 'https://via.placeholder.com/400x400/87CEEB/000000?text=Fichas+Azul+Claro',
  },
]

export async function seedShopSkins(): Promise<void> {
  try {
    const skinsCollection = getDatabase().getCollection(SKIN_COLLECTION)

    let created = 0
    let skipped = 0

    for (const skin of SEED_SKINS) {
      const existing = await skinsCollection.findOne({ name: skin.name })

      if (existing) {
        console.log(`  ∘ Skin "${skin.name}" ya existe — omitida`)
        skipped++
        continue
      }

      await skinsCollection.insertOne({
        ...skin,
        type: 'piece',
        rarity: 'common',
        price: 199,
        currency: 'USD',
        isActive: true,
        isLimited: false,
        soldCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log(`  ✓ Skin "${skin.name}" creada`)
      created++
    }

    if (created > 0) {
      console.log(`🎨 Seed completado: ${created} skin(s) creada(s), ${skipped} omitida(s)`)
    } else {
      console.log(`🎨 Seed: todas las skins ya existían (${skipped} omitida(s))`)
    }
  } catch (error) {
    console.error('❌ Error en seed de skins:', error)
  }
}
