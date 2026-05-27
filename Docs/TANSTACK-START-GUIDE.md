# 🚀 TanStack Start - Guía Específica del Proyecto Damas

**Importante:** Este documento es CRÍTICO para entender el stack del frontend. Léelo antes de escribir cualquier código frontend.

---

## 1. ¿Qué es TanStack Start?

**TanStack Start** es un meta-framework full-stack moderno creado por Tanner Linsley.

**NO es:**
- ❌ React tradicional (SPA)
- ❌ Next.js
- ❌ Un framework típico de React

**ES:**
- ✅ Un meta-framework full-stack con SSR/SSG
- ✅ Basado en Vite (no Webpack)
- ✅ TypeScript-first
- ✅ Con Server Functions integradas
- ✅ Incluye routing, data fetching, y state management nativamente

---

## 2. Stack Exacto del Proyecto Damas

```
Frontend Stack:
├── TanStack Start (Latest)
├── TypeScript 5.x
├── Vite 5.x (automático)
├── TanStack Router (routing)
├── TanStack Query 5.x (data fetching)
├── TanStack Store o Zustand (state)
├── TailwindCSS 3.x (styling)
├── Clerk SDK for TanStack (auth)
└── Stripe SDK for TanStack (payments)
```

---

## 3. Patrones de Desarrollo Correctos

### ✅ DATA FETCHING - Usar TanStack Query

**CORRECTO:**
```typescript
// En component.tsx
import { useQuery } from '@tanstack/react-query'

export function GameBoard() {
  const { data: gameState } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const res = await fetch(`/api/game/${gameId}`)
      return res.json()
    }
  })

  return <Board state={gameState} />
}
```

**INCORRECTO:**
```typescript
// ❌ NO HAGAS ESTO - Axios directo
const [gameState, setGameState] = useState(null)
useEffect(() => {
  axios.get(`/api/game/${gameId}`).then(setGameState)
}, [gameId])
```

---

### ✅ SERVER FUNCTIONS - Para operaciones sensibles

**CORRECTO:**
```typescript
// En component.tsx
import { useMutation } from '@tanstack/react-query'
import { createGameAction } from './actions'

export function StartGame() {
  const mutation = useMutation({
    mutationFn: createGameAction
  })

  return (
    <button onClick={() => mutation.mutate({ difficulty: 'master' })}>
      Iniciar Partida
    </button>
  )
}

// En actions.ts (Server-side)
'use server'

export async function createGameAction(data: { difficulty: string }) {
  // Este código corre SOLO en servidor
  const game = await db.games.create(data)
  return game
}
```

**INCORRECTO:**
```typescript
// ❌ NO HAGAS ESTO - Backend separado
const handleStart = async () => {
  const res = await axios.post('/api/game/create', { difficulty: 'master' })
}
```

---

### ✅ STATE MANAGEMENT - Zustand + TanStack Query

**CORRECTO:**
```typescript
import { create } from 'zustand'

export const useGameStore = create((set) => ({
  selectedPiece: null,
  setSelectedPiece: (piece) => set({ selectedPiece: piece })
}))

// En component:
export function Square({ piece, position }) {
  const selectedPiece = useGameStore(s => s.selectedPiece)
  
  return (
    <div onClick={() => useGameStore.setState({ selectedPiece: piece })}>
      {piece}
    </div>
  )
}
```

**INCORRECTO:**
```typescript
// ❌ NO HAGAS ESTO - useContext para todo
const GameContext = createContext()

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  return <GameContext.Provider value={state}>{children}</GameContext.Provider>
}
```

---

### ✅ ROUTING - Usar TanStack Router

**Estructura de carpetas:**
```
src/
├── routes/
│   ├── __root.tsx          // Layout raíz
│   ├── index.tsx           // /
│   ├── game/
│   │   ├── $gameId.tsx    // /game/:gameId
│   │   └── create.tsx     // /game/create
│   ├── rankings/
│   │   └── index.tsx      // /rankings
│   └── shop/
│       └── index.tsx      // /shop
└── App.tsx
```

**CORRECTO:**
```typescript
// src/routes/__root.tsx
import { RootRoute } from '@tanstack/react-router'

export const rootRoute = new RootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  )
})

// src/routes/game/$gameId.tsx
import { Route } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const gameRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'game/$gameId',
  component: GamePage
})

// En component:
import { useParams, useNavigate } from '@tanstack/react-router'

export function GamePage() {
  const { gameId } = useParams({ from: gameRoute.fullPath })
  const navigate = useNavigate()
  
  return (
    <div>
      <h1>Game {gameId}</h1>
      <button onClick={() => navigate({ to: '/rankings' })}>
        Ver Rankings
      </button>
    </div>
  )
}
```

**INCORRECTO:**
```typescript
// ❌ NO HAGAS ESTO - React Router
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'

<Routes>
  <Route path="/game/:gameId" element={<GamePage />} />
</Routes>
```

---

### ✅ MIDDLEWARE DE AUTENTICACIÓN

**CORRECTO:**
```typescript
// En __root.tsx middleware
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuth } from '@clerk/tanstack-start'

export const protectedRoute = (route) => {
  return {
    ...route,
    beforeLoad: async ({ location }) => {
      const { isSignedIn } = useAuth()
      
      if (!isSignedIn && !['/login', '/signup'].includes(location.pathname)) {
        throw redirect({
          to: '/login',
          search: { returnUrl: location.href }
        })
      }
    }
  }
}
```

---

## 4. Estructura de Proyecto TanStack Start

```
damas-frontend/
├── src/
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── game/
│   │   ├── rankings/
│   │   └── shop/
│   ├── components/
│   │   ├── Board/
│   │   ├── Game/
│   │   ├── Rankings/
│   │   └── Shop/
│   ├── hooks/
│   │   ├── useGame.ts
│   │   ├── useRankings.ts
│   │   └── useShop.ts
│   ├── stores/
│   │   ├── gameStore.ts
│   │   └── uiStore.ts
│   ├── actions/
│   │   ├── game.server.ts
│   │   ├── auth.server.ts
│   │   └── shop.server.ts
│   ├── lib/
│   │   ├── queryClient.ts
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   └── App.tsx
├── app.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile
```

---

## 5. Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Ejecutar producción localmente
npm run start

# TypeScript check
npm run type-check
```

---

## 6. Requisitos por Versión

### V1 (Gameplay)
- ✅ TanStack Start básico
- ✅ TanStack Router con file-based routing
- ✅ TanStack Query para state de juego
- ✅ Zustand para UI state
- ✅ Tablero interactivo (sin auth)

### V2 (Rankings + Auth)
- ✅ Clerk SDK integrado
- ✅ Server Functions para proteger endpoints
- ✅ Protected routes con TanStack Router
- ✅ Queries agregadas para rankings
- ✅ Middleware de autenticación

### V3 (Tienda + IA Avanzada)
- ✅ Stripe SDK para TanStack Start
- ✅ Server Functions para procesar pagos
- ✅ Invalidación de cache TanStack Query post-compra
- ✅ Lazy loading de imágenes con TanStack Start streaming
- ✅ Selector de dificultad dinámico

---

## 7. Problemas Comunes

### ❌ Error: "Cannot find module '@tanstack/react-query'"
**Solución:** Instalar las dependencias correctas
```bash
npm install @tanstack/react-router @tanstack/react-query @tanstack/store
```

### ❌ "useQuery is not a function"
**Causa:** Usando query de React Query v3 en lugar de v5
**Solución:** Actualizar a React Query 5.x

### ❌ "Server function not working"
**Causa:** Falta `'use server'` directive en acciones
**Solución:** Agregar al inicio del archivo de acciones

---

## 8. Documentación de Referencia

- **TanStack Start:** https://tanstack.com/start/latest
- **TanStack Router:** https://tanstack.com/router/latest
- **TanStack Query:** https://tanstack.com/query/latest
- **TypeScript:** https://www.typescriptlang.org/docs/

---

## 9. Preguntas Frecuentes

**P: ¿Puedo usar Redux?**
A: No. Usa Zustand + TanStack Query. Mucho más simple.

**P: ¿Debo usar Next.js en su lugar?**
A: No. TanStack Start es más moderno y más rápido.

**P: ¿Puedo agregar Express al frontend?**
A: No. TanStack Start proporciona server functions nativas.

**P: ¿Cómo obtengo datos del backend?**
A: Usa Server Functions o fetch directo a la API. TanStack Query lo maneja.

---

**Última actualización:** 26 de mayo de 2026
**Versión:** 1.0
