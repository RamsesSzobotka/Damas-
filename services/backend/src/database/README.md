# 🗄️ Base de Datos - Índice

Documentación completa de la base de datos MongoDB para Damas.

## 📋 Contenido

### 📊 Documentos de Referencia

1. **[DATABASE.md](../../Docs/DATABASE.md)** - Estructura completa
   - Descripción de cada colección
   - Campos y tipos
   - Índices estratégicos
   - Ejemplos JSON
   - Operaciones comunes

2. **[DATABASE-RELATIONS.md](../../Docs/DATABASE-RELATIONS.md)** - Relaciones
   - Diagrama ER en Mermaid
   - Relaciones 1-N, 1-1, M-N
   - Queries de ejemplo
   - Agregaciones complejas
   - Análisis de desempeño

3. **[models/README.md](./README.md)** - Uso de modelos
   - Cómo usar cada modelo
   - Validación con Zod
   - Integración con MongoDB
   - Buenas prácticas

## 🏗️ Estructura de Carpeta

```
backend/src/
├── database/
│   ├── Database.ts       # Clase principal de conexión
│   ├── examples.ts       # Ejemplos de uso
│   └── README.md         # Este archivo
├── models/
│   ├── User.ts
│   ├── Game.ts
│   ├── Ranking.ts
│   ├── Skin.ts
│   ├── Purchase.ts
│   ├── UserSkin.ts
│   ├── AIAnalytic.ts
│   ├── index.ts          # Re-exports
│   └── README.md         # Guía de modelos
├── types/
│   └── enums.ts          # Enumeraciones
└── ...
```

## 📁 Las 7 Colecciones

| Colección | Propósito | Documentos |
|-----------|-----------|-----------|
| **users** | Usuarios del sistema | ~100K-1M |
| **games** | Historial de partidas | ~1M-10M |
| **rankings** | Tabla de rankings | ~100K-1M (1 por usuario) |
| **skins** | Catálogo de skins | ~50-200 |
| **purchases** | Historial de compras | ~500K-5M |
| **userSkins** | Inventario (tabla M-N) | ~500K-5M |
| **aiAnalytics** | Análisis IA (opcional) | ~10M-100M (1 por movimiento) |

## 🔗 Relaciones Clave

```
users (root)
├── 1-N → games (historial)
├── 1-1 → rankings (stats)
├── 1-N → purchases (compras)
├── 1-N → userSkins (inventario)
└── M-N → skins (through userSkins)

games
└── 1-N → aiAnalytics (movimientos IA)

skins
├── 1-N → purchases
└── 1-N → userSkins
```

## 🚀 Inicialización

### Setup Automático

Al iniciar el backend, se ejecuta automáticamente:

```typescript
import { setupDatabase } from '@/database/examples'

// En main o entry point
await setupDatabase()
```

Esto:
1. ✅ Conecta a MongoDB
2. ✅ Crea todas las colecciones
3. ✅ Crea todos los índices
4. ✅ Verifica la conexión

### Setup Manual

```typescript
import { initializeDatabase } from '@/database/Database'

const db = initializeDatabase(process.env.MONGODB_URI!)
await db.connect('damas')
await db.initializeCollections()
```

## 📝 Validación con Zod

Todos los modelos usan **Zod** para validación:

```typescript
import { UserSchema, type User } from '@/models/User'

// Validar datos
const user = UserSchema.parse(data)  // ✅ Tipado
```

### Beneficios:
- ✅ Validación en tiempo de ejecución
- ✅ Type inference automático
- ✅ Mensajes de error informativos
- ✅ No requiere ORMs pesados

## 🔍 Queries Comunes

### Obtener usuario por Clerk ID
```javascript
db.users.findOne({ clerkId: "user_..." })
```

### Obtener top 10 jugadores
```javascript
db.rankings
  .find({})
  .sort({ totalPoints: -1 })
  .limit(10)
```

### Historial de partidas
```javascript
db.games
  .find({ userId: ObjectId("...") })
  .sort({ createdAt: -1 })
  .limit(20)
```

### Skins comprados por usuario
```javascript
db.userSkins.find({ userId: ObjectId("...") })
```

Ver [DATABASE.md](../../Docs/DATABASE.md) para más queries.

## 📊 Índices

**Total de índices:** ~40

Estrategia de indexación:
- ✅ Índices en Foreign Keys
- ✅ Índices en campos de filtrado frecuente
- ✅ Índices descendentes para ordenamientos
- ✅ Índices compuestos (userId + createdAt)
- ✅ Índices únicos donde corresponde

### Ejemplos:
```javascript
// Simple
{ userId: 1 }
{ totalPoints: -1 }

// Compuesto
{ userId: 1, createdAt: -1 }

// Único
{ clerkId: 1, unique: true }
```

## 🔒 Seguridad

1. **Credenciales:**
   - Usar variables de entorno
   - Cambiar `admin:password` en producción

2. **Validación:**
   - Todos los datos se validan con Zod
   - No hay inyección SQL/NoSQL

3. **Transacciones:**
   - Usar sesiones para operaciones críticas
   - Especialmente para compras

## 📈 Escalabilidad

Diseño preparado para:
- ✅ Millones de documentos
- ✅ Sharding por userId
- ✅ Replicación
- ✅ Índices eficientes

## 🛠️ Utilidades

### Limpiar BD (CUIDADO: solo testing)
```typescript
const db = getDatabase()
await db.clearAllCollections()
```

### Verificar conexión
```typescript
const connected = await db.ping()
console.log(connected ? '✅ Online' : '❌ Offline')
```

## 📚 Recursos

- [MongoDB Docs](https://docs.mongodb.com)
- [Zod Docs](https://zod.dev)
- [DATABASE.md](../../Docs/DATABASE.md) - Estructura
- [DATABASE-RELATIONS.md](../../Docs/DATABASE-RELATIONS.md) - Relaciones
- [examples.ts](./examples.ts) - Código de ejemplo

## 🔄 Flujo de Datos

### Crear usuario
```
Clerk login → Backend → Validar (Zod) → MongoDB inserta
```

### Crear partida
```
Frontend → Backend validar → Crear en games → Actualizar ranking → Registrar IA
```

### Comprar skin
```
Frontend → Stripe payment → Backend procesar → Crear purchase → Crear userSkin
```

## 📋 Checklist de Setup

- [ ] MongoDB corriendo (local o Docker)
- [ ] Variables de entorno configuradas
- [ ] `npm install` en backend
- [ ] `bun install` en backend (si usa Bun)
- [ ] Ejecutar `setupDatabase()`
- [ ] Verificar índices en MongoDB Compass
- [ ] Ejecutar queries de ejemplo

## ⚠️ Notas Importantes

1. **Desnormalización:** Rankings copia datos de users para queries rápidas
2. **Stateless:** No se guarda sesión; cada request es independiente
3. **ObjectId:** Usar `new ObjectId()` para crear IDs
4. **TTL:** aiAnalytics puede crecer enormemente (considerar TTL)
5. **Backup:** Hacer backup regular de datos en producción

---

**Última actualización:** 26 de mayo de 2026  
**Versión:** 1.0.0
