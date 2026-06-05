# Damas Universe — Contexto del Proyecto

> Documento de referencia rápida para agentes IA y desarrolladores.
> Última actualización: Junio 2026

---

## 1. Descripción General

**Damas Universe** es una plataforma moderna de juego de damas (checkers) en línea con arquitectura de microservicios. Permite jugar contra una IA de 4 niveles de dificultad, con autenticación, sistema competitivo de ligas y ranking, tienda de skins personalizables y pagos integrados con Stripe.

Proyecto universitario — **Desarrollo de Software IX**.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| **Frontend** | TanStack Start (React 19) | ^19.0.0 | Meta-framework full-stack con SSR |
| | TanStack Router | ^1.168.0 | Routing tipado file-based |
| | TanStack Query | ^5.75.0 | Data fetching y cache |
| | Zustand | ^5.0.0 | Estado global del juego |
| | TailwindCSS | ^3.4.0 | Estilos utilitarios |
| | Clerk (TanStack) | ^1.3.0 | Autenticación social y email |
| | Vite | ^6.0.0 | Build y dev server |
| **Backend** | Bun | >=1.0.0 | Runtime JavaScript |
| | Hono | ^4.0.0 | Framework HTTP ligero |
| | MongoDB Driver | ^6.3.0 | Base de datos NoSQL |
| | Clerk SDK | ^3.4.0 | Verificación de tokens JWT |
| | Stripe SDK | ^14.0.0 | Procesamiento de pagos |
| | Zod | ^3.22.0 | Validación de esquemas |
| **IA Service** | Bun + Hono | - | Servicio independiente de IA |
| | Zod | ^3.22.0 | Validación de entrada |
| **Base de datos** | MongoDB | 7.0 | Documentos con índices |
| **Infraestructura** | Docker Compose | - | Orquestación multi-contenedor |

---

## 3. Estructura de Carpetas

```
Damas-/
├── README.md
├── Docs/                              # Documentación
│   ├── PRD.md
│   ├── TANSTACK-START-GUIDE.md
│   ├── CONTEXT.md                     # ← Este archivo
│   ├── desarrollo/
│   │   ├── PLAN-DESARROLLO.md
│   │   ├── DATABASE.md
│   │   ├── DATABASE-RELATIONS.md
│   │   ├── RANKING-SYSTEM.md
│   │   └── AI-ALGORITHMS.md
│   ├── wireframes/                    # 5 wireframes (menú, dificultad, juego, rankings, tienda)
│   └── agents/
│       └── Skill_Damas_Universe_UIUX.md
│
└── services/
    ├── README.md / SETUP.md / DOCKER_COMMANDS.md
    ├── docker-compose.yml / .env.example
    │
    ├── frontend/                      # Interfaz de usuario (TanStack Start)
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vite.config.ts             # Alias @/ para imports
    │   ├── tailwind.config.ts
    │   ├── postcss.config.js
    │   ├── Dockerfile                 # Multi-stage build
    │   └── src/
    │       ├── ssr.tsx                # Entry point SSR
    │       ├── routeTree.gen.ts       # Árbol de rutas generado automáticamente
    │       ├── styles/
    │       │   └── globals.css
    │       ├── routes/
    │       │   ├── __root.tsx         # Layout raíz (ClerkProvider, tema neon oscuro)
    │       │   ├── index.tsx          # Menú principal (/)
    │       │   ├── game/
    │       │   │   ├── play.tsx       # Contenedor de juego (/game/play)
    │       │   │   └── difficulty.tsx # Selector de dificultad (/game/difficulty)
    │       │   ├── shop/
    │       │   │   └── index.tsx      # Tienda de skins (/shop)
    │       │   └── rankings/
    │       │       └── index.tsx      # Tabla de clasificación (/rankings)
    │       ├── components/
    │       │   ├── Menu/MainMenu.tsx
    │       │   ├── Game/GameContainer.tsx
    │       │   ├── Game/DifficultySelect.tsx
    │       │   ├── Game/Board.tsx (inferido)
    │       │   ├── Shop/ShopContainer.tsx
    │       │   └── Rankings/RankingsContainer.tsx
    │       ├── hooks/
    │       │   └── useBackgroundMusic.ts
    │       ├── stores/
    │       │   └── gameStore.ts       # Estado global con Zustand
    │       ├── utils/
    │       │   ├── checkersMoves.ts   # Cálculo de movimientos válidos (cliente)
    │       │   └── playButtonSound.ts # Efectos de sonido
    │       └── test/
    │           └── setup.ts
    │
    ├── backend/                       # API REST + WebSocket (Bun + Hono)
    │   ├── package.json
    │   ├── tsconfig.json              # Paths: @/ → src/
    │   ├── Dockerfile                 # Bun alpine
    │   └── src/
    │       ├── index.ts               # Entry point: HTTP + WebSocket + MongoDB init
    │       ├── types/
    │       │   └── enums.ts           # Difficulty, GameStatus, LEAGUES (4 ligas), BOARD_SIZE
    │       ├── routes/
    │       │   ├── game.ts            # CRUD partidas + WebSocket connection manager
    │       │   ├── auth.ts            # Sincronización con Clerk
    │       │   ├── shop.ts            # Tienda (listar, equipar, des-equipar)
    │       │   ├── payment.ts         # Pagos con Stripe (checkout sessions)
    │       │   └── rankings.ts        # API de rankings y ligas
    │       ├── services/
    │       │   ├── gameService.ts     # Lógica del juego (tablero, movimientos, IA orchestration)
    │       │   ├── iaClient.ts        # Cliente HTTP para servicio de IA
    │       │   ├── rankingService.ts  # Sistema de puntuación y ligas
    │       │   └── userService.ts     # CRUD de usuarios
    │       ├── models/
    │       │   ├── User.ts            # clerkId, email, username, stats, inventory[]
    │       │   ├── Game.ts            # board[][], difficulty, status, mode, moves[]
    │       │   ├── Ranking.ts         # Puntos, victorias, winrate, streaks
    │       │   ├── Skin.ts            # nombre, tipo (piece|board), rareza, precio, colores
    │       │   ├── Purchase.ts        # userId, skinId, stripePaymentId, monto
    │       │   ├── UserSkin.ts        # Relación N:M usuario-skin, equipado
    │       │   └── AIAnalytic.ts      # Analíticas de IA
    │       └── database/
    │           ├── Database.ts        # Singleton MongoDB (connect, collections, indices, ping)
    │           ├── seed.ts            # Seed de 10 skins (5 fichas + 5 tableros)
    │           └── examples.ts
    │
    ├── ia/                            # Microservicio de IA (Bun + Hono)
    │   ├── package.json
    │   ├── tsconfig.json              # Paths: @/*, @algorithms/*, @models/*, etc.
    │   ├── Dockerfile                 # Bun alpine
    │   └── src/
    │       ├── index.ts               # Entry point (puerto 3002, CORS, health check)
    │       ├── models/
    │       │   └── Board.ts           # Constantes y tipos (Board, Position, Move)
    │       ├── routes/
    │       │   └── calculateMove.ts   # POST /calculate-move
    │       ├── algorithms/
    │       │   ├── beginner.ts        # IA Principiante (greedy + aleatorio)
    │       │   └── moveGenerator.ts   # Utilidades de movimiento
    │       ├── difficulty/
    │       │   ├── intermediate.ts    # IA Intermedia (A* heurístico, depth 1)
    │       │   ├── master.ts          # IA Master (minimax + α-β, depth 4)
    │       │   └── ultra.ts           # IA Ultra (minimax + α-β + TT + ID, depth 8+)
    │       └── utils/
    │           ├── boardUtils.ts      # createInitialBoard, cloneBoard, applyMove
    │           └── rulesEngine.ts     # Motor de reglas completo (capturas, movimientos, fin)
    │
```

---

## 4. Arquitectura y Comunicación

```
                         ┌──────────────────────────────────────┐
                         │           Frontend (:3000)           │
                         │    TanStack Start (React 19 SSR)     │
                         │  Zustand | TanStack Query | Clerk    │
                         └──────┬────────────────────▲──────────┘
                                │ WebSocket (ws://)   │ REST (fetch)
                                │ player_move          │ POST /api/game/create
                                │ move_applied         │ GET /api/game/:id
                                │ ai_move              │ GET /api/shop
                                │ game_over            │ GET /api/rankings
                                │ ranking_update       │ POST /api/payment
                                ▼                      │
                         ┌─────────────────────────────┴──────────┐
                         │           Backend (:3001)               │
                         │       Bun + Hono + MongoDB Driver       │
                         │                                         │
                         │  Routes:  /api/game/*                   │
                         │           /api/auth/*                   │
                         │           /api/shop/*                   │
                         │           /api/payment/*                │
                         │           /api/rankings/*               │
                         │           /ws (WebSocket upgrade)       │
                         └──────┬────────────────────▲─────────────┘
                                │ HTTP (fetch)        │
                                │ POST /calculate-move│
                                ▼                      │
                         ┌─────────────────────────────┴──────────┐
                         │         IA Service (:3002)              │
                         │           Bun + Hono + Zod             │
                         │                                         │
                         │  POST /calculate-move                   │
                         │  Body: { board, currentPlayer, difficulty }│
                         │  Response: { from, to, captured }      │
                         └─────────────────────────────────────────┘
```

### Conexiones clave:

- **Frontend ↔ Backend**: REST para CRUD (auth, shop, rankings, creación de partidas) + WebSocket para juego en tiempo real
- **Backend ↔ IA Service**: HTTP síncrono (`fetch`) para calcular movimiento de la IA
- **Backend → MongoDB**: Driver nativo de MongoDB para persistencia


---

## 5. Rutas del Frontend

| Ruta | Archivo | Componente | Función |
|------|---------|-----------|---------|
| `/` | `routes/index.tsx` | `MainMenu` | Menú principal del juego |
| `/game/difficulty` | `routes/game/difficulty.tsx` | `DifficultySelect` | Selector de dificultad y modo |
| `/game/play?difficulty=X&mode=Y` | `routes/game/play.tsx` | `GameContainer` | Pantalla de juego (parámetros por query string) |
| `/shop` | `routes/shop/index.tsx` | `ShopContainer` | Tienda de skins (fichas y tableros) |
| `/rankings` | `routes/rankings/index.tsx` | `RankingsContainer` | Tabla de clasificación y estadísticas |

---

## 6. APIs del Backend

### REST

| Método | Ruta | Handler | Propósito |
|--------|------|---------|-----------|
| `POST` | `/api/game/create` | `gameRoutes` | Crear nueva partida (body: difficulty, mode, userId, skinId) |
| `GET` | `/api/game/:id` | `gameRoutes` | Obtener estado de una partida |
| `POST` | `/api/auth/sync` | `authRoute` | Sincronizar usuario desde Clerk a MongoDB |
| `GET` | `/api/shop/skins` | `shopRoute` | Listar todas las skins disponibles |
| `GET` | `/api/shop/user-skins` | `shopRoute` | Listar skins del usuario autenticado |
| `POST` | `/api/shop/equip` | `shopRoute` | Equipar una skin |
| `POST` | `/api/shop/unequip` | `shopRoute` | Des-equipar una skin |
| `POST` | `/api/payment/create-checkout` | `paymentRoute` | Crear sesión de pago Stripe |
| `POST` | `/api/payment/confirm` | `paymentRoute` | Confirmar pago exitoso |
| `GET` | `/api/rankings` | `rankingRoutes` | Top 100 del ranking global |
| `GET` | `/api/rankings/user/:clerkId` | `rankingRoutes` | Ranking y stats de un usuario |
| `GET` | `/api/rankings/my-stats` | `rankingRoutes` | Stats del usuario autenticado |
| `GET` | `/api/rankings/leagues` | `rankingRoutes` | Información de todas las ligas |
| `GET` | `/api/rankings/position` | `rankingRoutes` | Posición del usuario autenticado |
| `GET` | `/health` | inline | Health check del backend |

### WebSocket

| Ruta | Mensaje (in) | Mensajes (out) | Propósito |
|------|-------------|----------------|-----------|
| `/ws?gameId=xxx` | `player_move` → `{ from, to }` | `game_state` → estado inicial del tablero | Conexión y control de partida |
| | | `move_applied` → tablero actualizado tras movimiento del jugador |
| | | `ai_move` → tablero actualizado tras movimiento de la IA |
| | | `game_over` → resultado final de la partida |
| | | `ranking_update` → puntos ganados/perdidos (solo ranked) |
| | | `error` → mensaje de error |

---

## 7. Flujo de una Partida

```
1. Menú principal → usuario hace clic en "Jugar"
2. /game/difficulty → selecciona dificultad y modo (practice/ranked)
3. /game/play?difficulty=X&mode=Y → GameContainer se monta
4. GameContainer llama POST /api/game/create al backend
5. Backend: gameService.createGame() → tablero inicial 8×8 guardado en MongoDB
6. Frontend abre WebSocket ws://backend:3001/ws?gameId=xxx
7. Backend responde con game_state (board, currentPlayer=1, status=active)
8. Jugador hace clic en ficha → checkersMoves.ts calcula movimientos válidos
9. Jugador hace clic en destino → se envía player_move{from, to} por WS
10. Backend: gameService.handlePlayerMove(gamelId, from, to)
    a. Aplica movimiento del jugador (applyMoveToBoard)
    b. Detecta capturas y promociones a rey
    c. Si hay captura múltiple → jugador sigue (forcedPiece)
    d. Si no → llama a IA: POST /calculate-move
11. IA Service calcula movimiento según dificultad y devuelve {from, to, captured}
12. Backend aplica movimiento de la IA, guarda en MongoDB
13. Backend hace broadcast: move_applied + ai_move por WebSocket
14. Frontend actualiza tablero (gameStore.setBoard)
15. Si game_over → broadcast con resultado + procesar ranking si es ranked
```

---

## 8. Sistema de IA (4 Niveles)

| Nivel | Archivo | Algoritmo | Profundidad | Técnicas |
|-------|---------|-----------|-------------|----------|
| **Principiante** | `ia/src/algorithms/beginner.ts` | Greedy | 1 | Prioriza capturas, sino movimiento aleatorio |
| **Intermedio** | `ia/src/difficulty/intermediate.ts` | A* heurístico | 1 | Evalúa cada movimiento con heurística (material + centro + avance) |
| **Master** | `ia/src/difficulty/master.ts` | Minimax + poda α-β | 4 | Ordenación de movimientos (capturas primero), heurística con edgeBonus |
| **Ultra** | `ia/src/difficulty/ultra.ts` | Minimax + α-β + TT + ID | 8+ | Tabla de transposición, búsqueda iterativa, límite de tiempo (5s), corte temprano |

### Constantes del tablero (`Board.ts`):
- `EMPTY = 0`, `PLAYER = 1`, `AI = 2`, `PLAYER_KING = 3`, `AI_KING = 4`
- `BOARD_SIZE = 8`

### Motor de reglas (`rulesEngine.ts`):
- `getCaptures(board, row, col)` — capturas incluyendo multi-captura para reyes
- `getSimpleMoves(board, row, col)` — movimientos simples
- `getValidMoves(board, row, col)` — unifica capturas (obligatorias) y simples
- `hasAnyCapture(board, player)` — detecta si hay captura obligatoria
- `getAllValidMoves(board, player)` — todos los movimientos válidos de un jugador
- `isGameOver(board)` — detecta fin de partida

---

## 9. Sistema de Ranking y Ligas

### 4 Ligas

| Liga | Rango (puntos) | Dificultad asignada | Icono |
|------|---------------|---------------------|-------|
| Plutón | 0 — 400 | Principiante | 🌑 |
| Nebulosa | 401 — 1000 | Intermedio | 🌌 |
| Quasar | 1001 — 2000 | Master | ⚡ |
| Élite Cósmica | 2001+ | Ultra | 👑 |

### Puntuación dinámica

- **Puntos base por dificultad**: principiante=50, intermedio=100, master=200, ultra=350
- **Multiplicadores**: tiempo (rápido = más puntos), eficiencia (menos movimientos = bonus), racha (partidas consecutivas ganadas), dificultad bonus (ganar en dificultad mayor a la asignada)
- **Victoria**: puntos base × multiplicadores
- **Derrota**: -5 puntos fijos
- **Títulos especiales** (Top 3 global): Singularidad Suprema, HiperNova, SuperNova

### Modalidades

- `practice` — No afecta ranking. El jugador elige dificultad libremente.
- `ranked` — Afecta ranking. La dificultad se asigna automáticamente según la liga del jugador.

---

## 10. Modelos de Base de Datos (MongoDB)

### Colecciones principales:

| Colección | Modelo | Campos clave |
|-----------|--------|-------------|
| `users` | `User.ts` | clerkId, email, username, stats{totalPoints, victories, currentStreak, ...}, inventory[] |
| `games` | `Game.ts` | userId, board[][] (8×8), difficulty, mode, status (active/completed), result, moves[], totalMoves, duration, pointsEarned, leagueAtPlay |
| `rankings` | `Ranking.ts` | userId, username, totalPoints, victories, totalGames, winRate, currentStreak, bestStreak, victoriesByDifficulty{} |
| `skins` | `Skin.ts` | name, type (piece|board), rarity (common|rare|epic|legendary), price (cents), colors{}, imageUrl |
| `purchases` | `Purchase.ts` | userId, skinId, stripePaymentId, amount, status (completed/pending/refunded), createdAt |
| `user_skins` | `UserSkin.ts` | userId, skinId, equipped (boolean), equippedAt, slot (piece/board) |
| `ai_analytics` | `AIAnalytic.ts` | gameId, difficulty, moveNumber, evaluationScore, nodesExplored, timeMs, boardState |

---

## 11. Variables de Entorno Requeridas

### `services/.env`

```
# Autenticación
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_... (en frontend/.env.local)

# Base de datos
MONGODB_URI=mongodb://mongo:27017/damas
MONGODB_NAME=damas

# Pagos
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Servicios
CORS_ORIGIN=http://localhost:3000,http://frontend:3000
BACKEND_URL=http://backend:3001
IA_SERVICE_URL=http://ia:3002

# Puertos
PORT=3001 (backend)
PORT=3002 (ia)
```

---

## 12. Comandos Útiles

```bash
# Iniciar todo con Docker
docker compose up -d

# Iniciar servicios individuales (dev)
cd services/backend && bun run dev
cd services/frontend && bun run dev
cd services/ia && bun run dev

# Seed de la tienda (se ejecuta automáticamente al iniciar backend)
# Para re-ejecutar: eliminar colección 'skins' en MongoDB y reiniciar backend

# Tests
cd services/backend && bun test
cd services/frontend && bun test

# Build producción
cd services/frontend && bun run build
```

---

## 13. Convenciones del Código

- **Lenguaje**: TypeScript estricto en todos los servicios
- **Imports**: Paths absolutos con alias `@/` (configurado en tsconfig.json y vite.config.ts)
- **Backend paths**: `@/routes/*`, `@/services/*`, `@/models/*`, `@/database/*`, `@/types/*`
- **IA paths**: `@/*`, `@algorithms/*`, `@difficulty/*`, `@models/*`, `@routes/*`, `@utils/*`
- **Frontend paths**: `@/` → `src/`
- **Naming**: camelCase para variables/funciones, PascalCase para componentes/archivos de ruta, kebab-case para carpetas de componentes
- **Estado**: Zustand para estado global del juego, TanStack Query para data fetching del servidor
- **Estilos**: TailwindCSS con tema neon oscuro (fucsia `#C026D3`, cian `#67E8F9`, dorado `#FFD700`)
- **Fuentes**: `Press Start 2P` (títulos), `VT323` (cuerpo) — cargadas desde Google Fonts
- **Base de datos**: MongoDB con driver nativo (sin Mongoose), esquemas definidos como tipos TypeScript
- **Validación**: Zod en endpoints de backend y IA service
- **WebSocket**: Gestión manual con Bun.serve, conexiones agrupadas por gameId

---

## 14. Ubicación de Archivos Clave

| Archivo | Ruta | Rol |
|---------|------|-----|
| Entry point backend | `services/backend/src/index.ts` | HTTP + WebSocket + inicialización MongoDB |
| Lógica del juego | `services/backend/src/services/gameService.ts` | Tablero, movimientos, orquestación IA |
| Cliente IA | `services/backend/src/services/iaClient.ts` | HTTP fetch al servicio de IA |
| Ranking service | `services/backend/src/services/rankingService.ts` | Puntuación, ligas, streaks |
| Entry point IA | `services/ia/src/index.ts` | Servidor HTTP |
| Router IA | `services/ia/src/routes/calculateMove.ts` | POST /calculate-move con selección de algoritmo |
| Motor reglas | `services/ia/src/utils/rulesEngine.ts` | Capturas, movimientos, fin de juego |
| IA Ultra | `services/ia/src/difficulty/ultra.ts` | Algoritmo más fuerte (minimax + TT + ID) |
| Entry point frontend | `services/frontend/src/ssr.tsx` | Server-Side Rendering |
| Layout raíz | `services/frontend/src/routes/__root.tsx` | ClerkProvider, tema, fuentes |
| Store del juego | `services/frontend/src/stores/gameStore.ts` | Estado global con Zustand |
| Movimientos cliente | `services/frontend/src/utils/checkersMoves.ts` | Cálculo de movimientos válidos en frontend |
| Docker Compose | `services/docker-compose.yml` | Orquestación de 4 contenedores |
| Seed de skins | `services/backend/src/database/seed.ts` | 10 skins iniciales para la tienda |

---

> **Uso para agentes IA**: Al iniciar una sesión, leer este archivo para obtener contexto completo del proyecto sin necesidad de explorar el código fuente. Contiene la estructura, arquitectura, APIs, flujo de juego y convenciones necesarias para entender y modificar cualquier parte del sistema.
