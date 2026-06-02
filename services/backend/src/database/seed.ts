import { getDatabase } from './Database'
import { SKIN_COLLECTION } from '@/models/Skin'

interface SeedSkin {
  name: string
  description: string
  type?: string
  primaryColor: string
  secondaryColor: string
  imageUrl: string
  previewUrl: string
  rarity?: string
  price?: number
  theme?: string
  components?: string[]
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
  // Boards
  {
    name: 'Tablero Clásico',
    description: 'Tablero con colores clásicos en tonos púrpura. Un estilo elegante y tradicional.',
    type: 'board',
    primaryColor: '#1E1050',
    secondaryColor: '#6B5FAF',
    imageUrl: 'https://via.placeholder.com/200x200/1E1050/FFFFFF?text=Clasico',
    previewUrl: 'https://via.placeholder.com/400x400/1E1050/FFFFFF?text=Tablero+Clasico',
  },
  {
    name: 'Tablero Noche & Día',
    description: 'Tablero en blanco y negro. Máximo contraste para una visibilidad perfecta.',
    type: 'board',
    primaryColor: '#0D0D0D',
    secondaryColor: '#F0F0F0',
    imageUrl: 'https://via.placeholder.com/200x200/0D0D0D/FFFFFF?text=Noche',
    previewUrl: 'https://via.placeholder.com/400x400/0D0D0D/FFFFFF?text=Tablero+Noche',
  },
  {
    name: 'Tablero Bosque',
    description: 'Tablero en tonos verdes. Una experiencia natural y fresca.',
    type: 'board',
    primaryColor: '#1A3A1A',
    secondaryColor: '#90EE90',
    imageUrl: 'https://via.placeholder.com/200x200/1A3A1A/FFFFFF?text=Bosque',
    previewUrl: 'https://via.placeholder.com/400x400/1A3A1A/FFFFFF?text=Tablero+Bosque',
  },
  {
    name: 'Tablero Atlántico',
    description: 'Tablero en tonos azules. Sumérgete en partidas con estilo oceánico.',
    type: 'board',
    primaryColor: '#003366',
    secondaryColor: '#87CEEB',
    imageUrl: 'https://via.placeholder.com/200x200/003366/FFFFFF?text=Atlantico',
    previewUrl: 'https://via.placeholder.com/400x400/003366/FFFFFF?text=Tablero+Atlantico',
  },
  {
    name: 'Tablero Atardecer',
    description: 'Tablero en tonos púrpura y naranja. Un atardecer en cada partida.',
    type: 'board',
    primaryColor: '#4A0E3B',
    secondaryColor: '#FF9966',
    imageUrl: 'https://via.placeholder.com/200x200/4A0E3B/FFFFFF?text=Atardecer',
    previewUrl: 'https://via.placeholder.com/400x400/4A0E3B/FFFFFF?text=Tablero+Atardecer',
  },
  // === Pixel Art Theme ===
  {
    name: 'Ficha Pixel',
    description: 'Ficha con estilo pixel art retro. Un clásico de los videojuegos en tu tablero.',
    type: 'piece',
    rarity: 'uncommon',
    price: 599,
    theme: 'pixel',
    primaryColor: '#8B4513',
    secondaryColor: '#D2691E',
    imageUrl: 'https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Ficha+Pixel',
    previewUrl: 'https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Ficha+Pixel',
  },
  {
    name: 'Tablero Pixel',
    description: 'Tablero con estilo pixel art. Nostalgia pura en cada partida.',
    type: 'board',
    rarity: 'uncommon',
    price: 599,
    theme: 'pixel',
    primaryColor: '#2D5A27',
    secondaryColor: '#8FBC8F',
    imageUrl: 'https://via.placeholder.com/200x200/2D5A27/FFFFFF?text=Tablero+Pixel',
    previewUrl: 'https://via.placeholder.com/400x400/2D5A27/FFFFFF?text=Tablero+Pixel',
  },
  // === Cyberpunk / Neon Theme ===
  {
    name: 'Ficha Cyber',
    description: 'Ficha cyberpunk con neón. El futuro en tus manos.',
    type: 'piece',
    rarity: 'uncommon',
    price: 599,
    theme: 'cyberpunk',
    primaryColor: '#FF00FF',
    secondaryColor: '#00FFFF',
    imageUrl: 'https://via.placeholder.com/200x200/FF00FF/FFFFFF?text=Ficha+Cyber',
    previewUrl: 'https://via.placeholder.com/400x400/FF00FF/FFFFFF?text=Ficha+Cyber',
  },
  {
    name: 'Tablero Cyber',
    description: 'Tablero cyberpunk oscuro con neón. Una experiencia visual intensa.',
    type: 'board',
    rarity: 'uncommon',
    price: 599,
    theme: 'cyberpunk',
    primaryColor: '#0D0221',
    secondaryColor: '#FF00FF',
    imageUrl: 'https://via.placeholder.com/200x200/0D0221/FFFFFF?text=Tablero+Cyber',
    previewUrl: 'https://via.placeholder.com/400x400/0D0221/FFFFFF?text=Tablero+Cyber',
  },
  // === Paquetes piece_and_board ===
  {
    name: 'Paquete Pixel',
    description: 'Paquete completo de estilo pixel art: fichas y tablero a juego.',
    type: 'piece_and_board',
    rarity: 'legendary',
    price: 2999,
    theme: 'pixel',
    components: ['Ficha Pixel', 'Tablero Pixel'],
    primaryColor: '#8B4513',
    secondaryColor: '#8FBC8F',
    imageUrl: 'https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Paquete+Pixel',
    previewUrl: 'https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Paquete+Pixel',
  },
  {
    name: 'Paquete Cyber',
    description: 'Paquete completo cyberpunk: fichas y tablero con estilo neón.',
    type: 'piece_and_board',
    rarity: 'legendary',
    price: 2999,
    theme: 'cyberpunk',
    components: ['Ficha Cyber', 'Tablero Cyber'],
    primaryColor: '#FF00FF',
    secondaryColor: '#00FFFF',
    imageUrl: 'https://via.placeholder.com/200x200/FF00FF/FFFFFF?text=Paquete+Cyber',
    previewUrl: 'https://via.placeholder.com/400x400/FF00FF/FFFFFF?text=Paquete+Cyber',
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
        type: skin.type || 'piece',
        rarity: skin.rarity || 'common',
        price: skin.price || 199,
        currency: 'USD',
        isActive: true,
        isLimited: false,
        soldCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(skin.theme ? { theme: skin.theme } : {}),
        ...(skin.components ? { components: skin.components } : {}),
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
