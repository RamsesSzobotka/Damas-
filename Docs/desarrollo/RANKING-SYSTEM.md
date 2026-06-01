# 🏆 Sistema de Ranking y Ligas - Damas

**Versión:** 1.0  
**Última actualización:** 28 de mayo de 2026  
**Estado:** ✅ Implementado  

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Sistema de Ligas](#sistema-de-ligas)
3. [Fórmula de Puntuación](#fórmula-de-puntuación)
4. [Victoria](#victoria)
5. [Derrota](#derrota)
6. [Auto-Match por Liga](#auto-match-por-liga)
7. [Modos de Juego](#modos-de-juego)
8. [API Endpoints](#api-endpoints)
9. [WebSocket - ranking_update](#websocket---ranking_update)
10. [Frontend - Componentes](#frontend---componentes)
11. [Títulos Top 3](#títulos-top-3)
12. [Diagrama de Flujo](#diagrama-de-flujo)

---

## 🎯 Descripción General

El sistema de ranking implementa un modelo competitivo tipo **ELO/Ligas** donde cada jugador tiene un puntaje dinámico que aumenta o disminuye según su rendimiento en partidas ranked. La dificultad de la IA se ajusta automáticamente según la liga del jugador, creando una experiencia progresiva y desafiante.

**Principios de diseño:**
- Progresión rápida al inicio, más competitiva en rangos altos
- Premiar partidas eficientes y estratégicas, no únicamente ganar
- Cada liga debe sentirse claramente distinta en dificultad
- Un jugador con buen desempeño sube de liga tras ~4-5 victorias consecutivas

---

## 🏅 Sistema de Ligas

### Rangos de Puntos

| Liga | Rango de Puntos | Dificultad IA | Icono |
|------|----------------|---------------|-------|
| **Plutón** | 0 – 400 pts | `beginner` | 🪐 |
| **Nebulosa** | 401 – 1000 pts | `intermediate` | 🌌 |
| **Quásar** | 1001 – 2000 pts | `master` | 💫 |
| **Elite Cósmica** | 2001+ pts | `ultra` | 🌟 |

### Títulos Especiales (Top 3 Global)

| Posición | Título |
|----------|--------|
| 🥇 #1 | **Singularidad Suprema** |
| 🥈 #2 | **HiperNova** |
| 🥉 #3 | **SuperNova** |

---

## 📊 Fórmula de Puntuación

### Constantes

```typescript
// Puntos base por dificultad enfrentada (victoria)
BASE_WIN_POINTS = {
  beginner:     50,
  intermediate: 70,
  master:      100,
  ultra:       130,
}

// Puntos base a perder por liga del jugador (derrota)
BASE_LOSE_POINTS = {
  'Plutón':       15,
  Nebulosa:       20,
  'Quásar':       25,
  'Elite Cósmica': 30,
}
```

---

## ✅ Victoria

```
Puntos_Ganados = Base × Eficiencia × Tiempo × Racha × BonusDificultad
```

### Multiplicador de Eficiencia (fichas sobrevivientes)

Basado en cuántas fichas del jugador quedan al final de la partida:

```typescript
Eficiencia = 0.5 + (fichasSobrevivientes / 12) × 0.5
```

- 12 fichas vivas → `×1.0` (máxima eficiencia)
- 6 fichas vivas → `×0.75`
- 0 fichas vivas → `×0.5` (mínima, apenas ganó)

### Multiplicador de Tiempo

Partidas rápidas = más puntos:

| Duración | Multiplicador |
|----------|--------------|
| < 2 min | `×1.5` | Victoria dominante |
| < 5 min | `×1.3` |
| < 10 min | `×1.1` |
| ≥ 10 min | `×1.0` |

### Multiplicador de Racha

Victorias consecutivas incrementan el puntaje:

| Racha | Multiplicador |
|-------|--------------|
| 0-1 | `×1.0` |
| 2 | `×1.15` |
| 3 | `×1.30` |
| 4 | `×1.50` |
| 5+ | `×1.50 + (racha - 4) × 0.1` |

### Bonus por Dificultad Superior

Si la IA es de una liga superior a la del jugador, se aplica un bonus de `×1.5`.

### Ejemplos de puntuación final

| Tipo | Puntos |
|------|--------|
| Victoria dominante y rápida (< 2 min, 12 fichas, racha 3+) | +90 a +140 pts |
| Victoria estándar | +40 a +80 pts |
| Victoria contra IA de liga superior | Bonus adicional |

Valores acotados: `mínimo 30, máximo 200`

---

## ❌ Derrota

```
Puntos_Perdidos = -(Base × Penalización × DiferenciaRango)
```

**El tiempo NO se toma en cuenta en las derrotas.**

### Penalización por Claridad de Derrota

Basado en fichas restantes de la IA al finalizar:

| Fichas IA | Penalización | Tipo |
|-----------|-------------|------|
| ≥ 10 | `×1.8` | Derrota aplastante |
| 7–9 | `×1.4` | Derrota clara |
| 4–6 | `×1.0` | Derrota ajustada |
| 1–3 | `×0.6` | Derrota muy ajustada |

### Ajuste por Diferencia de Rango

| Situación | Ajuste |
|-----------|--------|
| Perder contra IA de misma liga | `×1.0` |
| Perder contra IA más débil | `+30%` por liga de diferencia |
| Perder contra IA más fuerte | `-10%` por liga de diferencia (mínimo 0.5) |

### Ejemplos de pérdida final

| Tipo | Puntos |
|------|--------|
| Derrota ajustada | -15 a -30 pts |
| Derrota clara contra la IA | -50 a -100 pts |

Valores acotados: `mínimo -100, máximo -10`

---

## 🤖 Auto-Match por Liga

Cuando un jugador inicia una partida en modo **Ranked**, el backend determina automáticamente la dificultad de la IA según su puntaje actual:

```typescript
función getDifficultyForPoints(puntos):
    si puntos <= 400  → "beginner"
    si puntos <= 1000 → "intermediate"
    si puntos <= 2000 → "master"
    si puntos > 2000  → "ultra"
```

- **Subida de liga:** Si el jugador acumula puntos suficientes, la siguiente partida lo enfrentará automáticamente contra la IA de la nueva liga.
- **Bajada de liga:** Si pierde puntos suficientes para caer por debajo del umbral de su liga actual, será emparejado con la IA de la liga inferior.

Esto garantiza que el jugador siempre enfrente un desafío acorde a su nivel.

---

## 🎮 Modos de Juego

El sistema soporta dos modos completamente independientes:

| Aspecto | JUGAR (Ranked) | RETOS (Práctica) |
|---------|---------------|------------------|
| **Ruta** | Menú → JUGAR | Menú → RETOS → Seleccionar dificultad |
| **Auth requerida** | ✅ Sí | ❌ No |
| **Dificultad IA** | Auto-según liga | Manual (elige jugador) |
| **Afecta ranking** | ✅ Sí | ❌ No |
| **Flujo** | Directo a partida | Pasa por selector de dificultad |

### Comportamiento en el menú

- Si el usuario hace clic en **JUGAR** sin estar autenticado, se redirige automáticamente a RETOS.
- **RETOS** siempre está disponible para cualquier usuario.

---

## 🌐 API Endpoints

### `GET /api/rankings`

Obtiene el Top 100 del ranking global (paginado).

**Query params:**
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `limit` | number | 100 | Máximo de resultados (max 200) |
| `skip` | number | 0 | Saltar primeros N |

**Response:**
```json
{
  "rankings": [
    {
      "rank": 1,
      "username": "ProPlayer99",
      "league": {
        "name": "Elite Cósmica",
        "title": "Titán Galáctico",
        "icon": "🌟",
        "minPoints": 2001,
        "maxPoints": "∞",
        "difficulty": "ultra"
      },
      "title": "Singularidad Suprema",
      "totalPoints": 5200,
      "victories": 89,
      "totalGames": 114,
      "winRate": 78.1,
      "currentStreak": 5,
      "bestStreak": 12,
      "averageMovements": 24.3
    }
  ],
  "total": 100,
  "skip": 0,
  "limit": 100
}
```

### `GET /api/rankings/user/:clerkId`

Obtiene el ranking y estadísticas detalladas de un usuario específico.

**Response:**
```json
{
  "username": "Player1",
  "rank": 42,
  "league": {
    "name": "Quásar",
    "title": "Señor de las Estrellas",
    "icon": "💫",
    "minPoints": 1001,
    "maxPoints": 2000,
    "difficulty": "master"
  },
  "stats": {
    "totalPoints": 1450,
    "victories": 22,
    "totalGames": 43,
    "winRate": 51.2,
    "averageMovements": 28.5,
    "currentStreak": 3,
    "bestStreak": 7,
    "victoriesByDifficulty": {
      "beginner": 10,
      "intermediate": 8,
      "master": 4,
      "ultra": 0
    }
  },
  "recentGames": [
    {
      "result": "victory",
      "difficulty": "master",
      "mode": "ranked",
      "pointsEarned": 85,
      "completedAt": "2026-05-28T...",
      "duration": 245,
      "totalMoves": 32,
      "leagueAtPlay": "Nebulosa"
    }
  ]
}
```

### `GET /api/rankings/my-stats`

Obtiene ranking y estadísticas del usuario autenticado (requiere Bearer token).

**Response:** Misma estructura que `/user/:clerkId`.

### `GET /api/rankings/position`

Endpoint ligero que solo devuelve la posición actual y datos de liga del usuario autenticado.

**Response:**
```json
{
  "username": "Player1",
  "rank": 42,
  "totalPoints": 1450,
  "league": {
    "name": "Quásar",
    "icon": "💫",
    "difficulty": "master",
    "minPoints": 1001,
    "maxPoints": 2000
  },
  "nextLeaguePoints": 551
}
```

### `GET /api/rankings/leagues`

Información pública de todas las ligas disponibles.

**Response:**
```json
{
  "leagues": [
    { "name": "Plutón", "minPoints": 0, "maxPoints": 400, "difficulty": "beginner", "icon": "🪐" },
    { "name": "Nebulosa", "minPoints": 401, "maxPoints": 1000, "difficulty": "intermediate", "icon": "🌌" },
    { "name": "Quásar", "minPoints": 1001, "maxPoints": 2000, "difficulty": "master", "icon": "💫" },
    { "name": "Elite Cósmica", "minPoints": 2001, "maxPoints": "∞", "difficulty": "ultra", "icon": "🌟" }
  ]
}
```

---

## 📡 WebSocket - ranking_update

Cuando una partida en modo **ranked** termina, el backend envía un mensaje `ranking_update` a través del WebSocket con los resultados:

```json
{
  "type": "ranking_update",
  "pointsEarned": 85,
  "leagueBefore": "Nebulosa",
  "leagueAfter": "Quásar",
  "won": true,
  "streak": 4,
  "totalPoints": 1050
}
```

### Campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `pointsEarned` | number | Puntos ganados (positivo) o perdidos (negativo) |
| `leagueBefore` | string | Liga del jugador antes de la partida |
| `leagueAfter` | string | Liga del jugador después de la partida |
| `won` | boolean | `true` si el jugador ganó |
| `streak` | number | Racha actual de victorias (post-partida) |
| `totalPoints` | number | Puntos totales acumulados (post-partida) |

El frontend usa este mensaje para mostrar el resultado en el overlay de game over.

---

## 🖥️ Frontend - Componentes

### RankingsContainer (`components/Rankings/RankingsContainer.tsx`)

Tabla de líderes con estilo arcade espacial:

- **Columnas:** #, Jugador, Liga, Puntos, Victorias, Win Rate
- **Top 3:** Resaltados con bordes dorado/plateado/bronce y títulos especiales
- **Filtros:** Todos / Plutón / Nebulosa / Quásar / Elite Cósmica
- **Jugador actual:** Destacado con borde izquierdo dorado y ⭐
- **Tarjeta "Tu Posición":** Muestra liga, puntos y progreso hacia la siguiente liga

### GameContainer (`components/Game/GameContainer.tsx`)

Durante la partida en modo ranked:
- Panel izquierdo muestra: liga actual, puntos, dificultad IA, tiempo
- Al terminar: overlay con resultado de ranking (puntos ganados/perdidos, cambio de liga, racha)

---

## 🗺️ Diagrama de Flujo

```
                    ┌──────────────────┐
                    │      MENÚ        │
                    └────┬─────────┬───┘
                         │         │
                    ┌────▼──┐  ┌───▼────────┐
                    │ JUGAR │  │   RETOS     │
                    │(auth?)│  │(cualquiera) │
                    └───┬───┘  └───┬────────┘
                        │          │
                   ┌────▼───┐ ┌───▼──────────┐
                   │¿Auth?  │ │Selector diff. │
                   │ No→RETOS│ │(manual)       │
                   │ Sí→OK   │ └───┬──────────┘
                   └────┬───┘     │
                        │         │
                   ┌────▼─────────▼──────────┐
                   │   POST /api/game/create  │
                   │   mode: "ranked"│"practice"│
                   └────────┬─────────────────┘
                            │
                   ┌────────▼─────────┐
                   │  WebSocket game  │
                   │  (partida en     │
                   │   tiempo real)   │
                   └────────┬─────────┘
                            │
                   ┌────────▼─────────┐
                   │  ¿Game Over?     │
                   │  Sí → Calcular   │
                   │  puntos ranking  │
                   └────────┬─────────┘
                            │
                   ┌────────▼─────────┐
                   │ ranking_update   │
                   │ → Frontend       │
                   │ → MongoDB        │
                   └──────────────────┘
```

---

## 🗂️ Archivos del Sistema

### Backend

| Archivo | Propósito |
|---------|-----------|
| `services/rankingService.ts` | Lógica de puntuación, ligas, auto-difficulty, persistencia |
| `routes/rankings.ts` | Endpoints REST para consulta de rankings |
| `types/enums.ts` | Constantes `LEAGUES` y `TOP_3_TITLES` |
| `models/Ranking.ts` | Schema Zod para el documento de ranking en MongoDB |
| `models/Game.ts` | Campos `mode` y `leagueAtPlay` añadidos |
| `routes/game.ts` | Auto-asignación de dificultad en modo ranked |
| `routes/auth.ts` | Inicialización de ranking al sincronizar usuario |
| `index.ts` | Procesamiento de ranking vía WebSocket |

### Frontend

| Archivo | Propósito |
|---------|-----------|
| `routes/rankings/index.tsx` | Ruta `/rankings` |
| `components/Rankings/RankingsContainer.tsx` | Tabla de líderes |
| `hooks/useGame.ts` | Integración con ranking (auth, mode, ranking_update) |
| `components/Game/GameContainer.tsx` | Visualización de liga y resultados ranking |
| `components/Menu/MainMenu.tsx` | Redirección a RETOS si no auth |

---

## 📐 Colección MongoDB: `rankings`

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // Referencia única a User (unique index)
  username: String,        // Denormalizado para consultas rápidas
  totalPoints: Number,     // Puntaje acumulado
  rank: Number,            // Posición en el ranking global

  // Estadísticas
  victories: Number,
  totalGames: Number,
  winRate: Number,         // Porcentaje (0-100)
  averageMovements: Number,

  // Por dificultad
  victoriesByDifficulty: {
    beginner: Number,
    intermediate: Number,
    master: Number,
    ultra: Number,
  },

  // Streaks
  bestStreak: Number,
  currentStreak: Number,

  // Tiempos
  createdAt: Date,
  updatedAt: Date,
  lastGameAt: Date,
}
```

**Índices:**
- `userId` (único)
- `totalPoints` (descendente — para rankings)
- `rank`
- `updatedAt`
- `winRate`

---

**Documento preparado por:** Equipo de Desarrollo  
**Última actualización:** 28 de mayo de 2026  
**Versión:** 1.0  
**Estado:** ✅ Implementado
