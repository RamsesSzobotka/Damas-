# Algoritmos de IA — Damas

## Arquitectura

```
Frontend (WebSocket) → Backend (gameService) → HTTP → IA Service → Backend → WS → Frontend
```

El servicio de IA recibe el tablero, el jugador que debe mover y la dificultad. Según la dificultad,
dispara el algoritmo correspondiente y devuelve el movimiento `{ from, to, captured }`.

---

## Principiante (`beginner`)

**Archivo:** `services/ia/src/algorithms/beginner.ts`
**Algoritmo:** Greedy con captura forzada y movimiento aleatorio.

### Lógica

```typescript
export function getBeginnerMove(board, player) {
  const moves = getAllValidMoves(board, player)  // captura forzada
  if (moves.length === 0) return null

  const captures = getCaptureMoves(moves)
  if (captures.length > 0) return captures[0]    // primera captura (row-major)

  return getRandomMove(moves)                     // movimiento aleatorio
}
```

1. Obtiene todos los movimientos válidos (el motor de reglas ya aplica **captura forzada**:
   si alguna ficha puede comer, solo devuelve capturas).
2. Si hay capturas, elige **la primera que encuentra** (recorrido fila por fila).
3. Si no hay capturas, elige un movimiento **completamente aleatorio**.

### Ejemplo

```
Tablero:
  · b · b · b · b     (fila 0, IA)
  b · b · b · b ·     (fila 1, IA)
  · b · b · b · b     (fila 2, IA)
  · · · · · · · ·
  · · · · · P · ·     (fila 4)
  P · · · · · · P     (fila 5, jugador)
  · P · · · · · ·     (fila 6, jugador)
  · · P · · · · ·     (fila 7, jugador)

La IA (b, fila 2) puede comer al jugador (P, fila 4):
  - La IA en (2,0) come a (4,2) saltando a (5,1) o retrocede comiendo a (3,1)
    depende de la dirección. En este caso concreto, la primera captura
    encontrada en el barrido row-major es la que se ejecuta.
    No hay evaluación de cuál captura es mejor.
```

---

## Intermedio (`intermediate`)

**Archivo:** `services/ia/src/difficulty/intermediate.ts`
**Algoritmo:** A* profundidad 1 — evaluación heurística de cada movimiento posible.

### Lógica

```typescript
export function getIntermediateMove(board, player) {
  const moves = getAllValidMoves(board, player)
  if (moves.length === 0) return null

  for (const move of moves) {
    const newBoard = applyMove(board, move)
    const score = evaluateBoard(newBoard)   // h(n)
    // guardar el mejor
  }
  return elijeAleatorioEntreLosMejores()
}
```

**Equivalente a A*:**
- `g(n) = 0` — no hay costo de camino
- `h(n)` = `evaluateBoard(n)` — heurística del tablero resultante
- `f(n) = h(n)` — se elige el movimiento que maximiza h(n)

### Heurística

```typescript
function evaluateBoard(board): number {
  // +1 por cada ficha normal propia
  // +3 por cada rey propio
  // -1 por cada ficha normal enemiga
  // -3 por cada rey enemigo
  // +bonificación por control del centro (±0.05 por casilla de distancia)
  // +bonificación por avance hacia coronación (±0.05 por fila)
}
```

### Ejemplo

```
Tablero:
  · · · · · · · ·
  · · · · · · · ·
  · · · · · · · ·
  · · · b · · · ·     (IA en (3,3))
  · · P · · · · ·     (Jugador en (4,2))
  · · · · · · · ·
  · · · · · · · ·
  · · · · · · · ·

La IA tiene 2 movimientos:
  A) Comer al jugador: (3,3) → (5,1) saltando sobre (4,2)
     Tablero resultante: IA gana +1 material, avanza 2 filas
     Score h(A) = +1 (material) + 0.3 (avance) + 0.05 (centro) = +1.35

  B) Movimiento simple: (3,3) → (4,2)  [no, está ocupado]
     En realidad no hay movimiento simple disponible.

  → Elige A) porque es el único, pero si hubiera dos capturas,
    evaluaría cuál deja mejor tablero (más avance, mejor posición).
```

**Comparación con beginner:**
- Beginner solo elige `captures[0]` (primera captura en orden de tablero)
- Intermediate simula el resultado de **cada** movimiento y elige el mejor evaluado
- Intermediate añade **variedad**: si dos movimientos tienen la misma puntuación, elige aleatorio

---

## Master (`master`)

**Archivo:** `services/ia/src/difficulty/master.ts`
**Algoritmo:** Minimax con poda Alfa-Beta, profundidad 3-4.

### Lógica

```typescript
function minimax(board, depth, alpha, beta, maximizing): number {
  if (depth === 0) return evaluateBoard(board)
  if (noMoves)      return maximizing ? -10000 : 10000

  ordenarMovimientos(capturas primero)  // mejora la poda

  for (const move of moves) {
    newBoard = applyMove(board, move)
    score = minimax(newBoard, depth - 1, alpha, beta, !maximizing)
    // poda alfa-beta
  }
  return bestScore
}
```

La función itera:

```
Nivel 0 (IA, maximiza):   elige el movimiento con MAYOR puntuación mínima
  ├─ Nivel 1 (Jugador, minimiza): elige la respuesta con MENOR puntuación
  │   ├─ Nivel 2 (IA, maximiza): evalúa
  │   ├─ Nivel 2 (IA, maximiza): evalúa
  │   └─ ...
  ├─ Nivel 1 (Jugador, minimiza): ...
  └─ ...
```

### Poda Alfa-Beta

- **alpha**: mejor puntuación garantizada para la IA (maximizador)
- **beta**: mejor puntuación garantizada para el jugador (minimizador)
- Si `beta <= alpha`, se **poda** la rama (no merece la pena explorarla)

### Heurística (más refinada que intermediate)

```typescript
function evaluateBoard(board): number {
  // +1 ficha, +3 rey
  // +0.10 por control del centro (vs 0.05 en intermediate)
  // +0.08 por avance (vs 0.05)
  // +0.05 por seguridad en bordes (esquina y columnas 0/7)
  // penalización de ±10000 si un jugador no tiene movimientos
}
```

### Ejemplo

```
Tablero:
  · · · · · · · b     (fila 0, IA tiene rey)
  · · · · · · · ·
  · · · · · · · ·
  · · · P · · · ·     (fila 3, jugador)
  · · · · · · · ·
  · · · · · · · ·
  · · · · · · · ·
  · · · · · · · ·

IA (rey en (0,7)) tiene varias opciones. Con profundidad 3:

Opción A: Rey (0,7) → (2,5) [movimiento simple]
  → Jugador responde: P (3,3) → (4,2) [no come, avanza]
    → IA: (2,5) → (3,4) [sigue avanzando]
      Score final: IA controla centro, avanza rey = +4.2

Opción B: Rey (0,7) → (3,4) [salta sobre (1,6) → (2,5) → (3,4)]
  Espera, eso requiere 3 saltos. El rey puede ir de (0,7) a (3,4)
  porque es rey y el camino está despejado.
  → Jugador responde: P (3,3) → (4,2) o come?
    → Si P come al rey: el rey estaría en (3,4) y el jugador en (3,3)?
      No pueden estar en la misma diagonal. Depende del tablero real.

El minimax evalúa AMBAS líneas de juego hasta profundidad 3-4
y elige la que garantiza la mejor puntuación mínima para la IA.
```

**Comparación con intermediate:**
- Intermediate solo mira el resultado inmediato (profundidad 1)
- Master **anticipa las respuestas del jugador** hasta 3-4 jugadas
- Master usa poda alfa-beta para no desperdiciar tiempo en ramas malas
- Master ordena **capturas primero** para podar más eficientemente

---

## Ultra (`ultra`)

**Estado:** No implementado — actualmente usa el algoritmo de Master como fallback.

El diseño planeado incluiría:
- Minimax con profundidad 6+
- Búsqueda de deepening iterativo (tiempo limitado)
- Heurística avanzada (movilidad, estructura, fichas colgadas)
- Tablas de transposición (caching de estados evaluados)
- Ventana de aspiración (búsqueda más eficiente)

---

## Resumen de dificultades

| Nivel | Algoritmo | Profundidad | Heurística | Poda | Tiempo |
|-------|-----------|-------------|------------|------|--------|
| Principiante | Greedy + Random | 0 | Ninguna | No | < 10ms |
| Intermedio | A* (búsqueda heurística) | 1 | Material + Centro + Avance | No | < 200ms |
| Master | Minimax + Alfa-Beta | 3-4 | Material + Centro + Avance + Bordes | Alfa-Beta | < 2s |
| Ultra | Minimax + ID + TT (planeado) | 6+ | Heurística avanzada | Alfa-Beta + Ventana | < 5s |

---

## Flujo de datos completo

```
Frontend selecciona dificultad
  → POST /api/game/create { difficulty: "intermedio" }
    → Backend mapea "intermedio" → "intermediate"
    → Guarda en MongoDB: game.difficulty = "intermediate"
    → Devuelve gameId + tablero

Durante la partida (WebSocket):
  → Jugador mueve → Backend recibe → Aplica movimiento
  → Backend lee game.difficulty de MongoDB
  → Backend llama IA Service: POST /calculate-move { board, currentPlayer: 2, difficulty: "intermediate" }
    → IA Service dispatches: getIntermediateMove(board, 2)
    → Devuelve { from, to, captured }
  → Backend aplica movimiento de IA
  → Backend envía a Frontend vía WebSocket: move_applied + ai_move
```

---

## Ejecución y pruebas

**Reconstruir el servicio de IA después de cambios:**

```bash
cd services/ia
bun run build      # o bun run dev para desarrollo
```
