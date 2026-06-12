# Verificación contra Requisitos del Proyecto

**Proyecto:** Damas Universe  
**Fecha:** 12 de junio de 2026  
**Instrucciones de referencia:** Requisitos académicos (Proyecto 9 - Desarrollo de Software IX)

---

## Resumen de Cumplimiento

| Requisito | Peso | Estado |
|-----------|------|--------|
| Motor de damas y validación backend | 20 pts | ✅ CUMPLE |
| Microservicio IA en Bun con **A* puro** | 25 pts | ❌ **NO CUMPLE** (usa Minimax) |
| Login con contraseñas cifradas | 15 pts | ❌ **NO CUMPLE** (usa Clerk OAuth) |
| Ranking persistente en MongoDB | — (incluido en login/ranking) | ✅ CUMPLE |
| Pago en línea (Stripe test) | 15 pts | ✅ CUMPLE |
| Tests (unitarios + e2e Playwright) | 10 pts | ❌ **NO CUMPLE** (insuficientes) |
| Documentación, Docker y demo | 15 pts | ⚠️ PARCIAL |

**Puntaje estimado actual:** ~45/100  
**Puntaje posible con correcciones:** 95/100

---

## 1. Motor de Damas y Validación Backend (20 pts)

**Estado: ✅ CUMPPLE**

### Lo que funciona:
- Tablero 8×8 con movimiento diagonal hacia adelante
- Capturas simples y múltiples (cadenas multi-jump)
- Captura obligatoria automática
- Promoción a rey al llegar al borde contrario
- Fin de partida (sin fichas o sin movimientos)
- Backend valida movimientos
- Frontend solo envía decisiones y muestra estado

### Variante implementada: **Damas Inglesas/Americanas 8×8**

### Archivos clave:
| Archivo | Rol |
|---------|-----|
| `services/ia/src/utils/rulesEngine.ts` | Motor de reglas completo |
| `services/backend/src/services/gameService.ts` | Orquestación del juego en backend |
| `services/frontend/src/utils/checkersMoves.ts` | Cálculo de movimientos válidos en frontend |

### Acción: ✅ Ninguna, está completo

---

## 2. Microservicio IA con A* PURO (25 pts) — ❌ CRÍTICO

**Estado: ❌ NO CUMPLE — El requisito dice A* exclusivamente, sin variaciones. Prohibido Minimax, Alpha-Beta, Monte Carlo.**

### Problema detectado:

| Dificultad | Algoritmo REAL | ¿Cumple? |
|------------|---------------|-----------|
| **Beginner** | Greedy (prioriza captura o aleatorio) | ⚠️ Aceptable si se reemplaza con A* básico |
| **Intermediate** | Pseudo-A* (solo heurística greedy depth-1) | ❌ No es A* real (sin open set, closed set, g(n)+h(n)) |
| **Master** | **Minimax + poda Alfa-Beta** depth 4 | ❌ **PROHIBIDO explícitamente** |
| **Ultra** | **Minimax + Alfa-Beta + TT + ID** depth 8+ | ❌ **PROHIBIDO explícitamente** |

### Requisito obligatorio:
> *"La IA del oponente debe decidir sus movimientos usando el algoritmo A* — obligatorio y sin variaciones — implementado en un microservicio independiente en Bun. NO minimax, NO alpha-beta, NO Monte Carlo. Solo A*."*

### 🔧 Acciones requeridas:

| Archivo | Acción |
|---------|--------|
| `services/ia/src/difficulty/master.ts` | **REESCRIBIR**: Eliminar función `minimax()`, implementar A* puro con profundidad 4+ |
| `services/ia/src/difficulty/ultra.ts` | **REESCRIBIR**: Eliminar función `minimax()`, implementar A* puro con profundidad 6+ y heurística mejorada |
| `services/ia/src/difficulty/intermediate.ts` | **REESCRIBIR**: Implementar A* genuino con `g(n)+h(n)`, open set, closed set |
| `services/ia/src/algorithms/beginner.ts` | **OPCIONAL**: Reemplazar greedy con A* de profundidad 1 |
| `services/ia/src/routes/calculateMove.ts` | **VERIFICAR**: Que todas las dificultades usen A* y no haya referencias a minimax |
| `README.md` (raíz) | **ACTUALIZAR**: Eliminar referencias a minimax/alfa-beta |

### ¿Qué es A* puro para damas?
- `f(n) = g(n) + h(n)` donde:
  - `g(n)` = costo real desde el estado inicial (profundidad = #movimientos realizados)
  - `h(n)` = heurística estimada (ventaja de material, control del centro, etc.)
- Open set (priority queue) y closed set (visited states)
- Reapertura de nodos si se encuentra camino mejor
- Para juego de 2 jugadores: A* busca el mejor movimiento evaluando el espacio de estados del oponente

---

## 3. Login con Contraseñas Cifradas (15 pts) — ❌ CRÍTICO

**Estado: ❌ NO CUMPLE**

### Problema:
El proyecto usa **Clerk** (OAuth externo) para autenticación. Clerk maneja todo: registro, login, sesiones, modales. El backend solo sincroniza datos de Clerk a MongoDB.

### Requisito:
> *"Login: registro e inicio de sesión con contraseñas cifradas."*

Esto implica:
- Endpoint `POST /api/auth/register` con email, username, password
- Endpoint `POST /api/auth/login` con validación de credenciales
- Contraseñas almacenadas con **bcrypt** (hash + salt)
- Sesión con JWT o token-based

### 🔧 Acciones requeridas:

| Archivo | Acción |
|---------|--------|
| `services/backend/src/routes/auth.ts` | **AGREGAR**: Endpoints `/register` y `/login` con bcrypt |
| `services/backend/package.json` | **AGREGAR**: Dependencia `bcrypt` (o `bcryptjs`) y `jsonwebtoken` |
| `services/backend/src/models/User.ts` | **MODIFICAR**: Hacer `clerkId` opcional, agregar campos `password`, `email`, `username` como principales |
| `services/frontend/src/routes/__root.tsx` | **MODIFICAR**: Agregar opción de login con email/password además de Clerk |
| `.env.example` | **AGREGAR**: Variable `JWT_SECRET` |

### Opción recomendada:
Mantener Clerk como alternativa OAuth y agregar el registro/login propio. Así:
- `POST /api/auth/register` → crea usuario con bcrypt + JWT
- `POST /api/auth/login` → valida credenciales, devuelve JWT
- Clerk sigue funcionando para quien prefiera OAuth

---

## 4. Ranking Persistente en MongoDB

**Estado: ✅ CUMPLE** (incluido en los 15 pts de login/ranking)

- Colección `rankings` en MongoDB con puntos, victorias, rachas, winrate
- Actualización al terminar partidas (WebSocket)
- Top global visible en `/rankings`
- Sistema de ligas con 4 niveles

---

## 5. Pago en Línea — Stripe Test (15 pts)

**Estado: ✅ CUMPLE**

- Stripe Checkout modo test funcional
- Compra de skins individuales y paquetes (`piece_and_board`)
- Confirmación de pago y asignación de skin
- Colección `purchases` y `userSkins` en MongoDB

---

## 6. Tests (10 pts) — ❌ INSUFICIENTE

**Estado: ❌ NO CUMPLE — faltan tests del motor de reglas, algoritmos IA, y e2e Playwright**

### Tests existentes:

| Archivo | Lo que prueba |
|---------|--------------|
| `services/backend/src/routes/shop.test.ts` | Shop API - equipar skins |
| `services/backend/src/database/seed.test.ts` | Seed de skins en DB |
| `services/frontend/src/components/Game/BoardSquare.test.tsx` | Renderizado de casilla |

### 🔧 Acciones requeridas (priorizadas):

| Prioridad | Test | Archivo a crear |
|-----------|------|----------------|
| 🔴 Alta | **Motor de reglas** (`rulesEngine.ts`) | `services/ia/src/utils/rulesEngine.test.ts` |
| 🔴 Alta | **Algoritmos IA** (A*, beginner, intermediate, master, ultra) | `services/ia/src/difficulty/*.test.ts` |
| 🟡 Media | **Backend API** (game, auth, payment) | `services/backend/src/routes/*.test.ts` |
| 🟡 Media | **Configurar Playwright** + tests e2e | `services/frontend/playwright.config.ts` |
| 🟢 Baja | **Agregar script test** a IA package.json | `services/ia/package.json` |

### Tests recomendados para motor de reglas (prioridad máxima):
```typescript
describe('RulesEngine', () => {
  test('getSimpleMoves: ficha normal solo diagonal adelante')
  test('getCaptures: captura simple')
  test('getCaptures: cadena multi-captura')
  test('getCaptures: captura obligatoria')
  test('getValidMoves: captura tiene prioridad sobre movimiento simple')
  test('isGameOver: sin fichas = game over')
  test('isGameOver: sin movimientos válidos = game over')
  test('promoción: ficha llega al borde contrario = rey')
  test('getAllValidMoves: retorna solo capturas si hay obligatorias')
})
```

### Tests para IA (alta prioridad):
```typescript
describe('AI Algorithms', () => {
  test('A* devuelve movimiento válido')
  test('A* prioriza capturas')
  test('A* con profundidad 4 encuentra captura múltiple')
  test('A* con estado terminal devuelve movimiento ganador')
})
```

---

## 7. Documentación, Docker y Demo (15 pts)

**Estado: ⚠️ PARCIAL**

### Lo que cumple:
- ✅ `docker-compose.yml` funcional con 4 servicios (frontend, backend, ia, mongodb)
- ✅ README.md con instrucciones de ejecución
- ✅ Diagrama de arquitectura en README
- ✅ README describe reglas de la variante inglesa

### Lo que falta/no cumple:
| Aspecto | Estado | Acción |
|---------|--------|--------|
| README menciona "Minimax" | ❌ | Actualizar a "A* puro" |
| Limitaciones conocidas | ❌ | Agregar sección |
| README describe cómo se invoca A* | ⚠️ | Mejorar documentación del endpoint |
| Variante elegida documentada | ✅ | Ya documentada |

---

## Plan de Acción Resumido

### Fase 1 — 🔴 Urgente (antes de entrega)
| # | Tarea | Archivos | Impacto en nota |
|---|-------|----------|----------------|
| 1 | **Reemplazar Minimax por A* puro** en master.ts y ultra.ts | 3 archivos | +25 pts |
| 2 | **Implementar login/registro con bcrypt** | 3-4 archivos | +15 pts |
| 3 | **Crear tests del motor de reglas** | 1 archivo | +5 pts |
| 4 | **Crear tests de algoritmos IA** | 1-2 archivos | +5 pts |

### Fase 2 — 🟡 Importante
| # | Tarea | Archivos | Impacto |
|---|-------|----------|---------|
| 5 | Instalar/configurar Playwright + tests e2e | 2 archivos | +2 pts (bono) |
| 6 | Actualizar README.md (sin minimax, con limitaciones) | 1 archivo | +5 pts |
| 7 | Implementar A* genuino en intermediate.ts | 1 archivo | (parte de #1) |

### Fase 3 — 🟢 Opcional
| # | Tarea | Archivos |
|---|-------|----------|
| 8 | Agregar endpoint de health check | 1 archivo |
| 9 | Agregar script test a ia/package.json | 1 archivo |

---

## Estimación de Nota Final

| Escenario | Puntaje |
|-----------|---------|
| **Estado actual** (sin correcciones) | ~45/100 ❌ |
| **Con Fase 1 completa** (A* + login + tests reglas + tests IA) | ~90/100 ✅ |
| **Con Fase 1 + Fase 2** (+ Playwright + README) | ~97/100 ✅ |
| **Completo** | 100/100 ✅ |

---

*Documento generado contra requisitos académicos del Proyecto 9 — Desarrollo de Software IX*
*Fecha límite de entrega: 13 de junio de 2026, 11:59 PM*
