# 🎮 Wireframe - Pantalla de Juego

**Componente:** Pantalla Juego  
**Versión:** 1.0  
**Responsable:** UI/UX Design  
**Estado:** ✅ Aprobado  

---

## 📐 Diagrama ASCII Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  👤 Jugador Rojo          Turno: ROJO ●               [LOGIN]      │ ← Header zona
│  Puntos: 450                                          (Esquina arr) │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                          ┌─ TABLERO 8×8 ─┐                        │
│                          │ (512×512 px)   │                        │
│    PANEL CONTROL         │                │       HISTORIAL        │
│   ┌──────────────┐      │   ┌─┬─┬─┬─┐   │     ┌──────────────┐ │
│   │ IA: Master   │      │   ├─┼─┼─┼─┤   │     │ Movimientos: │ │
│   │ Tiempo: 0.2s │      │   ├─┼─┼─┼─┤   │     │              │ │
│   │              │      │   ├─┼─┼─┼─┤   │     │ 1. R5→R4 x   │ │
│   │              │      │   ├─┼─┼─┼─┤   │     │ 2. I3→I4 ●   │ │
│   │ [⚙ Opciones]│      │   ├─┼─┼─┼─┤   │     │ 3. R4→R3 x   │ │
│   │ [❌ Salir]   │      │   ├─┼─┼─┼─┤   │     │ 4. I4→I5 ●   │ │
│   │              │      │   └─┴─┴─┴─┘   │     │              │ │
│   │ Fichas       │      │                │     │ [Scroll ▼]   │ │
│   │ Jugador: 12  │      │                │     └──────────────┘ │
│   │ IA: 12       │      │                │                      │
│   │              │      │                │                      │
│   │ IA pensando: │      │                │                      │
│   │ ⏳ 2.3s      │      │                │                      │
│   │              │      │                │                      │
│   └──────────────┘      └────────────────┘                       │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Tiempo partida: 4:32  │  FPS: 60  │  Status: Tu turno            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Zonas y Dimensiones Detalladas

### Header - Información de Jugadores

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ZONA IZQUIERDA (Jugador Humano):                  │
│  👤 Jugador Rojo                                    │
│  Puntos: 450                                        │
│                                                     │
│  ZONA CENTRO:                                       │
│  Turno: ROJO ● (o Turno: IA ●)                    │
│  Indicador visual de turno                         │
│                                                     │
│  ZONA DERECHA:                                      │
│  [LOGIN/PROFILE] (ver menú principal)              │
│                                                     │
└─────────────────────────────────────────────────────┘

ESPECIFICACIONES ZONA IZQUIERDA:
┌─────────────────────┐
│ 👤 (Avatar 24x24)  │ ← Imagen cuadrada
│ JugadorProName1234  │ ← Nombre (truncado)
│ Puntos: 450         │ ← Puntuación actual
│ Fichas: 12          │ ← Fichas en tablero
└─────────────────────┘

Estilos:
- Avatar: 24x24px, border-radius 4px
- Nombre: 12px bold, #FFFFFF
- Puntos: 10px, #FFD700
- Font: monospace
- Padding: 12px
- Fondo: #1E2547 (sutil)
- Border: 1px #67E8F9

ESPECIFICACIONES ZONA CENTRO:
┌────────────────┐
│ Turno: ROJO ●  │ ← Indicador turno
│                │
│ (Animación)    │ ← Parpadeo durante turno
└────────────────┘

Estilos:
- Fuente: 14px bold, #FFFFFF
- Color indicador: #FF4D6B (rojo cósmico) o #67E8F9 (cyan)
- Parpadeo: 500ms on/off
- Tamaño punto: 12x12px

ALTURA TOTAL HEADER: 48px
PADDING: 12px vertical, 16px horizontal
BORDE INFERIOR: 1px #67E8F9
```

---

### Panel Principal - Área de Juego

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│         TABLERO 8×8                                 │
│         ┌─────────────────────────┐                │
│         │                         │                │
│         │   [512×512 pixeles]     │                │
│         │   (Escalado 2x desde    │                │
│         │    base 256×256)        │                │
│         │                         │                │
│         │ Casillas: 64×64px cada  │                │
│         │                         │                │
│         └─────────────────────────┘                │
│                                                      │
│ Borde tablero: 2px #67E8F9                         │
│ Sombra: 4px offset #000000 (50% opacity)          │
│ Posición: Centrada horizontalmente                  │
│ Margin superior: 24px (desde header)               │
│ Margin inferior: 24px (hacia status bar)           │
│                                                      │
└──────────────────────────────────────────────────────┘

INTERACTIVIDAD TABLERO:
- Hover casilla: Resalta con color más claro
- Click casilla: Selecciona si contiene ficha propia
- Drag ficha: Muestra ruta potencial
- Double-click movimiento válido: Confirma
- ESC: Deselecciona

VISUALIZACIÓN EN TABLERO:
┌─────────┐
│ X (0,0) │ ← Coordenada (fila, columna)
├─────────┤
│ Casilla clara (#1E2547) o oscura (#0B0D2B)
│ Ficha roja (♜) o cyan (♛)
│ Corona (*) si es reina
│ Casilla posible (◆ dorado si mostrada)
└─────────┘
```

---

### Panel Izquierdo - Control y Estado

```
PANEL CONTROL (Izquierda del tablero):
┌──────────────────────────┐
│  IA: Master              │ ← Nivel dificultad
│  Tiempo: 0.2s            │ ← Tiempo respuesta promedio
│  Profundidad: 5          │ ← Movimientos analizados
│                          │
│  ┌────────────────────┐  │
│  │  [♻ Deshacer]     │  │ ← Botón rojo
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │  [⚙ Opciones]    │  │ ← Botón gris
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │  [❌ Salir]        │  │ ← Botón rojo
│  └────────────────────┘  │
│                          │
│ ─────────────────────── │
│                          │
│  Fichas en juego:        │
│  ┌──────────────────┐   │
│  │ Jugador: 12 ♜    │   │
│  │ IA: 12 ♛         │   │
│  └──────────────────┘   │
│                          │
│  Estado IA:              │
│  ⏳ Pensando: 2.3s      │
│  (Barra progreso visual) │
│                          │
│  (O)                     │
│  ▰▰▰▱▱▱ 50%            │
│                          │
└──────────────────────────┘

DIMENSIONES:
Ancho: 200px
Posición: Izquierda tablero - 24px
Altura: Variable, mín 300px
Padding: 12px
Borde: 1px #67E8F9
Fondo: #1E2547

BOTONES CONTROL:
Ancho: 100%
Alto: 32px
Separación: 8px
Estilo: Cyan (#67E8F9) o Rojo (#FF4D6B)
```

---

### Panel Derecho - Historial de Movimientos

```
HISTORIAL DE MOVIMIENTOS (Derecha del tablero):
┌────────────────────────┐
│ Movimientos:           │ ← Header
│ ───────────────────── │
│                        │
│ 1. R5→R4 ♜             │ ← Movimiento humano
│ 2. I3→I4 ♛             │ ← Movimiento IA
│ 3. R4→R3 ♜             │
│    (Captura x1)        │
│ 4. I4→I5 ♛             │
│ 5. R3→R2 ♜             │
│    (Coronación ♛)      │
│ 6. I5→I3 ♛             │
│    (Captura x2)        │
│                        │
│ [Scroll ▼]             │
│                        │
└────────────────────────┘

DIMENSIONES:
Ancho: 180px
Posición: Derecha tablero + 24px
Altura: 300px
Overflow: Scroll vertical
Padding: 8px
Borde: 1px #67E8F9
Fondo: #1E2547

CONTENIDO:
Numeración: 8px, #9CA3AF
Movimiento: 10px, #B0E0FF
Símbolo ficha: 10px, #FFFFFF
Notación: FROM→TO (ej: R5→R4)

EVENTOS MOVIMIENTO:
- Movimiento realizado: Añade a lista
- Scroll automático: Al final
- Highlight último: #FFD700
- Highlight seleccionado: #67E8F9
```

---

### Footer - Status Bar

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  Tiempo partida: 4:32  │  FPS: 60  │  Estado: Tu turno│
│                                                        │
│  Estadísticas en tiempo real                          │
│                                                        │
└────────────────────────────────────────────────────────┘

LAYOUT:
- Zona izquierda: Tiempo partida
- Zona centro: FPS/Performance
- Zona derecha: Estado actual

Estilos:
- Fuente: 8px monospace
- Color: #B0E0FF
- Fondo: #1E2547
- Borde superior: 1px #67E8F9
- Alto: 32px
- Padding: 8px

CONTENIDO:
- Tiempo: HH:MM:SS format
- FPS: Mostrar si baja de 60
- Estado:
  * "Tu turno" (verde)
   * "Turno IA" (cyan)
   * "Esperando..." (dorado)
  * "¡Ganaste!" (verde brillante)
  * "¡Perdiste!" (rojo)
```

---

## 🎯 Comportamientos Interactivos

### Turno del Jugador

```
ESTADO: Tu turno (cyan en status bar)

1. Jugador selecciona ficha:
   ┌─────────────────────────┐
   │ Casilla seleccionada:   │
   │ - Borde dorado 2px      │
   │ - Fondo: Más claro      │
   │ - Mostrar movimientos   │
   │   válidos (◆ dorado)    │
   └─────────────────────────┘

2. Movimientos válidos:
   - Diagonales adelante 1 casilla
   - Si es reina: Múltiples casillas en diagonal
   - Si hay captura: Obligatoria
   - Mostrar con símbolo ◆

3. Jugador arrastra (drag) o click:
   - Confirma movimiento
   - Actualiza tablero animado con delay visible (150ms)
   - Deselecciona
   - Pasa turno a IA

4. Historial:
   - Añade entrada
   - Scroll automático
   - Highlight último movimiento
```

### Turno de la IA

```
ESTADO: "Turno IA" (cyan en status bar)

1. IA pensando:
   ┌──────────────────────┐
   │ ⏳ Pensando: 2.3s    │
   │ ▰▰▰▱▱▱ 50%          │
   │ (Barra progreso)     │
   └──────────────────────┘
   - Parpadeo suave
   - Contador en tiempo real

2. IA decide movimiento:
   - Barra progreso: 100%
   - Demora visible antes de pintar el movimiento (320ms)
   - Tablero se actualiza
   - Movimiento animado con desplazamiento visible

3. Animación movimiento:
   ┌─────────────────────┐
   │ Ficha IA se mueve:  │
   │ - Duración: 320ms   │
   │ - Delay: 320ms      │
   │ - Easing: Linear    │
   │ - Landing: -2px     │
   └─────────────────────┘

4. Transición:
   - Deselecciona
   - Pasa turno a jugador
   - Historial actualizado
```

---

## 📱 Layout Responsivo

### Móvil (320px - 480px)

```
┌──────────────────────┐
│ [LOGIN] (esquina)    │
│ 👤 JugadorName  [●]  │ ← Comprimido
├──────────────────────┤
│                      │
│   TABLERO 256x256    │ ← Reducido
│   (escala 1x)        │
│                      │
├──────────────────────┤
│ Turno: ROJO ●        │ ← Debajo tablero
│                      │
│ Panel control:       │ ← Tabs
│ [Control] [Historia] │
│ [IA] [Fichas]        │
│                      │
├──────────────────────┤
│ Tiempo: 4:32 │ State │
└──────────────────────┘

Layout: Single column
Tablero: 256x256 (sin escala)
Paneles: Tabs/Collapsible
```

### Tablet (768px - 1024px)

```
┌────────────────────────────────────┐
│ 👤 JugadorName  [●]     [LOGIN]    │ ← Header
├────────────────────────────────────┤
│                                    │
│  Panel Ctrl   Tablero   Historial  │ ← 3 columnas
│  (150px)      (400x400) (150px)    │
│               Grid 5x5             │
│                                    │
│  Control:                          │
│  - IA Info                         │
│  - Botones                         │
│  - Fichas                          │
│                                    │
│  Historial:                        │
│  - Scroll vertical                 │
│  - Último resaltado                │
│                                    │
├────────────────────────────────────┤
│ Tiempo: 4:32 │ FPS │ Estado        │ ← Footer
└────────────────────────────────────┘

Layout: 3 columnas
Tablero: 400x400 (escala 1.56x)
Paneles: Side-by-side
```

### Desktop (1024px+)

```
┌──────────────────────────────────────────────────────┐
│ 👤 JugadorName              Turno: ROJO ●  [LOGIN]   │ ← Header
├──────────────────────────────────────────────────────┤
│                                                      │
│ Panel Control   Tablero 8×8      Historial          │
│ (200px)         (512x512)        (180px)            │
│                                                      │
│ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐   │
│ │ IA: Master  │ │             │ │ Movimientos: │   │
│ │ Tiempo: 0.2 │ │   [Tablero] │ │              │   │
│ │             │ │   [512×512] │ │ 1. R5→R4 ♜   │   │
│ │ [♻ Deshacer]│ │             │ │ 2. I3→I4 ♛   │   │
│ │ [⚙ Opciones]│ │             │ │ 3. R4→R3 ♜   │   │
│ │ [❌ Salir]   │ │             │ │ 4. I4→I5 ♛   │   │
│ │             │ │             │ │              │   │
│ │ Fichas:     │ │             │ │ [Scroll]     │   │
│ │ P: 12 ♜     │ │             │ │              │   │
│ │ I: 12 ♛     │ │             │ │              │   │
│ │             │ │             │ │              │   │
│ │ ⏳ 2.3s     │ │             │ │              │   │
│ └─────────────┘ └─────────────┘ └──────────────┘   │
│                                                      │
├──────────────────────────────────────────────────────┤
│ Tiempo: 4:32 │ FPS: 60 │ Estado: Tu turno           │
└──────────────────────────────────────────────────────┘

Layout: 3 columnas espaciadas
Tablero: 512x512 (escala 2x)
Ancho total recomendado: 1024px+
Paneles: Fixed ancho
```

---

## 🎨 Estados Visuales del Tablero

### Casilla Clara (Activa)
```
Fondo: #1E2547
Borde: 1px #67E8F9
Sombra: Interna sutil

Hover: Fondo +10% brillo
Seleccionada: Borde 2px #FFD700
Con movimiento válido: Símbolo ◆ dorado
```

### Casilla Oscura (Activa)
```
Fondo: #0B0D2B
Borde: 1px #1E2547
Sombra: Interna sutil

Hover: Fondo +5% brillo
Seleccionada: Borde 2px #FFD700
Con movimiento válido: Símbolo ◆ dorado
```

---

## ✅ Checklist Implementación

- [ ] Crear componente GameBoard.tsx (tablero 8x8)
- [ ] Componente PlayerProfile.tsx (info jugador)
- [ ] Componente ControlPanel.tsx (botones, estado IA)
- [ ] Componente MoveHistory.tsx (historial scrolleable)
- [ ] Componente StatusBar.tsx (footer)
- [ ] Integrar lógica de turnos
- [ ] Animaciones de movimiento 200ms
- [ ] Responsive design (mobile-first)
- [ ] Testing en múltiples resoluciones
- [ ] Drag & drop para movimientos (opcional)

---

**Última revisión:** 26 de mayo de 2026  
**Aprobado por:** Equipo de Diseño  
**Listo para:** Implementación Frontend
