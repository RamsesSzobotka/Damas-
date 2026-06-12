# ♟️ Damas Universe

Plataforma moderna de juego de damas (checkers) con inteligencia artificial, sistema de rankings, personalización visual y autenticación.

Arquitectura de microservicios con frontend SSR y 4 niveles de IA basados en A* puro: desde principiante (profundidad 1) hasta ultra (IDA* con búsqueda iterativa hasta profundidad 10).

---

## 🏗️ Diagrama de Carpetas

```
Damas-/
├── Docs/                              # Documentación
│   ├── PRD.md                         # Documento de requisitos
│   ├── DATABASE.md                    # Esquema de base de datos
│   ├── DATABASE-RELATIONS.md          # Relaciones entre colecciones
│   ├── RANKING-SYSTEM.md              # Sistema de puntuación y ligas
│   ├── AI-ALGORITHMS.md               # Algoritmos de IA detallados
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
│   │   ├── 01-menu-principal.md
│   │   ├── 02-seleccion-dificultad.md
│   │   ├── 03-pantalla-juego.md
│   │   ├── 04-rankings.md
│   │   └── 05-tienda.md
│   └── wireframes/                    # Maquetas visuales (imágenes)
├── services/
│   ├── frontend/                      # TanStack Start (React 19 + SSR)
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   ├── background/        # Imágenes de fondo
│   │   │   │   ├── game/              # Sprites del juego
│   │   │   │   ├── music/             # Música de fondo
│   │   │   │   └── sounds/            # Efectos de sonido
│   │   │   ├── components/
│   │   │   │   ├── ui/                # Componentes reutilizables (Stars)
│   │   │   │   ├── Menu/              # Menú principal (MainMenu)
│   │   │   │   ├── Game/              # Tablero, fichas, dificultad
│   │   │   │   ├── Shop/              # Tienda de skins (ShopContainer)
│   │   │   │   ├── Customize/         # Personalización (CustomizeContainer)
│   │   │   │   └── Rankings/          # Tabla de líderes (RankingsContainer)
│   │   │   ├── hooks/                 # Custom hooks (useGame, useWebSocket, useBackgroundMusic)
│   │   │   ├── routes/                # TanStack Router (file-based)
│   │   │   │   ├── index.tsx          # Página principal (menú)
│   │   │   │   ├── __root.tsx         # Layout raíz + ClerkProvider + tema
│   │   │   │   ├── game/
│   │   │   │   │   ├── difficulty.tsx # Selección de dificultad
│   │   │   │   │   └── play.tsx       # Pantalla de juego
│   │   │   │   ├── customize/index.tsx
│   │   │   │   ├── rankings/index.tsx
│   │   │   │   └── shop/index.tsx
│   │   │   ├── stores/                # Zustand (gameStore)
│   │   │   ├── styles/                # globals.css + Tailwind
│   │   │   ├── test/                  # Config test (setup.ts)
│   │   │   ├── utils/                 # checkersMoves, playButtonSound, playGameSound
│   │   │   ├── client.tsx             # Entry point cliente
│   │   │   ├── router.tsx             # Config TanStack Router
│   │   │   ├── routeTree.gen.ts       # Árbol de rutas generado
│   │   │   └── ssr.tsx                # Entry point SSR
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── postcss.config.js
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── backend/                       # Bun + Hono (API REST + WebSocket)
│   │   ├── src/
│   │   │   ├── routes/                # auth, game, payment, rankings, shop
│   │   │   ├── services/              # gameService, rankingService, userService, iaClient
│   │   │   ├── models/                # Mongoose schemas (User, Game, Ranking, Skin, etc.)
│   │   │   ├── database/              # Conexión MongoDB + seed
│   │   │   ├── types/                 # TypeScript interfaces/enums
│   │   │   └── index.ts               # Entry point (Hono app)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   ├── ia/                            # Bun + Hono (Microservicio IA)
│   │   ├── src/
│   │   │   ├── algorithms/            # beginner, moveGenerator
│   │   │   ├── difficulty/            # intermediate, master, ultra
│   │   │   ├── models/                # Board types
│   │   │   ├── routes/                # calculateMove
│   │   │   ├── utils/                 # rulesEngine (validación), boardUtils
│   │   │   └── index.ts               # Entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── .env
│   ├── .gitignore
│   ├── DOCKER_COMMANDS.md
│   ├── README.md
│   └── SETUP.md
├── .opencode/                         # Config AI agent skills
├── .agent/                            # Reglas para AI agent
└── README.md
```

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

## ⚙️ Setup Inicial (Docker)

### Requisitos
- Docker Desktop (Docker Compose v2)
- Bun (para desarrollo local sin Docker)

### 1. Clonar y configurar

```bash
git clone <repo-url> Damas-
cd Damas-/services

cp .env.example .env
# Editar .env con credenciales de Clerk y Stripe
```

### 2. Levantar todo

```bash
docker compose up -d
```

Esto inicia 4 contenedores:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `mongodb` | 27017 | Base de datos (MongoDB 7.0) |
| `backend` | 3001 | API REST + WebSocket (Bun + Hono) |
| `ia` | 3002 | Motor de IA (Bun + Hono) |
| `frontend` | 3000 | Interfaz SSR (TanStack Start) |


```bash
# Ver logs
docker compose logs -f

# Detener
docker compose down
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

---

## 🔄 Cómo Funciona

### Flujo de una partida

```
1. JUGADOR ingresa al menú principal
2. Selecciona JUGAR → elige modo (RANKED / RETOS / PERSONALIZACIÓN)
3. FRONTEND → POST /api/game/create → BACKEND
4. BACKEND crea partida en MongoDB, responde con gameId
5. FRONTEND abre WebSocket /ws?gameId=xxx
6. Jugador selecciona ficha → destino → envía player_move por WS
7. BACKEND valida movimiento, aplica al tablero
   └── Si es turno de IA → HTTP POST /calculate-move → IA SERVICE
   └── IA SERVICE calcula mejor jugada según dificultad → responde
8. BACKEND actualiza tablero, guarda en MongoDB
9. BROADCAST move_applied + ai_move por WebSocket
10. FRONTEND anima los movimientos, actualiza UI
11. Si partida termina → game_over + ranking_update
```

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

## 🛠️ Tecnologías

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| **Frontend** | TanStack Start (React 19) | Meta-framework SSR full-stack |
| | TanStack Router | Routing tipado con file-based |
| | Zustand | Estado global del juego |
| | TailwindCSS 3 | Estilos utilitarios |
| | Clerk | Autenticación (modal + sesiones) |
| | Vite 6 | Build y dev server |
| **Backend** | Bun | Runtime JavaScript rápido |
| | Hono 4 | Framework HTTP ligero |
| | MongoDB driver 6 | Base de datos NoSQL |
| | Clerk SDK | Verificación de tokens |
| | Stripe SDK 14 | Procesamiento de pagos |
| **IA** | Bun + Hono | Servicio independiente |
| | Zod | Validación de entradas |
| **Base de datos** | MongoDB 7.0 | Documentos + índices |
| **Infraestructura** | Docker Compose | Contenedores multi-servicio |

### Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `CLERK_SECRET_KEY` | API key del backend de Clerk |
| `VITE_CLERK_PUBLISHABLE_KEY` | Publishable key del frontend de Clerk |
| `STRIPE_SECRET_KEY` | API key secreta de Stripe |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Publishable key del frontend de Stripe |
| `JWT_SECRET` | Secreto para firmar tokens JWT (registro email/password) |
| `SALT_PASSWORD` | Pepper para hashear contraseñas con bcrypt |

## 🔐 Autenticación (Clerk + Email/Password)

La plataforma ofrece dos sistemas de autenticación:

### Clerk (principal)
- **Registro/Inicio**: Modal con email/password + Google OAuth + Microsoft OAuth
- **Sesión persistente**: Clerk maneja sesiones automáticamente (cookies + tokens)
- **Las contraseñas las gestiona Clerk** en sus servidores — no se almacenan localmente
- **Backend**: Cada request protegido verifica el token vía `@clerk/backend` → `verifyToken()`
- **Sincronización**: Al iniciar sesión, se sincroniza el perfil de Clerk con MongoDB (`POST /api/auth/sync`)

### Email/Password propio (alternativa)
- Endpoints `POST /api/auth/register` y `POST /api/auth/login`
- Contraseñas hasheadas con **bcrypt + pepper** (Bun.password.hash, costo 10)
- Sesión con **JWT** (HS256, 7 días de expiración)
- Los usuarios se sincronizan automáticamente con Clerk

### UI
- Tema retro-neon (magenta, gold, cyan, fuente Press Start 2P / VT323)
- Modal de Clerk con botones sociales y formulario de email
- `UserButton` con avatar, "Manage account" y "Sign out" estilizado

## 💳 Pagos (Stripe)

Integración con Stripe para la tienda de skins:

- `POST /api/payment/create-checkout-session` → crea sesión de pago
- `POST /api/payment/confirm` → confirma compra y asigna skin al usuario
- Webhook `STRIPE_WEBHOOK_SECRET` para eventos asíncronos

## 🧪 Testing

```bash
# Frontend - Unit tests (Vitest + Testing Library)
cd services/frontend && bunx vitest

# Frontend - E2E tests (Playwright)
cd services/frontend && bun run test:e2e

# Backend (Bun test)
cd services/backend && bun test
```

### MongoDB — Colecciones

| Colección | Propósito |
|-----------|-----------|
| `users` | Perfiles de jugador (clerkId, stats) |
| `games` | Historial de partidas (tablero, movimientos, resultado) |
| `rankings` | Puntuaciones globales (puntos, liga, rachas) |
| `skins` | Catálogo de la tienda (tipo, rareza, precio) |
| `purchases` | Transacciones de compra (stripePaymentId) |
| `userSkins` | Inventario de skins por usuario (equipado/no) |

---

## 📡 URLs por servicio

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| IA Service | http://localhost:3002 |
| MongoDB | mongodb://localhost:27017 |

---

**Versión:** 2.2  
**Última actualización:** Junio 2026
