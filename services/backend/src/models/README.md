# 📦 Modelos de Base de Datos

Documentación de los modelos TypeScript para la base de datos de Damas.

## 📋 Estructura

Cada modelo se encuentra en su propio archivo y exporta:
- **Schema:** Definición Zod para validación
- **Type:** Tipo TypeScript inferido del schema
- **COLLECTION:** Nombre de la colección en MongoDB
- **INDEXES:** Definición de índices

## 📁 Archivos

### User.ts
Información de usuarios autenticados con Clerk.

```typescript
import { User, UserStats } from '@/models/User'

// Validar documento de usuario
const user = UserSchema.parse(userData)

// Usar tipo
const userData: User = { ... }
```

### Game.ts
Historial de partidas jugadas.

```typescript
import { Game, Move } from '@/models/Game'

const game: Game = {
  userId: new ObjectId(),
  difficulty: 'master',
  board: [...],
  moves: [
    { from: [5, 2], to: [4, 3], movedAt: new Date() }
  ]
}
```

### Ranking.ts
Tabla de rankings actualizada en tiempo real.

```typescript
import { Ranking } from '@/models/Ranking'

const ranking: Ranking = {
  userId: new ObjectId(),
  username: 'jugador123',
  totalPoints: 4280,
  victories: 42
}
```

### Skin.ts
Catálogo de skins disponibles para compra.

```typescript
import { Skin } from '@/models/Skin'

const skin: Skin = {
  name: 'Cyber Pieces',
  type: 'piece',
  rarity: 'rare',
  price: 499
}
```

### Purchase.ts
Historial de compras de usuarios.

```typescript
import { Purchase } from '@/models/Purchase'

const purchase: Purchase = {
  userId: new ObjectId(),
  skinId: new ObjectId(),
  stripePaymentId: 'pi_12345',
  amount: 499,
  status: 'completed'
}
```

### UserSkin.ts
Inventario de usuario (tabla de unión M-N).

```typescript
import { UserSkin } from '@/models/UserSkin'

const userSkin: UserSkin = {
  userId: new ObjectId(),
  skinId: new ObjectId(),
  isEquipped: true,
  equipType: 'piece'
}
```

### AIAnalytic.ts
Análisis de movimientos de la IA (opcional).

```typescript
import { AIAnalytic } from '@/models/AIAnalytic'

const analytic: AIAnalytic = {
  gameId: new ObjectId(),
  difficulty: 'master',
  moveNumber: 1,
  evaluationScore: 8.5,
  executionTime: 145
}
```

## 🔧 Uso

### Importar todo
```typescript
import {
  USER_COLLECTION,
  GAME_COLLECTION,
  UserSchema,
  GameSchema,
  type User,
  type Game
} from '@/models'
```

### Validar datos
```typescript
import { UserSchema } from '@/models/User'

try {
  const user = UserSchema.parse(userData)
  // userData es válido
} catch (error) {
  console.error('Validación fallida:', error.errors)
}
```

### Usar en MongoDB
```typescript
import { getDatabase, getCollection } from '@/database'
import { USER_COLLECTION, UserSchema, type User } from '@/models'

const db = getDatabase()
const collection = db.getCollection(USER_COLLECTION)

// Insertar con validación
const validated = UserSchema.parse(newUserData)
const result = await collection.insertOne(validated)

// Obtener y castear tipo
const user = await collection.findOne({ clerkId: 'user_123' }) as User
```

## ✅ Validación con Zod

Todos los modelos usan Zod para validación robusta:

```typescript
const UserSchema = z.object({
  clerkId: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(3),
  // ...
})
```

### Ventajas:
- ✅ Type-safe
- ✅ Runtime validation
- ✅ Mensajes de error claros
- ✅ Transformaciones automáticas

## 🏗️ Estructura de Carpeta

```
backend/src/
├── models/
│   ├── User.ts          # Usuarios
│   ├── Game.ts          # Partidas
│   ├── Ranking.ts       # Rankings
│   ├── Skin.ts          # Skins
│   ├── Purchase.ts      # Compras
│   ├── UserSkin.ts      # Inventario
│   ├── AIAnalytic.ts    # Análisis IA
│   └── index.ts         # Re-exports
├── database/
│   ├── Database.ts      # Clase conexión
│   └── examples.ts      # Ejemplos de uso
├── types/
│   └── enums.ts         # Enumeraciones
└── ...
```

## 📊 Relaciones Entre Modelos

```
users
  ├─→ games (1-N por userId)
  ├─→ rankings (1-1)
  ├─→ purchases (1-N)
  ├─→ userSkins (1-N)
  └─→ M-N skins (through userSkins)

games
  ├─→ users (N-1)
  └─→ aiAnalytics (1-N)

skins
  ├─→ purchases (1-N)
  ├─→ userSkins (1-N)
  └─→ users M-N (through userSkins)

purchases
  ├─→ users (N-1)
  └─→ skins (N-1)

userSkins (tabla de unión)
  ├─→ users (N-1)
  ├─→ skins (N-1)
  └─→ purchases (N-1 opcional)
```

## 🔍 Enumeraciones

Usar enumeraciones definidas en `types/enums.ts`:

```typescript
import { Difficulty, GameStatus, SkinRarity } from '@/types/enums'

// En lugar de strings directos
const game: Game = {
  difficulty: Difficulty.MASTER,  // ✅ Type-safe
  status: GameStatus.ACTIVE,
  // ...
}
```

## 📝 Buenas Prácticas

1. **Siempre validar entrada:**
   ```typescript
   const user = UserSchema.parse(data)  // ✅
   ```

2. **Usar tipos exportados:**
   ```typescript
   const user: User = { ... }  // ✅
   ```

3. **No mezclar tipos:**
   ```typescript
   // ❌ No mezclar TypeScript types con runtime
   const user: User = userData  // podría fallar en runtime
   
   // ✅ Validar primero
   const user = UserSchema.parse(userData) as User
   ```

4. **Reutilizar schemas:**
   ```typescript
   // En routes/services
   import { UserSchema } from '@/models/User'
   
   app.post('/users', (req) => {
     const user = UserSchema.parse(req.body)
     // ...
   })
   ```

## 🚀 Próximas Adiciones

- [ ] Migrations de datos
- [ ] Seed data para desarrollo
- [ ] Funciones de utilidad por modelo
- [ ] Query builders
- [ ] Pagination helpers

---

**Última actualización:** 26 de mayo de 2026
