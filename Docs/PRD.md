# Especificación de Requisitos del Producto (PRD)
## Proyecto: Damas - Plataforma Moderna de Juego de Checkers

**Versión:** 2.0  
**Fecha de Creación:** 26 de mayo de 2026  
**Última Actualización:** 26 de mayo de 2026  
**Estado:** En desarrollo  

---

## 1. Descripción General del Proyecto

El proyecto consiste en el desarrollo de un videojuego de damas (Checkers) con arquitectura de microservicios, enfocado en partidas jugador contra máquina (JvsMachine), sistema de rankings en línea, personalización visual mediante skins y autenticación de usuarios.

El sistema permitirá que los jugadores compitan contra una inteligencia artificial con distintos niveles de dificultad, donde la IA analizará el estado actual del tablero y devolverá el mejor movimiento posible utilizando algoritmos basados en grafos, recursividad y búsqueda de caminos.

**Objetivo Principal:**  
Desarrollar una plataforma moderna de damas utilizando microservicios, inteligencia artificial y tecnologías web actuales, aplicando conceptos de algoritmos, estructuras de datos, grafos, recursividad, APIs REST, arquitectura distribuida, autenticación, pagos en línea y despliegue con contenedores.

---

## 1.1 Clarificación: Stack Tecnológico del Frontend - TanStack Start

### ⚠️ CRÍTICO: NO ES REACT TRADICIONAL

**La plataforma frontend utiliza TANSTACK START, NO React/Next.js**

**¿Qué es TanStack Start?**
- Meta-framework full-stack desarrollado por Tanner Linsley (creador de TanStack/React Query)
- Alternativa moderna a Next.js basada en Vite
- Proporciona: SSR, SSG, Server Functions, File-based routing, TypeScript-first
- Incluye: TanStack Router, TanStack Query (Data Fetching), Server Components
- Runtime: Node.js (compatible con Vercel, Netlify, etc.)

**¿Por qué TanStack Start?**
1. **Mejor performance:** SSR + Vite (más rápido que Webpack)
2. **Developer Experience:** Configuración mínima, hot reload instantáneo
3. **Full-Stack:** Server functions integradas para lógica backend sin API routes separadas
4. **Type-Safety:** TypeScript first con mejor inferencia
5. **Data Fetching:** TanStack Query integrado nativo

**Diferencias clave vs React SPA:**
- ❌ NO usar Axios fetch de cliente
- ✅ USAR TanStack Query para data fetching
- ❌ NO usar useContext para state global
- ✅ USAR TanStack Store o Zustand + TanStack Query
- ❌ NO usar React Router
- ✅ USAR TanStack Router (incluido en TanStack Start)
- ✅ USAR Server Functions para operaciones sensibles

**Stack Específico del Proyecto:**
- TanStack Start (Latest version)
- Vite 5.x (Incluido automáticamente)
- TypeScript 5.x (Requerido)
- TanStack Query 5.x (Data Fetching)
- TanStack Router (Routing)
- TanStack Store o Zustand (State Management)
- TailwindCSS 3.x (Styling)
- Clerk SDK for TanStack (Authentication)
- Stripe SDK for TanStack (Payments)

---

## 2. Reglas Básicas de Damas

El juego seguirá las reglas tradicionales de damas internacionales simplificadas:

- **Tablero:** 8x8 casillas
- **Fichas iniciales:** 12 fichas por jugador
- **Movimiento básico:** Diagonal hacia adelante
- **Capturas:** Las fichas pueden capturar piezas enemigas saltando sobre ellas
- **Capturas obligatorias:** Cuando exista un movimiento de captura, es obligatorio ejecutarlo
- **Promoción a Reina:** Una ficha que llega al extremo contrario del tablero se convierte en "Reina"
- **Movimiento de Reinas:** Pueden desplazarse diagonalmente múltiples casillas

**Condiciones de Victoria:**
- Eliminar todas las fichas rivales
- Dejar al oponente sin movimientos válidos

---

## 3. Modalidad de Juego: JvsMachine (Jugador vs Máquina)

### 3.1 Descripción General
El usuario jugará contra una IA con diferentes niveles de dificultad disponibles.

### 3.2 Niveles de Dificultad

| Nivel | Comportamiento |
|-------|---|
| **Principiante** | Movimientos simples y poca profundidad de búsqueda |
| **Intermedio** | Evalúa capturas y defensa básica |
| **Master** | Analiza múltiples escenarios y posiciones futuros |
| **Ultra** | Mayor profundidad y optimización heurística avanzada |

### 3.3 Flujo de Comunicación IA

**Request (Frontend → Backend → Servicio IA):**
```json
{
  "board": [...],
  "currentPlayer": "black",
  "difficulty": "master"
}
```

**Response (Servicio IA → Backend → Frontend):**
```json
{
  "from": [2,3],
  "to": [3,4]
}
```

---

## 4. Inteligencia Artificial (IA)

### 4.1 Microservicio IA
La IA estará desarrollada como un microservicio independiente utilizando:
- **Runtime:** Bun
- **Framework Web:** Hono

### 4.2 Algoritmos Utilizados
- **Algoritmo A\*:** Para búsqueda óptima de caminos
- **Grafos:** Representación del espacio de movimientos posibles
- **Recursividad:** Análisis profundo de jugadas
- **Evaluación Heurística:** Scoring inteligente de posiciones

### 4.3 Funcionalidades de la IA
- Evaluación dinámica del tablero
- Predicción de movimientos enemigos
- Priorización automática de capturas
- Simulación de posibles jugadas futuras
- Ajuste de profundidad según nivel de dificultad
- Generación del mejor movimiento basado en análisis

### 4.4 Diferencias por Nivel de Dificultad

| Aspecto | Principiante | Intermedio | Master | Ultra |
|---------|---|---|---|---|
| Profundidad de búsqueda | 1-2 movimientos | 3-4 movimientos | 5-6 movimientos | 7+ movimientos |
| Prioridad de capturas | Básica | Media | Alta | Muy Alta |
| Análisis defensivo | Mínimo | Moderado | Avanzado | Experto |
| Tiempo de respuesta | <100ms | <200ms | <500ms | <1s |

---

## 5. Sistema de Rankings

### 5.1 Descripción
El sistema de rankings almacenará el rendimiento del jugador entre partidas, permitiendo una tabla global de posiciones actualizada en tiempo real.

### 5.2 Funcionamiento
- Cada victoria genera puntos
- Menor cantidad de movimientos = mayor puntuación
- El puntaje acumulado se mantiene entre sesiones
- Tabla global de posiciones ordenada por puntuación

### 5.3 Variables Consideradas en Puntuación
- **Cantidad de victorias:** Base de puntos por cada victoria
- **Número de movimientos:** Penalización por movimientos innecesarios
- **Tiempo de partida:** Bonus por partidas rápidas
- **Nivel de dificultad derrotado:** Multiplicador según dificultad

**Fórmula de Scoring (Conceptual):**
```
Puntos = (Victorias × Base) × (1 - MovimientosExtra/Max) × DificultadMultiplier × (1 + BonusVelocidad)
```

---

## 6. Sistema de Autenticación

### 6.1 Proveedor
**Clerk** - Gestión moderna de identidad

### 6.2 Funcionalidades
- Registro de usuarios
- Inicio de sesión seguro
- Protección de rankings asociados a usuarios
- Persistencia de progreso entre sesiones
- Asociación de compras y skins al perfil
- Gestión segura de sesiones

---

## 7. Sistema de Monetización y Pagos

### 7.1 Proveedor
**Stripe** - Pasarela de pago

### 7.2 Productos Comprabes
- Skins para fichas
- Skins para tablero
- Paquetes de cosmética futura

### 7.3 Características del Sistema
- Las skins son visibles para ambos jugadores durante la partida
- Validación automática de compras asociadas al usuario autenticado
- Los pagos están separados del flujo principal del juego
- Historial de compras almacenado en base de datos
- Soporte para múltiples métodos de pago

---

## 7.5 Sistema de Personalización

### 7.5.1 Descripción General
El sistema de personalización permitirá a los jugadores modificar la apariencia visual del juego, incluyendo fichas, tablero y animaciones. Este módulo está diseñado para expansión futura con más opciones cosméticas.

### 7.5.2 Categorías Personalizables

| Categoría | Descripción | Estado |
|-----------|-------------|--------|
| **Fichas** | Color, textura, brillo y efecto de las piezas de ambos jugadores | Futuro |
| **Tablero** | Color de casillas, bordes, textura de constelaciones, estilo de visor espacial | Futuro |
| **Animaciones** | Estelas de movimiento, partículas de captura, efecto de coronación, transiciones de pantalla | Futuro |

### 7.5.3 Tipos de Personalización

- **Predefinidas** (gratuitas): Conjuntos de colores y efectos básicos desbloqueables por logros o niveles
- **Premium** (tienda): Skins especiales adquiribles vía Stripe, integradas con el sistema de monetización existente

### 7.5.4 Flujo de Usuario

1. El jugador accede desde el menú principal → "Personalizar"
2. Selecciona una categoría (Fichas / Tablero / Animaciones)
3. Visualiza previsualización en tiempo real del cambio
4. Aplica la personalización (si es gratuita) o la compra (si es premium)
5. Los cambios se reflejan inmediatamente en el juego

### 7.5.5 Integración con Sistema Existente

- Las skins premium se almacenan en la colección `skins` de MongoDB (ver sección 14.4)
- El inventario del usuario se gestiona en `userSkins` (ver sección 14.6)
- Las compras pasan por Stripe (ver sección 7)
- Las personalizaciones gratuitas se asocian al perfil del usuario (colección `users`, campo `settings`)

### 7.5.6 Estado del Módulo

> **Nota:** Esta funcionalidad está planificada para desarrollo futuro. Actualmente solo existe el botón de acceso en el menú principal. Las pantallas de personalización, lógica de aplicación y la integración con el juego se implementarán en una fase posterior.

---

## 8. Tecnologías del Stack

### 8.1 Frontend
- **Framework:** TanStack Start (Meta-framework basado en React con SSR/SSG)
- **Bundler:** Vite
- **Tipo:** Full-Stack Meta-Framework (No es SPA, es Full-Stack)

**Notas Importantes sobre TanStack Start:**
- Reemplaza arquitectura SPA tradicional con Server-Side Rendering (SSR)
- Proporciona mejor SEO, performance y carga inicial
- Ofrece file-based routing automático
- Integración nativa con TypeScript

**Funciones del Frontend:**
- Renderizado del tablero interactivo con SSR
- Animaciones fluidas de movimientos
- Interfaz intuitiva de juego
- Visualización de rankings
- Gestión y previsualización de skins
- Comunicación con backend e IA
- Integración con sistema de autenticación (Clerk)
- Integración con pasarela de pago (Stripe)

### 8.2 Backend
- **Runtime:** Bun
- **Framework Web:** Hono
- **Tipo:** API REST + Eventos

**Funciones del Backend:**
- Gestión del ciclo de vida de partidas
- Exposición de APIs REST
- Cálculo y actualización de rankings
- Gestión de usuarios y perfiles
- Procesamiento de compras
- Persistencia de datos
- Validación de reglas de juego
- Coordinación entre servicios

### 8.3 Base de Datos
- **Motor:** MongoDB
- **Tipo:** Base de datos NoSQL documental

**Información Almacenada:**
- Datos de usuarios (perfiles, estadísticas)
- Historial completo de partidas
- Rankings y puntuaciones globales
- Inventario de skins compradas por usuario
- Estadísticas detalladas por jugador
- Transacciones de compra

### 8.4 Servicios de Terceros
- **Autenticación:** Clerk
- **Pagos:** Stripe
- **Hosting/Contenedorización:** Docker Compose

---

## 9. Arquitectura del Sistema

### 9.1 Patrón General: Microservicios

El sistema estará dividido en servicios independientes, desacoplados y escalables.

### 9.2 Microservicios Principales

#### 1. **Frontend Service**
**Responsabilidades:**
- Interfaz gráfica del juego
- Renderizado del tablero y fichas
- Experiencia de usuario (UX/UI)
- Captura de interacciones del jugador
- Visualización de rankings

#### 2. **Backend Service**
**Responsabilidades:**
- Lógica principal del juego
- Validación de movimientos
- Gestión de rankings
- Autenticación y autorización
- Procesamiento de pagos
- Orquestación de servicios

#### 3. **Database Service**
**Responsabilidades:**
- Persistencia de información
- Almacenamiento de partidas
- Almacenamiento de usuarios
- Consultas y agregaciones

#### 4. **IA Service**
**Responsabilidades:**
- Cálculo de movimientos óptimos
- Análisis del tablero
- Generación de decisiones de máquina
- Evaluación heurística

### 9.3 Tipo de Arquitectura: Stateless

Cada microservicio funcionará bajo un modelo **Stateless**.

**Características:**
- No guarda sesiones en memoria local
- Cada petición contiene la información necesaria
- Facilita escalabilidad horizontal
- Mejora tolerancia a fallos
- Permite balanceo de carga eficiente

**Ejemplo:**  
La IA no almacena partidas activas; únicamente recibe el estado del tablero, calcula el movimiento y responde.

---

## 10. Flujo General del Sistema

1. El jugador inicia sesión mediante Clerk
2. Se crea una nueva partida en el backend
3. El frontend renderiza el tablero inicial
4. El jugador realiza un movimiento
5. El frontend envía el movimiento al backend
6. El backend valida las reglas del juego
7. Si es turno de IA:
   - Backend consulta al microservicio IA
   - IA recibe el estado del tablero
   - IA retorna el mejor movimiento según dificultad
8. Backend actualiza el estado de la partida
9. Frontend recibe actualización y anima el movimiento
10. Se almacenan estadísticas en MongoDB
11. Rankings se actualizan en tiempo real
12. Jugador puede comprar skins mediante Stripe
13. Compras se asocian al perfil del usuario

---

## 11. Gestión de Contenedores

### 11.1 Herramienta: Docker Compose

**Beneficios:**
- Despliegue rápido y reproducible
- Separación clara de servicios
- Escalabilidad horizontal
- Entornos consistentes (desarrollo = producción)

### 11.2 Servicios en Contenedores
- Frontend Service (TanStack Start - Node.js runtime con SSR)
- Backend Service (Bun/Hono)
- IA Service (Bun/Hono)
- MongoDB
- Nginx (proxy reverso opcional)

---

## 12. Concepto Técnico - Validación de Movimientos

El sistema valida movimientos en múltiples capas:

### Capa 1: Frontend
- Validación visual (UI feedback)
- Movimientos permitidos por casilla

### Capa 2: Backend
- Validación completa de reglas
- Verificación de capturas obligatorias
- Validación de turnos

### Capa 3: IA
- Generación de movimientos legales
- Evaluación de mejor opción

---

## 13. Estructura de Carpetas por Microservicio

### 13.1 Estructura General del Proyecto

```
Damas-/
├── Docs/
│   ├── PRD.md
│   ├── API-Contracts.md
│   └── Architecture.md
├── services/
│   ├── frontend/
│   ├── backend/
│   ├── ia/
│   └── docker-compose.yml
├── .git/
└── README.md
```

### 13.2 Frontend Service

```
services/frontend/
├── src/
│   ├── components/
│   │   ├── Board/
│   │   │   ├── Board.tsx
│   │   │   ├── Square.tsx
│   │   │   └── styles.css
│   │   ├── Game/
│   │   │   ├── GameContainer.tsx
│   │   │   └── GameControls.tsx
│   │   ├── Auth/
│   │   │   └── LoginForm.tsx
│   │   ├── Rankings/
│   │   │   ├── RankingTable.tsx
│   │   │   └── PlayerStats.tsx
│   │   └── Shop/
│   │       ├── SkinShop.tsx
│   │       └── SkinPreview.tsx
│   ├── hooks/
│   │   ├── useGameLogic.ts
│   │   ├── useAuth.ts
│   │   └── useAPI.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── gameService.ts
│   │   └── iaService.ts
│   ├── types/
│   │   ├── game.ts
│   │   ├── user.ts
│   │   └── api.ts
│   ├── pages/
│   │   ├── Game.tsx
│   │   ├── Rankings.tsx
│   │   └── Shop.tsx
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── Dockerfile
```

**Tecnologías:**
- **TanStack Start** (Meta-framework full-stack, SSR/SSG enabled)
- Vite (Bundler - integrado en TanStack Start)
- TypeScript
- TailwindCSS (Estilos)
- TanStack Router (Routing - incluido en TanStack Start)
- TanStack Query (Data fetching - REQUIRED)
- Zustand o TanStack Store (State Management)

### 13.3 Backend Service

```
services/backend/
├── src/
│   ├── routes/
│   │   ├── game.ts
│   │   ├── user.ts
│   │   ├── rankings.ts
│   │   ├── purchase.ts
│   │   └── health.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── services/
│   │   ├── gameService.ts
│   │   ├── iaService.ts
│   │   ├── rankingService.ts
│   │   ├── userService.ts
│   │   └── paymentService.ts
│   ├── models/
│   │   ├── Game.ts
│   │   ├── User.ts
│   │   ├── Ranking.ts
│   │   └── Skin.ts
│   ├── database/
│   │   ├── connection.ts
│   │   └── schemas.ts
│   ├── validators/
│   │   ├── gameValidator.ts
│   │   └── moveValidator.ts
│   ├── utils/
│   │   ├── boardUtils.ts
│   │   ├── logger.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── game.ts
│   │   ├── api.ts
│   │   └── database.ts
│   └── index.ts (Hono app)
├── package.json
├── tsconfig.json
├── bun.lockb
└── Dockerfile
```

**Tecnologías:**
- Bun (Runtime)
- Hono (Framework web)
- TypeScript
- MongoDB Driver
- Clerk SDK (Auth)
- Stripe SDK (Payments)
- Zod (Validation)

### 13.4 IA Service

```
services/ia/
├── src/
│   ├── algorithms/
│   │   ├── aStar.ts
│   │   ├── evaluator.ts
│   │   ├── boardAnalyzer.ts
│   │   └── movementGenerator.ts
│   ├── difficulty/
│   │   ├── Beginner.ts
│   │   ├── Intermediate.ts
│   │   ├── Master.ts
│   │   └── Ultra.ts
│   ├── models/
│   │   ├── Board.ts
│   │   ├── Piece.ts
│   │   └── Move.ts
│   ├── routes/
│   │   ├── calculateMove.ts
│   │   ├── analyzeBoard.ts
│   │   └── health.ts
│   ├── utils/
│   │   ├── boardUtils.ts
│   │   ├── logger.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── game.ts
│   │   ├── api.ts
│   │   └── algorithm.ts
│   └── index.ts (Hono app)
├── package.json
├── tsconfig.json
├── bun.lockb
└── Dockerfile
```

**Tecnologías:**
- Bun (Runtime)
- Hono (Framework web)
- TypeScript
- Algoritmos: A*, Grafos, Recursividad
- Graph Data Structure (custom)

### 13.5 Docker Compose

```
services/docker-compose.yml
├── frontend (puerto 3000)
├── backend (puerto 3001)
├── ia (puerto 3002)
├── mongodb (puerto 27017)
└── nginx (puerto 80 - opcional)
```

---

## 14. Diseño de Colecciones MongoDB

### 14.1 Colección: `users`

```javascript
{
  _id: ObjectId,
  clerkId: String (unique),
  email: String (unique),
  username: String (unique),
  avatar: String (URL de imagen),
  createdAt: Date,
  updatedAt: Date,
  stats: {
    totalGames: Number,
    wins: Number,
    losses: Number,
    totalPoints: Number,
    averageMoves: Number
  },
  inventory: [ObjectId] // Referencias a _id de skins compradas
}
```

**Índices:**
- `clerkId` (unique)
- `email` (unique)
- `username` (unique)
- `stats.totalPoints` (descendente para rankings)

**Relaciones:**
- 1-N con `games` (un usuario tiene muchas partidas)
- 1-N con `purchases` (un usuario tiene muchas compras)
- M-N con `skins` a través de `userSkins`

### 14.2 Colección: `games`

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Referencia a users
  difficulty: String, // "beginner", "intermediate", "master", "ultra"
  status: String, // "active", "completed", "abandoned"
  board: {
    state: Array[Array[String]], // 8x8 board representation
    pieces: [
      {
        id: String,
        color: String, // "white", "black"
        position: { row: Number, col: Number },
        isKing: Boolean
      }
    ]
  },
  moves: [
    {
      from: { row: Number, col: Number },
      to: { row: Number, col: Number },
      capturedPiece: ObjectId | null,
      player: String, // "human" or "ai"
      timestamp: Date
    }
  ],
  currentPlayer: String, // "human" or "ai"
  result: String | null, // "human_win", "ai_win", "draw"
  totalMoves: Number,
  startedAt: Date,
  endedAt: Date | null,
  duration: Number // en segundos
}
```

**Índices:**
- `userId` (para queries rápidas por usuario)
- `status` (filtrar activas)
- `createdAt` (ordenar por recientes)
- `difficulty` (análisis por nivel)

**Relaciones:**
- N-1 con `users` (muchas partidas pertenecen a un usuario)

### 14.3 Colección: `rankings`

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Referencia a users
  rank: Number, // Posición global
  totalPoints: Number,
  wins: Number,
  losses: Number,
  winRate: Number, // porcentaje
  averageMoves: Number,
  bestDifficulty: String, // nivel más alto completado
  gamesPlayedThisMonth: Number,
  lastUpdated: Date,
  updatedAt: Date
}
```

**Índices:**
- `userId` (unique)
- `totalPoints` (descendente)
- `rank` (para búsquedas por ranking)
- `updatedAt` (para actualizaciones recientes)

**Relaciones:**
- 1-1 con `users` (cada usuario tiene un ranking)

### 14.4 Colección: `skins`

```javascript
{
  _id: ObjectId,
  name: String,
  type: String, // "piece", "board"
  category: String, // "classic", "premium", "limited"
  price: Number, // en centavos (USD)
  description: String,
  rarity: String, // "common", "rare", "epic", "legendary"
  preview: {
    imageUrl: String,
    thumbnail: String
  },
  properties: {
    color: String | null,
    pattern: String | null,
    effect: String | null // "glow", "particle", etc
  },
  createdAt: Date,
  isActive: Boolean
}
```

**Índices:**
- `type` (filtrar por tipo)
- `price` (ordenar por precio)
- `rarity` (filtrar por rareza)

**Relaciones:**
- 1-N con `purchases` (un skin puede tener muchas compras)
- M-N con `users` a través de `userSkins`

### 14.5 Colección: `purchases`

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Referencia a users
  skinId: ObjectId, // Referencia a skins
  stripePaymentId: String (unique),
  amount: Number, // en centavos
  currency: String, // "USD"
  status: String, // "completed", "pending", "failed", "refunded"
  purchasedAt: Date,
  refundedAt: Date | null,
  metadata: {
    ipAddress: String,
    userAgent: String
  }
}
```

**Índices:**
- `userId` (para historial de compras)
- `skinId` (para análisis de ventas)
- `stripePaymentId` (unique)
- `status` (filtrar por estado)
- `purchasedAt` (orden cronológico)

**Relaciones:**
- N-1 con `users` (muchas compras pertenecen a un usuario)
- N-1 con `skins` (muchas compras referencing a un skin)

### 14.6 Colección: `userSkins`

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Referencia a users
  skinId: ObjectId, // Referencia a skins
  acquiredAt: Date,
  isEquipped: Boolean,
  equipType: String | null, // "piece", "board"
}
```

**Índices:**
- `userId` + `skinId` (composite unique)
- `userId` + `isEquipped` (para encontrar skins activos)

**Relaciones:**
- Tabla de unión M-N entre `users` y `skins`

### 14.7 Colección: `aiAnalytics` (Opcional)

```javascript
{
  _id: ObjectId,
  gameId: ObjectId, // Referencia a games
  difficulty: String,
  moveCalculationTime: Number, // ms
  boardComplexity: Number, // métrica de evaluación
  depthSearched: Number,
  moveEvaluated: Number,
  bestMoveSelected: {
    from: { row: Number, col: Number },
    to: { row: Number, col: Number },
    score: Number
  },
  timestamp: Date
}
```

**Relaciones:**
- N-1 con `games` (análisis de cada movimiento IA)

---

## 15. Roadmap de Versiones

### 15.1 Versión 1.0 - Núcleo del Juego

**Objetivo:** Jugabilidad principal con dificultad Principiante

**Funcionalidades:**

**Frontend:**
- Tablero 8x8 interactivo
- Selección y movimiento de fichas
- Animaciones de movimientos
- Interfaz simple de inicio/fin de partida
- Representación visual clara de fichas y reinas

**Backend:**
- API REST con Hono
- Lógica de validación de reglas
- Gestión de estado del juego
- Persistencia básica en MongoDB
- Endpoints: `/game/create`, `/game/move`, `/game/state`

**IA Service:**
- Algoritmo de movimiento simple (minimax básico)
- Dificultad: PRINCIPIANTE
- Generación de movimientos legales
- Evaluación simple del tablero
- Respuesta en <100ms

**Base de Datos:**
- Colecciones: `games`, `users` (básica)
- Almacenamiento de partidas activas

**Tecnologías Específicas V1:**
```
Frontend:
- TanStack Start (Meta-framework, últimas versiones)
- TypeScript 5.x
- TailwindCSS 3.x
- TanStack Query 5.x (Data fetching)
- TanStack Router (Routing)
- Zustand (State Management)

Backend:
- Bun 1.x
- Hono 4.x
- TypeScript 5.x
- MongoDB Driver 6.x

IA:
- Bun 1.x
- Hono 4.x
- TypeScript 5.x
- Algoritmo Minimax (poda alfa-beta)

Database:
- MongoDB 7.x
- Mongoose (opcional)

DevOps:
- Docker 24.x
- Docker Compose 2.x
```

**Criterios de Aceptación V1:**
- [ ] Tablero renderiza correctamente
- [ ] Movimientos válidos se permiten
- [ ] Capturas funcionan
- [ ] IA principiante responde correctamente
- [ ] Partidas se guardan
- [ ] Validación de reglas al 100%

---

### 15.2 Versión 2.0 - Sistema de Rankings

**Objetivo:** Integrar rankings globales y persistencia de usuarios

**Nuevas Funcionalidades:**

**Frontend:**
- Pantalla de login (Clerk)
- Interfaz de rankings global
- Perfil de usuario
- Estadísticas personales
- Panel de partidas anteriores

**Backend:**
- Integración con Clerk
- Sistema de rankings en tiempo real
- Endpoints: `/user/profile`, `/rankings/global`, `/rankings/user/{id}`
- Cálculo automático de puntuación
- Fórmula de scoring:
  ```
  Puntos = (100 × VictoriasAcumuladas) × (1 - MovimientosExtra/50) × DificultadMultiplier
  ```

**IA Service:**
- Sin cambios respecto a V1

**Base de Datos:**
- Nuevas colecciones: `rankings`, `userStats`
- Índices de optimización para rankings
- Actualización de stats después de cada partida

**Integración Terceros:**
- Clerk para autenticación
- Sesiones persistentes

**Tecnologías Específicas V2:**
```
Adiciones respecto a V1:

Backend:
- Clerk SDK
- JWT para autenticación
- Middleware de autorización
- Agregación MongoDB para rankings

Frontend (TanStack Start):
- Clerk SDK para TanStack Start
- Middleware de autenticación en TanStack Start
- Protected routes usando TanStack Router
- Tabla dinámica para rankings con TanStack Query
```

**Criterios de Aceptación V2:**
- [ ] Login/Logout con Clerk funciona
- [ ] Rankings se actualizan en tiempo real
- [ ] Puntuación se calcula correctamente
- [ ] Historial de partidas es visible
- [ ] Perfil guarda estadísticas

---

### 15.3 Versión 3.0 - IA Avanzada y Monetización

**Objetivo:** Implementar todos los niveles de IA y sistema de skins

**Nuevas Funcionalidades:**

**Frontend:**
- Selector de dificultad (Principiante, Intermedio, Master, Ultra)
- Tienda de skins (Preview)
- Carrito de compras
- Integración Stripe Checkout
- Inventario de skins
- Customización visual de tablero y fichas

**Backend:**
- Endpoints para dificultades: `/ia/move?difficulty=master`
- Sistema de compras: `/purchase/skin`, `/user/inventory`
- Validación de compras
- Webhooks de Stripe
- Endpoints: `/shop/skins`, `/purchase/process`

**IA Service:**
- **Nivel Intermedio (Profundidad 3-4):**
  - Evaluación de capturas obligatorias
  - Análisis defensivo básico
  - Respuesta en <200ms
  
- **Nivel Master (Profundidad 5-6):**
  - Algoritmo A* completo
  - Evaluación heurística avanzada
  - Predicción de múltiples movimientos
  - Respuesta en <500ms
  
- **Nivel Ultra (Profundidad 7+):**
  - Máxima optimización de A*
  - Caché de posiciones evaluadas
  - Análisis profundo
  - Respuesta en <1s

**Base de Datos:**
- Nuevas colecciones: `skins`, `purchases`, `userSkins`, `aiAnalytics`
- Índices adicionales para búsquedas de compras

**Integración Terceros:**
- Stripe API completa
- Webhooks para confirmación de pagos

**Tecnologías Específicas V3:**
```
Backend Adicionales:
- Stripe SDK
- Zod para validación de schemas
- Redis (opcional) para caché de evaluaciones IA
- Bull (opcional) para colas de procesamiento

IA Adicionales:
- Algoritmo A* con graph-based pathfinding
- Estructura de datos: Priority Queue (Heap)
- Caché LRU para posiciones
- Recursive move evaluation

Frontend Adicionales (TanStack Start):
- Stripe SDK para TanStack Start
- Carrito de compras usando TanStack Store + TanStack Query
- Image optimization con TanStack Start server functions
- Lazy loading de imágenes usando TanStack Start streaming
- Server-side cart validation en TanStack Start handlers
```

**Criterios de Aceptación V3:**
- [ ] Todos los 4 niveles de IA disponibles
- [ ] IA Master responde en <500ms
- [ ] IA Ultra responde en <1s
- [ ] Tienda de skins carga correctamente
- [ ] Compras se procesan con Stripe
- [ ] Skins aparecen en el tablero
- [ ] Inventario se actualiza después de compra
- [ ] Analytics de IA se registran

---

### 15.4 Matriz de Soporte por Versión

| Característica | V1 | V2 | V3 |
|---|---|---|---|
| Juego 8x8 | ✅ | ✅ | ✅ |
| Dificultad Principiante | ✅ | ✅ | ✅ |
| Dificultad Intermedio | ❌ | ❌ | ✅ |
| Dificultad Master | ❌ | ❌ | ✅ |
| Dificultad Ultra | ❌ | ❌ | ✅ |
| Autenticación | ❌ | ✅ | ✅ |
| Rankings | ❌ | ✅ | ✅ |
| Skins | ❌ | ❌ | ✅ |
| Compras (Stripe) | ❌ | ❌ | ✅ |
| Analytics IA | ❌ | ❌ | ✅ |

---

## 16. Matriz de Requisitos

| ID | Requisito | Prioridad | V1 | V2 | V3 |
|---|---|---|---|---|---|
| REQ-001 | Tablero 8x8 interactivo | ALTA | ✅ | ✅ | ✅ |
| REQ-002 | Validación de reglas | ALTA | ✅ | ✅ | ✅ |
| REQ-003 | IA Principiante | ALTA | ✅ | ✅ | ✅ |
| REQ-004 | IA Intermedia | MEDIA | ❌ | ❌ | ✅ |
| REQ-005 | IA Master (A*) | MEDIA | ❌ | ❌ | ✅ |
| REQ-006 | IA Ultra | MEDIA | ❌ | ❌ | ✅ |
| REQ-007 | Autenticación Clerk | ALTA | ❌ | ✅ | ✅ |
| REQ-008 | Sistema Rankings | MEDIA | ❌ | ✅ | ✅ |
| REQ-009 | Tienda de Skins | MEDIA | ❌ | ❌ | ✅ |
| REQ-010 | Pagos Stripe | MEDIA | ❌ | ❌ | ✅ |
| REQ-011 | MongoDB persistence | ALTA | ✅ | ✅ | ✅ |
| REQ-012 | Docker Compose | MEDIA | ✅ | ✅ | ✅ |
| REQ-013 | API REST | ALTA | ✅ | ✅ | ✅ |
| REQ-014 | Análisis IA | BAJA | ❌ | ❌ | ✅ |

---

## 17. Dependencias Externas

- **Clerk:** Autenticación y gestión de identidad (desde V2)
- **Stripe:** Procesamiento de pagos (desde V3)
- **MongoDB Atlas (opcional):** Base de datos en la nube
- **Docker Hub:** Repositorio de imágenes
- **Node.js / Bun:** Runtimes

---

## 18. Métricas de Éxito

- [ ] V1: Sistema funcionando end-to-end
- [ ] V2: Rankings actualizándose en tiempo real
- [ ] V3: Validación de reglas al 100%
- [ ] Interfaz responsiva y fluida
- [ ] IA respondiendo según tiempos especificados
- [ ] Pagos procesados correctamente
- [ ] Todos los servicios en contenedores
- [ ] Cobertura de tests >70%

---

## 19. Hitos Principales

**Fase 1: Setup e Infraestructura (V1 P1)**
- Inicializar repositorio Git
- Configurar Docker Compose
- Estructura de microservicios
- Conexión a MongoDB

**Fase 2: Core Gameplay (V1 P2)**
- Tablero 8x8 en frontend
- Lógica del juego en backend
- Validación de movimientos
- IA Principiante

**Fase 3: Autenticación y Rankings (V2)**
- Integración Clerk
- Tabla de rankings
- Persistencia de usuarios
- API de estadísticas

**Fase 4: IA Avanzada (V3 P1)**
- Algoritmo A*
- Niveles Intermedio, Master, Ultra
- Optimizaciones de rendimiento
- Caché y analytics

**Fase 5: Monetización (V3 P2)**
- Integración Stripe
- Sistema de Skins
- Tienda visual
- Validación de compras

**Fase 6: Pulido y Release (V3 P3)**
- Testing e2e
- Optimizaciones
- Documentación
- Deployment

---

## 20. Riesgos Identificados

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|---|---|
| IA lenta en nivel Ultra | ALTO | MEDIA | Optimizar A*, caché de evaluaciones, limitar profundidad |
| Inconsistencia de estado | ALTO | BAJA | Arquitectura stateless, validación en backend |
| Problemas de escalabilidad | MEDIO | BAJA | Docker + load balancing, MongoDB sharding |
| Integración Stripe fallida | MEDIO | BAJA | Testing completo, sandbox antes de producción |
| Pérdida de datos | CRÍTICO | BAJA | Backups regulares MongoDB, replicación |

---

## 21. Próximos Pasos

1. Revisar y validar PRD con stakeholders
2. Inicializar estructura de carpetas (Phase 1)
3. Crear especificación técnica detallada
4. Definir API contracts completos
5. Iniciar desarrollo de V1 - Frontend y Backend
6. Desarrollar IA Principiante
7. Testing y validación
8. Preparar V2 (Clerk + Rankings)

---

**Documento preparado por:** Equipo de Desarrollo  
**Última actualización:** 26 de mayo de 2026
**Versión PRD:** 2.0
**Estado:** Listo para revisión
