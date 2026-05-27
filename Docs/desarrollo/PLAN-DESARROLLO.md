# Plan de Desarrollo — Damas Universe V1

**Fecha:** 27 de mayo de 2026  
**Versión:** 1.0 — Principiante  
**Estado:** Planificado

---

## 📋 Resumen del Proyecto

Implementación de un juego de Damas completo (checkers) con arquitectura de microservicios:

```
Frontend (TanStack Start)  ──WebSocket──►  Backend (Hono/Bun)  ──HTTP──►  IA Service (Hono/Bun)
      ▲                                                                          │
      └────────────────────────── HTTP Response ─────────────────────────────────┘
```

---

## 🧱 Stack Tecnológico

| Servicio | Runtime | Framework | Puerto |
|----------|---------|-----------|--------|
| Frontend | Bun 1.x | TanStack Start + Vite | 3000 |
| Backend | Bun 1.x | Hono 4.x | 3001 |
| IA | Bun 1.x | Hono 3.x | 3002 |
| DB | MongoDB | 7.x | 27017 |

---

## 📁 Archivos a Crear/Modificar

### 1. IA Service (`services/ia/`)

| Archivo | Propósito | Dependencias |
|---------|-----------|-------------|
| `src/models/Board.ts` | Tipos: Piece, Board (8×8), Move, Direction | - |
| `src/utils/boardUtils.ts` | Tablero inicial, clonar, aplicar movimientos | Board.ts |
| `src/utils/rulesEngine.ts` | Validación completa reglas damas | Board.ts |
| `src/algorithms/moveGenerator.ts` | Generar movimientos válidos + capturas obligatorias | Board.ts, rulesEngine.ts |
| `src/algorithms/beginner.ts` | IA Principiante: captura > random | moveGenerator.ts |
| `src/routes/calculateMove.ts` | Ruta `POST /calculate-move` | beginner.ts |
| `src/index.ts` **(modificar)** | Agregar ruta POST /calculate-move | calculateMove.ts |

#### Reglas de Damas a implementar (rulesEngine.ts)
- [x] Movimiento diagonal adelante (fichas normales)
- [x] Captura saltando pieza enemiga
- [x] Captura múltiple (cadena)
- [x] Captura obligatoria (si hay, no se puede otro movimiento)
- [x] Promoción a reina al llegar al extremo
- [x] Movimiento de reina (diagonal múltiples casillas)
- [x] La reina captura igual que ficha normal pero también hacia atrás
- [x] Fin del juego: sin fichas o sin movimientos válidos

#### Payload
```
POST /calculate-move
Request:  { board: number[][], currentPlayer: number }
Response: { from: [row, col], to: [row, col] }
```

---

### 2. Backend (`services/backend/`)

| Archivo | Propósito | Dependencias |
|---------|-----------|-------------|
| `src/routes/game.ts` | Rutas REST + WebSocket para partidas | gameService.ts |
| `src/services/gameService.ts` | Orquestar lógica de juego (crear, mover, validar turnos) | iaClient.ts, modelos DB |
| `src/services/iaClient.ts` | HTTP fetch al IA Service | - |
| `src/index.ts` **(modificar)** | Agregar rutas game + WebSocket handler | game.ts |

#### WebSocket Flow
```
1. Frontend conecta WS a backend (ws://localhost:3001/ws?gameId=xxx)
2. Backend mantiene Map<gameId, WebSocket[]> para broadcast
3. Player hace click → frontend envía mensaje:
   { type: "player_move", gameId, from: [r,c], to: [r,c] }
4. Backend:
   a. Valida turno (debe ser del jugador humano)
   b. Aplica movimiento humano en board
   c. Broadcast { type: "move_applied", board, lastMove: {from, to, player} }
   d. Llama a IA Service: POST /calculate-move
   e. Aplica movimiento de IA
   f. Broadcast { type: "ai_move", board, lastMove: {from, to, player: "ai"} }
   g. Si alguien ganó → broadcast { type: "game_over", result }
   h. Guarda en MongoDB
5. Frontend recibe mensajes y actualiza UI reactivamente
```

#### API REST endpoints

| Método | Ruta | Propósito |
|--------|------|-----------|
| POST | `/api/game/create` | Crear nueva partida, retorna gameId + board |
| GET | `/api/game/:gameId` | Obtener estado actual de partida |

#### WebSocket messages

| Tipo (Frontend → Backend) | Payload |
|--------------------------|---------|
| `player_move` | `{ gameId, from: [r,c], to: [r,c] }` |

| Tipo (Backend → Frontend) | Payload |
|--------------------------|---------|
| `game_state` | `{ board, currentPlayer, status, gameId }` |
| `move_applied` | `{ board, lastMove: {from, to, player} }` |
| `ai_move` | `{ board, lastMove: {from, to, player: "ai"} }` |
| `game_over` | `{ result: "victory" | "defeat" | "draw", board }` |
| `error` | `{ message }` |

---

### 3. Frontend (`services/frontend/`)

| Archivo | Propósito |
|---------|-----------|
| `src/hooks/useGame.ts` | WebSocket connection + game state management |
| `src/hooks/useWebSocket.ts` | Hook genérico WebSocket con reconexión |
| `src/stores/gameStore.ts` | Zustand store: board, selectedPiece, gameId, currentPlayer |
| `src/components/Game/GameBoard.tsx` | Tablero 8×8 simple, clics para seleccionar/mover |
| `src/components/Game/BoardSquare.tsx` | Casilla individual del tablero |
| `src/components/Game/Piece.tsx` | Ficha visual (círculo simple) |
| `src/components/Game/GameContainer.tsx` | Layout de la pantalla de juego |
| `src/routes/game/play.tsx` | Ruta `/game/play?difficulty=principiante` |
| `src/routes/game/difficulty.tsx` **(modificar)** | Navegar a `/game/play?difficulty=...` |

#### Board representation (8×8 matrix)
```
0 = vacío
1 = ficha jugador (rojo)
2 = ficha IA (blanco)
3 = rey jugador
4 = rey IA
```

#### Flujo Frontend
```
1. /game/difficulty → selecciona → navigate to /game/play?difficulty=principiante
2. GameContainer se monta:
   a. POST /api/game/create → recibe gameId + board inicial
   b. Conecta WebSocket a ws://host/ws?gameId=xxx
3. Usuario hace clic en ficha → se almacena en gameStore.selectedPiece
4. Usuario hace clic en destino válido:
   a. Envía ws message: { type: "player_move", gameId, from, to }
   b. Espera respuesta (board actualizado con movimiento IA)
5. Recibe ws message "move_applied" → actualiza board
6. Recibe ws message "ai_move" → actualiza board (movimiento IA renderizado)
7. Recibe "game_over" → muestra resultado
```

---

## 🔄 Flujo Completo de un Turno

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│ Frontend │         │ Backend │         │   IA    │
│ (WS/HTTP)│         │ (Hono)  │         │ (Hono)  │
└────┬────┘         └────┬────┘         └────┬────┘
     │                   │                   │
     │ POST /game/create │                   │
     │──────────────────►│                   │
     │◄──────────────────│                   │
     │ gameId + board    │                   │
     │                   │                   │
     │ WS connect        │                   │
     │══════════════════►│                   │
     │◄══════════════════│ game_state        │
     │                   │                   │
     │ WS: player_move   │                   │
     │══════════════════►│                   │
     │                   │ Validar movimiento│
     │                   │ Aplicar en board  │
     │◄══════════════════│ move_applied      │
     │                   │                   │
     │                   │ POST /calculate   │
     │                   │──────────────────►│
     │                   │                   │ Generar movimiento
     │                   │◄──────────────────│
     │                   │   {from, to}      │
     │                   │                   │
     │                   │ Aplicar mov IA    │
     │                   │ Guardar en MongoDB│
     │◄══════════════════│ ai_move (board)   │
     │                   │                   │
     │ Renderizar board  │                   │
     │ (turno completado)│                   │
```

---

## 📐 Convenciones de Código

1. **Tipos**: Usar `number[][]` para board (0-4), `[number, number]` para posiciones
2. **Board como matriz 8×8**: `board[row][col]`, row 0 = arriba (fichas IA), row 7 = abajo (fichas jugador)
3. **Jugador humano** = piezas rojas (1), mueve hacia arriba (row decreciente)
4. **IA** = piezas blancas (2), mueve hacia abajo (row creciente)
5. **Sin animaciones** en V1 — solo actualización de estado
6. **Colores fichas**: Jugador = `#FF4D6B` (rojo cósmico), IA = `#F0F8FF` (blanco estelar)

---

## 🧪 Criterios de Aceptación

- [ ] Tablero 8×8 se renderiza correctamente
- [ ] Jugador puede seleccionar ficha (highlight visual)
- [ ] Jugador puede mover ficha a destino válido
- [ ] Capturas funcionan (simple y múltiple)
- [ ] Captura obligatoria se enforcea
- [ ] Promoción a reina funciona
- [ ] Reina se mueve correctamente
- [ ] IA responde con movimiento válido
- [ ] WebSocket actualiza frontend en tiempo real
- [ ] Victoria/derrota se detecta correctamente
- [ ] Partidas se guardan en MongoDB
- [ ] Build de todos los servicios exitoso

---

## 📌 Notas para Próximas Sesiones

- V1 solo dificultad PRINCIPIANTE
- IA Principiante: si hay captura → ejecuta la primera disponible; si no → movimiento aleatorio
- Sin animaciones, sin skins, sin autenticación
- WebSocket implementado con patrón Pub/Sub (Map<gameId, Set<WebSocket>>)
- Backend usa Hono WS middleware o `@hono/node-server` con upgrade a WebSocket
- La validación de reglas de damas está ENTERAMENTE en el IA Service (reutilizable por backend si es necesario)
- El backend SOLO valida turnos y orquesta el flujo, NO duplica lógica de damas
