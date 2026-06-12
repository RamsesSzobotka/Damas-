# ♟️ Damas Universe

Plataforma moderna de juego de damas (checkers) con inteligencia artificial basada en **A\* puro**, sistema de rankings competitivo, personalización visual con skins, modo espectador, y autenticación.

**Variante elegida:** Damas internacionales (8×8), con captura obligatoria, multi-captura (cadena), promoción a rey, y victoria por eliminación total o bloqueo.

Arquitectura de microservicios con frontend SSR (TanStack Start), backend en Bun + Hono, y un **microservicio de IA independiente** con 4 niveles de dificultad basados en A\* puro.

---

## ⚙️ Setup Inicial

### Requisitos

- **Bun** ≥ 1.0 (runtime principal — NO se usa npm)
- **Docker Desktop** (Docker Compose v2) para el entorno completo
- **Cuentas**: Clerk (auth) y Stripe (pagos) — opcionales para practice mode

### 1. Clonar y configurar

```bash
git clone <repo-url> Damas-
cd Damas-/services

cp .env.example .env
# Editar .env con credenciales de Clerk y Stripe
```

### 2. Levantar todo con Docker Compose

```bash
cd services
docker compose up -d
```

Esto inicia 4 contenedores:

| Servicio | Puerto | Imagen/Dockerfile | Descripción |
|----------|:------:|:-----------------:|-------------|
| `mongodb` | 27017 | `mongo:7.0` | Base de datos documental |
| `backend` | 3001 | `./backend/Dockerfile` | API REST + WebSocket (Bun + Hono) |
| `ia` | 3002 | `./ia/Dockerfile` | Motor IA A\* (Bun + Hono) |
| `frontend` | 3000 | `./frontend/Dockerfile` | Interfaz SSR (TanStack Start) |

Los 3 servicios usan `oven/bun:1.3` como imagen base. Red compartida: `damas-network` (bridge). Volúmenes montados para hot-reload en desarrollo.

```bash
# Ver logs en tiempo real
docker compose logs -f

# Detener servicios
docker compose down

# Detener y borrar volúmenes (reset completo)
docker compose down -v
```

### Desarrollo local (sin Docker)

```bash
# Terminal 1 - Frontend
cd services/frontend
bun install && bun run dev

# Terminal 2 - Backend
cd services/backend
bun install && bun run dev

# Terminal 3 - IA
cd services/ia
bun install && bun run dev

# Terminal 4 - MongoDB
docker run -d -p 27017:27017 mongo:7.0
```

> **Nota:** Todos los servicios usan **Bun** como runtime. No hay `npm install`, `npx`, ni `node_modules` de npm. Los scripts en `package.json` usan exclusivamente `bun run`.

### URLs por servicio

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| IA Service | http://localhost:3002 |
| MongoDB | mongodb://localhost:27017 |

---

## 🏗️ Diagrama de Carpetas

```
Damas-/
├── Docs/                              # Documentación técnica
│   ├── PRD.md                         # Documento de requisitos
│   ├── TANSTACK-START-GUIDE.md        # Guía del framework
│   ├── agents/                        # Prompts y skills para AI agents
│   │   ├── CONTEXT.md
│   │   └── Skill_Damas_Universe_UIUX.md
│   ├── desarrollo/                    # Documentación de desarrollo
│   │   ├── PLAN-DESARROLLO.md
│   │   ├── GUIA-VISUAL.md
│   │   ├── AI-ALGORITHMS.md
│   │   ├── DATABASE.md
│   │   ├── DATABASE-RELATIONS.md
│   │   ├── RANKING-SYSTEM.md
│   │   ├── INDEX.md
│   │   ├── README.md
│   │   └── 01-menu-principal.md ... 05-tienda.md
│   └── wireframes/                    # Maquetas visuales
│       └── README.md
├── services/
│   ├── frontend/                      # TanStack Start (React 19 + SSR)
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   ├── background/        # Imágenes de fondo
│   │   │   │   ├── game/              # Sprites del juego
│   │   │   │   ├── music/             # Música de fondo
│   │   │   │   └── sounds/            # Efectos de sonido
│   │   │   ├── components/
│   │   │   │   ├── Auth/              # Componentes de autenticación
│   │   │   │   ├── Customize/         # Personalización (CustomizeContainer)
│   │   │   │   ├── Game/              # GameContainer, GameBoard, BoardSquare, Piece, DifficultySelect, SpeedControl, SpectatorStats
│   │   │   │   ├── Menu/              # Menú principal (MainMenu)
│   │   │   │   ├── Rankings/          # Tabla de líderes (RankingsContainer)
│   │   │   │   ├── Shop/              # Tienda de skins (ShopContainer)
│   │   │   │   ├── Spectator/         # Configuración de espectador (SpectatorSetup)
│   │   │   │   └── ui/                # Componentes reutilizables (Stars)
│   │   │   ├── hooks/                 # useGame, useWebSocket, useBackgroundMusic, useSpectatorGame
│   │   │   ├── routes/                # TanStack Router (file-based)
│   │   │   │   ├── __root.tsx         # Layout raíz + ClerkProvider + tema retro-neon
│   │   │   │   ├── index.tsx          # Página principal (menú)
│   │   │   │   ├── game/
│   │   │   │   │   ├── difficulty.tsx # Selección de dificultad
│   │   │   │   │   └── play.tsx       # Pantalla de juego
│   │   │   │   ├── customize/index.tsx
│   │   │   │   ├── rankings/index.tsx
│   │   │   │   ├── shop/index.tsx
│   │   │   │   └── spectator/
│   │   │   │       ├── index.tsx      # Selección de dificultad espectador
│   │   │   │       └── watch.tsx      # Vista de espectador
│   │   │   ├── stores/                # Zustand (gameStore)
│   │   │   ├── styles/                # globals.css + Tailwind
│   │   │   ├── test/                  # Config test (setup.ts)
│   │   │   ├── utils/                 # checkersMoves, playButtonSound, playGameSound
│   │   │   ├── client.tsx             # Entry point cliente
│   │   │   ├── router.tsx             # Config TanStack Router
│   │   │   ├── routeTree.gen.ts       # Árbol de rutas generado
│   │   │   └── ssr.tsx                # Entry point SSR
│   │   ├── e2e/                       # Tests E2E (Playwright)
│   │   │   ├── home.spec.ts
│   │   │   ├── auth.spec.ts
│   │   │   ├── navigation.spec.ts
│   │   │   └── game.spec.ts
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── postcss.config.js
│   │   ├── playwright.config.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── backend/                       # Bun + Hono (API REST + WebSocket)
│   │   ├── src/
│   │   │   ├── routes/                # game, auth, payment, rankings, shop
│   │   │   ├── services/              # gameService, rankingService, userService, iaClient
│   │   │   ├── models/                # Schemas Zod (User, Game, Ranking, Skin, Purchase, UserSkin, AIAnalytic)
│   │   │   ├── database/              # Conexión MongoDB + seed
│   │   │   ├── types/                 # TypeScript interfaces/enums
│   │   │   └── index.ts               # Entry point (Bun.serve + Hono + WebSocket)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   ├── ia/                            # Bun + Hono (Microservicio IA — A* puro)
│   │   ├── src/
│   │   │   ├── algorithms/            # astar.ts, beginner.ts, moveGenerator.ts
│   │   │   ├── difficulty/            # intermediate.ts, master.ts, ultra.ts
│   │   │   ├── models/                # Board types
│   │   │   ├── routes/                # calculateMove.ts (POST /calculate-move)
│   │   │   ├── utils/                 # rulesEngine, boardUtils
│   │   │   └── index.ts               # Entry point (Bun.serve + Hono)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── .gitignore
│   └── README.md                      # Referencia rápida de servicios
└── README.md
```

---

## 🏗️ Arquitectura

### Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (TanStack Start)                     │
│               http://localhost:3000                              │
│  React 19 + SSR + TanStack Router + Zustand + TailwindCSS       │
└──────────┬──────────────────────────────┬───────────────────────┘
           │ WebSocket (/ws?gameId=xxx)   │ HTTP REST (/api/*)
           ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Bun + Hono)                         │
│               http://localhost:3001                              │
│  API REST (crear partida, auth, pagos, rankings, tienda)        │
│  WebSocket (juego en tiempo real, broadcast)                    │
│  MongoDB (Mongoose driver, 7 colecciones)                       │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP POST /calculate-move
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│               MICROSERVICIO IA (Bun + Hono)                      │
│               http://localhost:3002                              │
│  A* puro (beginner), A* prof. 2 (intermediate),                 │
│  A* prof. 4 (master), IDA* prof. 1→10 (ultra)                   │
│  Sin dependencias externas — solo Bun + Hono + Zod              │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de una partida

```
1. JUGADOR ingresa al menú principal
2. Selecciona JUGAR → elige modo (RANKED / PRACTICE / ESPECTADOR)
3. FRONTEND → POST /api/game/create → BACKEND
4. BACKEND crea partida en MongoDB, responde con gameId + tablero inicial
5. FRONTEND abre WebSocket /ws?gameId=xxx
6. Jugador selecciona ficha → destino → envía player_move por WS
7. BACKEND valida movimiento, aplica al tablero
   └── Si es turno de IA → HTTP POST /calculate-move → IA SERVICE
   └── IA SERVICE calcula mejor jugada según dificultad → responde
8. BACKEND actualiza tablero, guarda en MongoDB
9. BROADCAST move_applied + ai_move por WebSocket
10. FRONTEND anima los movimientos, actualiza UI
11. Si partida termina → game_over + ranking_update (solo ranked)
```

### Modos de juego

| Modo | Descripción | Requiere auth |
|------|-------------|:-------------:|
| **Practice** | Jugar contra IA con dificultad seleccionable | No |
| **Ranked** | Partida competitiva con auto-asignación de dificultad según liga | Sí |
| **Espectador** | Observar 2 IAs enfrentarse (IA vs IA) | No |

### Conexiones entre servicios

```
Frontend (3000) ──WebSocket──▶ Backend (3001) ──HTTP──▶ IA (3002)
                      │                                       │
                      ▼                                       │
                 MongoDB (27017)                               │
                      ▲                                       │
                      └───────────────────────────────────────┘
```

---

## 🔄 Cómo se invoca el microservicio A\*

El backend se comunica con el servicio de IA vía **HTTP POST** a través del cliente tipado `iaClient.ts`:

### Solicitud (`POST /calculate-move`)

```json
{
  "board": [
    [0,2,0,2,0,2,0,2], [2,0,2,0,2,0,2,0],
    [0,2,0,2,0,2,0,2], [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0], [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1], [1,0,1,0,1,0,1,0]
  ],
  "currentPlayer": 2,
  "difficulty": "master"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `board` | `number[8][8]` | 0=vacío, 1=ficha jugador, 2=ficha IA, 3=rey jugador, 4=rey IA |
| `currentPlayer` | `1 \| 2` | 1 = humano, 2 = IA |
| `difficulty` | `enum` | `beginner` \| `intermediate` \| `master` \| `ultra` |

### Respuesta

```json
{ "from": [2,3], "to": [3,4], "captured": [[3,2]], "path": [[2,3],[4,5]] }
```

- `from`, `to` — coordenadas del movimiento
- `captured` — fichas capturadas (vacío si no hay)
- `path` — trayectoria completa (útil para multi-captura)

### Implementación (`services/backend/src/services/iaClient.ts`)

```typescript
const IA_SERVICE_URL = process.env.IA_SERVICE_URL || 'http://localhost:3002'

export async function calculateMove(board: number[][], currentPlayer: number, difficulty: string) {
  const response = await fetch(`${IA_SERVICE_URL}/calculate-move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board, currentPlayer, difficulty }),
  })
  // ...
}
```

El servicio de IA es **completamente independiente**: no tiene acceso a la base de datos, no requiere autenticación, y solo depende de Bun + Hono + Zod. Puede escalarse horizontalmente de forma independiente.

---

## 🧠 Algoritmo de la IA

Servicio independiente (`services/ia/`) con 4 niveles de dificultad, todos basados en **A\* puro** (sin minimax, sin alfa-beta, sin Monte Carlo):

| Nivel | Algoritmo | Profundidad | Límite tiempo |
|-------|-----------|:-----------:|:------------:|
| **🌌 Principiante** | A* puro | 1 | — |
| **⚡ Intermedio** | A* puro | 2 | — |
| **🧠 Master** | A* puro | 4 | 2s |
| **👾 Ultra** | IDA* (Iterative Deepening A*) | 1→10 | 5s |

### Motor A\* (`services/ia/src/algorithms/astar.ts`)

| Componente | Implementación |
|------------|---------------|
| **Open set** | `PriorityQueue<AStarNode>` con inserción ordenada O(log n) |
| **Closed set** | `Set<string>` con hash de tablero |
| **`g(n)`** | `depthWeight × depth` |
| **`h(n)`** | `evaluateBoard()` — material (ficha=1, rey=3), centro, avance, bordes |
| **`f(n)`** | `f = g − h` (turno IA) o `f = g + h` (turno oponente) |

### Heurística de evaluación

```
score = material + centerBonus + advanceBonus + edgeBonus + materialAdvantage
  material:    +1 ficha normal, +3 rey
  center:      (3 - |row - 3.5|) * 0.1 + (3 - |col - 3.5|) * 0.1
  advance:     (7 - row) * 0.08  (IA)  |  row * 0.08  (jugador)
  edge:        col == 0 || col == 7 ? 0.05 : 0
  advantage:   materialDiff > 3 ? materialDiff * 0.2 : 0
```

### Reglas del juego validadas
- Movimiento diagonal hacia adelante (fichas) / cualquier diagonal (reyes)
- Captura obligatoria si está disponible
- Cadena de capturas (multi-jump)
- Promoción a rey al llegar al borde contrario
- Victoria: eliminar todas las fichas rivales o dejar sin movimientos

---

## 📝 Scripts por servicio

### Frontend
```bash
bun run dev              # Desarrollo con HMR
bun run build            # Build de producción
bun start                # Iniciar servidor de producción
bun run type-check       # TypeScript check
bun run lint             # ESLint
bun run test:e2e         # Tests E2E (Playwright)
bunx vitest              # Tests unitarios (Vitest)
```

### Backend
```bash
bun run dev              # Desarrollo con watch
bun run build            # Build
bun start                # Producción
bun run typecheck        # TypeScript check
bun test                 # Tests (Bun test runner)
```

### IA Service
```bash
bun run dev              # Desarrollo con watch
bun run build            # Build
bun start                # Producción
bun run typecheck        # TypeScript check
```

---

## 🛠️ Stack tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| **Frontend** | TanStack Start (React 19) | Meta-framework SSR full-stack |
| | TanStack Router ^1.168 | Routing tipado con file-based |
| | Zustand 5 | Estado global del juego |
| | TailwindCSS 3 | Estilos utilitarios |
| | Clerk ^1.3 | Autenticación (modal + sesiones) |
| | Vite 6 | Build y dev server |
| | Playwright ^1.60 | Tests E2E |
| | Vitest ^4.1 + Testing Library | Tests unitarios |
| **Backend** | Bun | Runtime JavaScript rápido |
| | Hono 4 | Framework HTTP ligero |
| | MongoDB driver 6 | Base de datos NoSQL |
| | Clerk SDK 3 | Verificación de tokens |
| | Stripe SDK 14 | Procesamiento de pagos |
| | Zod 3 | Validación de esquemas |
| **IA** | Bun + Hono 3 | Servicio independiente |
| | Zod 3 | Validación de entrada |
| **Base de datos** | MongoDB 7.0 | Documentos + índices |
| **Infraestructura** | Docker Compose | Contenedores multi-servicio (4 servicios) |

### Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `CLERK_SECRET_KEY` | API key del backend de Clerk |
| `VITE_CLERK_PUBLISHABLE_KEY` | Publishable key del frontend de Clerk |
| `STRIPE_SECRET_KEY` | API key secreta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Webhook secret de Stripe |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Publishable key del frontend de Stripe |
| `JWT_SECRET` | Secreto para firmar tokens JWT (registro email/password) |
| `SALT_PASSWORD` | Pepper para hashear contraseñas con bcrypt |

---

## 🔐 Autenticación (Clerk + Email/Password)

### Clerk (principal)
- **Registro/Inicio**: Modal con email/password + Google OAuth + Microsoft OAuth
- **Sesión persistente**: Clerk maneja sesiones automáticamente (cookies + tokens)
- **Backend**: Cada request protegido verifica el token vía `@clerk/backend` → `verifyToken()`
- **Sincronización**: Al iniciar sesión, se sincroniza el perfil de Clerk con MongoDB (`POST /api/auth/sync`)
- **UI**: Tema retro-neon personalizado (Press Start 2P / VT323, colores magenta/gold/cyan)

### Email/Password propio (alternativa)
- Endpoints `POST /api/auth/register` y `POST /api/auth/login`
- Contraseñas hasheadas con **bcrypt + pepper** (Bun.password.hash, costo 10)
- Sesión con **JWT** (HS256, 7 días de expiración)

---

## 💳 Pagos (Stripe)

Integración con Stripe para la tienda de skins:

- `POST /api/payment/create-checkout-session` — crea sesión de pago
- `POST /api/payment/confirm` — confirma compra y asigna skin al usuario
- Webhook `STRIPE_WEBHOOK_SECRET` para eventos asíncronos

---

## 🧪 Testing

```bash
# Frontend - Unit tests (Vitest + Testing Library)
cd services/frontend && bunx vitest

# Frontend - E2E tests (Playwright)
cd services/frontend && bun run test:e2e

# Backend (Bun test runner)
cd services/backend && bun test
```

### Archivos de test

| Archivo | Tipo | Propósito |
|---------|:----:|-----------|
| `frontend/src/components/Game/BoardSquare.test.tsx` | Unit (Vitest) | Renderizado de casilla |
| `frontend/e2e/home.spec.ts` | E2E (Playwright) | Smoke test página principal |
| `frontend/e2e/auth.spec.ts` | E2E (Playwright) | Flujo de autenticación |
| `frontend/e2e/navigation.spec.ts` | E2E (Playwright) | Navegación entre páginas |
| `frontend/e2e/game.spec.ts` | E2E (Playwright) | Motor de juego y API |
| `backend/src/routes/shop.test.ts` | Unit (Bun test) | Rutas de tienda |
| `backend/src/database/seed.test.ts` | Unit (Bun test) | Seed de base de datos |

---

## 🗄️ MongoDB — Colecciones

| Colección | Propósito |
|-----------|-----------|
| `users` | Perfiles de jugador (clerkId, stats) |
| `games` | Historial de partidas (tablero, movimientos, resultado) |
| `rankings` | Puntuaciones globales (puntos, liga, rachas) |
| `skins` | Catálogo de la tienda (tipo, rareza, precio) |
| `purchases` | Transacciones de compra (stripePaymentId) |
| `userSkins` | Inventario de skins por usuario (equipado/no) |
| `aiAnalytics` | Análisis de movimientos IA (opcional, útil para ML) |

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| **MongoDB no conecta** | `docker compose ps && docker compose logs mongodb` |
| **Puerto en uso** | `netstat -ano \| findstr :3000` (o 3001, 3002) y cambiar en docker-compose.yml |
| **Dependencias no se instalan** | `rm -rf node_modules && bun install` |
| **Hot reload no funciona** | `docker compose up -d --build frontend` |

---

## ⚠️ Limitaciones Conocidas

| Limitación | Descripción | Estado |
|------------|-------------|--------|
| **Reconexión WebSocket** | La reconexión automática existe pero no preserva el estado visual si el servidor se reinicia | Mejora planeada |
| **Rate limiting** | No hay límite de requests por IP/usuario en la API | Pendiente |
| **CI/CD** | No hay pipeline de integración continua configurado | Pendiente |
| **Producción** | No hay configuración de nginx, SSL, o dominios para despliegue | Pendiente |
| **Migraciones BD** | No hay sistema de migraciones para cambios de esquema en MongoDB | Pendiente |
| **A\* puro sin poda** | Master usa profundidad fija 4 sin alfa-beta; el rendimiento puede degradarse con muchas fichas | Por diseño |
| **Almacenamiento de audio** | Archivos de música/sonidos en el repositorio (no CDN) | Mejora planeada |
| **Modo multijugador** | Solo PvE (jugador vs IA) — no hay PvP en tiempo real | Fuera de alcance v2 |

---

## 📖 Recursos

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Hono Docs](https://hono.dev)
- [Bun Docs](https://bun.sh/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Clerk Docs](https://clerk.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Playwright Docs](https://playwright.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

**Versión:** 2.2  
**Última actualización:** Junio 2026
