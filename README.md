# ♟️ Damas Universe

Plataforma moderna de juego de damas (checkers) con inteligencia artificial, sistema de rankings, personalización visual y autenticación.

Arquitectura de microservicios con frontend SSR y 4 niveles de IA: desde principiante (movimientos aleatorios) hasta ultra (minimax con poda alfa-beta, tabla de transposición y búsqueda iterativa).

---

## 🏗️ Diagrama de Carpetas

```
Damas-/
├── Docs/                          # Documentación
│   ├── PRD.md
│   ├── DATABASE.md
│   ├── DATABASE-RELATIONS.md
│   ├── RANKING-SYSTEM.md
│   ├── AI-ALGORITHMS.md
│   ├── TANSTACK-START-GUIDE.md
│   ├── wireframes/
│   ├── desarrollo/
│   └── agents/
├── services/
│   ├── frontend/                  # TanStack Start (React 19 + SSR)
│   │   └── src/
│   │       ├── assets/
│   │       │   ├── background/    # Imágenes de fondo
│   │       │   └── sounds/        # Efectos de sonido
│   │       ├── components/
│   │       │   ├── ui/            # Componentes reutilizables (Stars)
│   │       │   ├── Menu/          # Menú principal
│   │       │   ├── Game/          # Tablero, fichas, dificultad
│   │       │   ├── Shop/          # Tienda de skins
│   │       │   ├── Customize/     # Personalización
│   │       │   └── Rankings/      # Tabla de líderes
│   │       ├── hooks/             # Custom hooks (useGame, useWebSocket)
│   │       ├── routes/            # TanStack Router (file-based)
│   │       ├── stores/            # Zustand (gameStore)
│   │       ├── utils/             # checkersMoves, playButtonSound
│   │       └── styles/            # globals.css
│   ├── backend/                   # Bun + Hono (API REST + WebSocket)
│   │   └── src/
│   │       ├── routes/            # auth, game, payment, rankings, shop
│   │       ├── services/          # gameService, rankingService, paymentService
│   │       └── database/          # Conexión MongoDB + índices
│   ├── ia/                        # Bun + Hono (Microservicio IA)
│   │   └── src/
│   │       ├── algorithms/        # beginner, moveGenerator
│   │       ├── difficulty/        # intermediate, master, ultra
│   │       ├── models/            # Board types
│   │       ├── routes/            # calculateMove
│   │       └── utils/             # rulesEngine (validación), boardUtils
│   ├── docker-compose.yml
│   ├── .env.example
│   └── nginx/                     # Config proxy reverso (opcional)
└── README.md
```

---

## 🧠 Algoritmo de la IA

Servicio independiente (`services/ia/`) con 4 dificultades progresivas:

| Nivel | Algoritmo | Profundidad | Técnicas |
|-------|-----------|-------------|----------|
| **🌌 Principiante** | Greedy | 1 | Captura disponible → movimiento aleatorio |
| **⚡ Intermedio** | A* heurístico | 1 | Evalúa cada movimiento posible, elige el de mejor puntuación. Heurística: material (+1 ficha, +3 rey), control del centro, avance |
| **🧠 Master** | Minimax + poda α-β | 4 | Árbol de juego completo con poda. Ordenación de movimientos (capturas primero). Heurística: material, centro, avance, seguridad en bordes |
| **👾 Ultra** | Minimax + α-β + TT + ID | 8+ | Tabla de transposición (caché de posiciones), búsqueda iterativa (depth 1→8), límite de tiempo (5s), bestMove cacheado como primer candidato, corte temprano en posición ganadora (>90000) |

### Heurística de evaluación (Master y Ultra)

```
score = material + centerBonus + advanceBonus + edgeBonus
  material:  +1 ficha normal, +3 rey
  center:    (3 - |row - 3.5|) * 0.1 + (3 - |col - 3.5|) * 0.1
  advance:   (7 - row) * 0.08  (IA)  |  row * 0.08  (jugador)
  edge:      col == 0 || col == 7 ? 0.05 : 0
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

Esto inicia 5 contenedores:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `mongodb` | 27017 | Base de datos (MongoDB 7.0) |
| `backend` | 3001 | API REST + WebSocket (Bun + Hono) |
| `ia` | 3002 | Motor de IA (Bun + Hono) |
| `frontend` | 3000 | Interfaz SSR (TanStack Start) |
| `nginx` | 80/443 | Proxy reverso (opcional, `--profile nginx`) |

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
npm install && npm run dev

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
| | TanStack Query | Data fetching y caché |
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
| | Nginx (opcional) | Proxy reverso |

### Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `CLERK_SECRET_KEY` | API key del backend de Clerk |
| `VITE_CLERK_PUBLISHABLE_KEY` | Publishable key del frontend de Clerk |
| `STRIPE_SECRET_KEY` | API key secreta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret de Stripe |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Publishable key del frontend de Stripe |

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
| Nginx | http://localhost:80 |

---

**Versión:** 2.0  
**Última actualización:** Junio 2026
