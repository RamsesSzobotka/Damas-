# Skill.md - Diseño de Interfaz (UI/UX)

## Juego: Damas Universe (Checkers) — Player vs Machine

- **Nombre del Proyecto:** Damas Universe  
- **Versión:** 1.2  
- **Fecha:** 27 de mayo de 2026  
- **Estilo objetivo:** Pixel art cósmico / espacial inspirado en galaxias, nebulosas y espacio profundo. Estética retro-futurista con claridad visual y fuerte identidad pixel art.

---

# 1. Paleta de Colores Principal (Estética Espacial)

| Uso | Color Hex | RGB | Descripción |
|---|---|---|---|
| Fondo principal | `#0B0D2B` | 11,13,43 | Espacio profundo (dark navy) |
| Acento principal | `#C026D3` | 192,38,211 | Magenta púrpura galáctico |
| Acento secundario | `#FFD700` | 255,215,0 | Dorado para coronas y resaltes |
| Acento luminoso | `#67E8F9` | 103,232,249 | Cyan espacial y efectos |
| Texto principal | `#FFFFFF` | 255,255,255 | Blanco |
| Texto secundario | `#B0E0FF` | 176,224,255 | Azul claro espacial |
| Jugador 1 (Rojo) | `#FF4D6B` | 255,77,107 | Fichas rojas cósmicas |
| Jugador 2 (Blanco) | `#F0F8FF` | 240,248,255 | Fichas blancas / plateadas |
| Fondo de botones | `#1E2547` | 30,37,71 | Paneles semi-transparentes |

---

# 2. Tipografía (Pixel Art)

## Fuentes principales

### Títulos y encabezados
- **Press Start 2P (Bold)**

### Texto secundario / logs
- **VT323**
- O cualquier fuente pixel art altamente legible.

### Requisitos visuales
- Mantener fuerte identidad pixel art.
- Excelente legibilidad en UI y HUD.
- Compatibilidad con resoluciones HD/FHD.

---

# 3. Fondos

## Fondo principal
- Galaxia espiral púrpura.
- Estrellas brillantes.
- Nebulosas suaves.
- Espacio profundo con efectos glow sutiles.

## Fondos secundarios
- Variaciones espaciales:
  - galaxias lejanas,
  - nebulosas,
  - estrellas,
  - distorsiones cósmicas.

---

# 4. Resolución Recomendada

| Tipo | Resolución |
|---|---|
| HD | 1280×720 |
| Full HD | 1920×1080 |

## Relación de aspecto
- 16:9

## Estilo visual general
- Tablero central dominante.
- UI futurista con overlays semi-transparentes.
- Marcos tecnológicos estilo visor espacial.
- Pixel art grande y legible.

---

# 5. Flujo de Pantallas

# 5.1 Pantalla Inicial (Title Screen)

## Elementos principales

### Fondo
- Galaxia espiral púrpura.
- Estrellas brillantes.
- Nebulosas dinámicas.

### Logo
- Texto grande:
  - `DAMAS UNIVERSE`
- Glow cyan y dorado.
- Estética pixel art futurista.

### Botón principal
- `START GAME`
- Resalte dorado.
- Hover glow nebular.

### Opciones secundarias
- Credits
- Options
- Exit

---

# 5.2 Menú Principal

## Fondo
- Espacial sutil animado.

## Animaciones de entrada / flotación
- Logo, panel de menú, botones, perfil y footer flotan suavemente.
- Stagger escalonado: logo (0s), perfil (0.2s), botones (0.15s × índice), panel (0.4s), footer (0.6s).
- CSS `@keyframes float`: translateY(0) → translateY(-8px) → translateY(0), 3s ease-in-out, infinito.
- Los botones detienen su flotación individual al hacer hover (se sobrepone la animación de hover).

## Opciones
- New Game (vs Machine)
- Difficulty
  - Easy
  - Medium
  - Hard
  - Expert
- How to Play
- Galaxy Stats

---

# 5.3 Pantalla de Juego (Tablero Principal)

# Layout principal

## Fondo
- Galaxia profunda.
- Estrellas brillantes.
- Nebulosas suaves.

## Tablero
- Tablero 8x8 centrado.
- Bordes luminosos.
- Estilo visor espacial.
- Pixel art detallado.

## Fichas
### Jugador rojo
- Aura magenta.
- Glow cósmico.

### Jugador blanco
- Aura cyan.
- Apariencia estelar.

## Indicador de turno
- Parte superior.
- Glow animado.

## Información de jugadores

### Izquierda
- YOU
- Red Cosmic

### Derecha
- AI
- White Star
- Nivel de dificultad

---

# Panel inferior

## Botones
- Hint Move
- Undo
- Surrender
- Menu

## Estilo
- Futurista.
- Glow cyan/dorado.
- Hover animado.

---

# Elementos clave

## Movimiento
- Estelas estelares.
- Partículas cósmicas.

## Coronación
- Explosión dorada.
- Partículas cyan.

## Capturas
- Desintegración estelar.

## Movimientos válidos
- Glow cyan/dorado.

## Log de movimientos
- HUD espacial.
- Caja semi-transparente.

---

# 5.4 Pantalla de Victoria / Derrota

## Fondo
- Galaxia intensificada.
- Partículas dinámicas.

## Victoria
### Texto
`COSMIC VICTORY!`

### Efectos
- Explosión de estrellas.
- Partículas luminosas.

---

## Derrota
### Texto
`BLACK HOLE DEFEAT`

### Efectos
- Oscurecimiento.
- Colapso visual.

---

## Estadísticas
- Movimientos realizados.
- Capturas.
- Tiempo de partida.
- Nivel IA.

## Botones
- Rematch
- Main Menu

---

# 6. Componentes UI Reutilizables

## Caja de diálogo / Logs
- Bordes cyan/dorado.
- Fondo oscuro translúcido.
- Efecto nebular.

## Botones
- Glow futurista.
- Hover animado.
- Bordes luminosos.

## Cursor / Selector
- Marco pixelado.
- Efecto scanner espacial.

## Tablero
- Textura de constelaciones.
- Bordes iluminados.

## Fichas
- Pixel art cósmico.
- Versiones:
  - normal,
  - coronada.

## Timer
- Diseño futurista.
- Contador estelar.
- Glow dinámico.

---

# 7. Animaciones y Feedback

## Transiciones
- Warp espacial.
- Estrellas en movimiento.

## Hover en botones
- Glow cyan.
- Leve escalado.

## Flotación de elementos del menú
- Logo, botones, perfil y footer flotan suavemente en ciclo infinito.
- Cada elemento tiene un `animation-delay` escalonado (0s, 0.15s, 0.3s, etc.) para efecto cascada.
- Animación CSS `@keyframes float` con translateY de 0 a -8px en 3s ease-in-out.
- Aplicable a cualquier elemento del menú principal y pantallas secundarias.

## Movimiento de fichas
- Estelas de partículas.

## Coronación
- Burst de luz dorada.
- Explosión cósmica.

## Captura
- Desintegración estelar.

## IA pensando
- Texto:
  - `AI THINKING...`
- Estrella giratoria.
- Nebulosa animada.

## Victoria
- Explosión galáctica.

## Derrota
- Colapso oscuro.

---

# 8. Assets Necesarios

## Fondos
- Galaxia púrpura principal.
- Variaciones espaciales.

## Tablero
- Tablero pixel art 8x8.
- Temática espacial.

## Fichas
- Rojas cósmicas.
- Blancas estelares.
- Versiones coronadas.

## Partículas
- Estrellas.
- Nebulosas.
- Glows.
- Explosiones.

## Iconos
- Corona estelar.
- Trofeo galáctico.
- Cursor futurista.

## Sonidos
- Retro-futuristas.
- Láser suave.
- Explosiones espaciales.
- Victoria cósmica.

---

# 9. Notas del Diseñador

El diseño de **Damas Universe** busca combinar la jugabilidad clásica de damas con una estética espacial retro-futurista altamente inmersiva.

La interfaz debe priorizar:
- claridad visual,
- lectura rápida del tablero,
- feedback satisfactorio,
- identidad visual fuerte.

La galaxia púrpura funciona como elemento central de identidad visual, mientras que los efectos glow cyan/dorado refuerzan la sensación cósmica y tecnológica del universo del juego.

El objetivo es que el jugador sienta que participa en una batalla estratégica dentro de un universo galáctico estilizado en pixel art.
