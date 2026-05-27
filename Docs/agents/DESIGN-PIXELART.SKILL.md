---
name: Diseño Pixel Art para Damas
description: Skill especializada en crear assets visuales con estilo pixel art 8-bit/16-bit retro para el juego de Damas, basado en el mismo estilo usado en el proyecto Pokemon del equipo
applyTo: "**/*.{tsx,ts,css,scss}|**/*.{png,svg,jpg}"
---

# Skill: Diseño Pixel Art para Damas

**Propósito:** Proporcionar especificaciones de diseño visual, paletas de color, dimensiones de assets y guías de implementación para mantener consistencia en el estilo pixel art retro del proyecto Damas.

**Scope:** Tablero de juego, fichas, UI components, efectos visuales, animaciones.

---

## 1. Estilo Visual General

### 1.1 Inspiración: Pokémon Pixel Art

El proyecto utiliza el mismo **estilo pixel art retro** que el proyecto Pokémon del equipo:

- **Era:** 8-bit/16-bit inspired (Game Boy Color / SNES aesthetic)
- **Resolución Base:** 32x32 pixels para elementos principales
- **Paleta Primaria:** 16-64 colores máximo por asset
- **Antialiasing:** Ninguno (preservar bordes pixelados nítidos)
- **Animaciones:** Sprite sheets con 4-8 frames por acción

### 1.2 Características Clave

✅ **Bordes Definidos:** Todos los elementos tienen contornos claros
✅ **Paleta Limitada:** 4-8 colores por elemento (no gradient)
✅ **Simetría:** Fichas y tablero mantienen simetría rotacional
✅ **Nostalgia:** Referencias visuales a juegos clásicos de estrategia
✅ **Escalabilidad:** Assets creados a 32x32, escalables a 64x64, 128x128 sin interpolación

---

## 2. Paleta de Colores Estándar

### 2.1 Colores Base del Tablero

```
TABLERO CLARO (White Squares):
#F5E6D3 (Crema suave - fondo)
#E8D4B8 (Sombra suave)
#D4A574 (Highlight)

TABLERO OSCURO (Black Squares):
#2A1810 (Marrón oscuro - fondo)
#1A0F08 (Negro-marrón - sombra)
#4A3820 (Marrón claro - highlight)
```

### 2.2 Fichas - Jugador (Rojo)

```
FICHA PRINCIPAL:
#FF4444 (Rojo primario)
#CC0000 (Rojo oscuro - sombra)
#FFAA00 (Amarillo - highlight)
#FFFFFF (Blanco - brillo máximo)

FICHA REINA (Corona):
#FFD700 (Oro)
#FFA500 (Naranja oscuro - sombra)
#FFFF00 (Amarillo brillante)
```

### 2.3 Fichas - Máquina (Azul)

```
FICHA PRINCIPAL:
#4444FF (Azul primario)
#0000CC (Azul oscuro - sombra)
#00CCFF (Cyan - highlight)
#FFFFFF (Blanco - brillo máximo)

FICHA REINA (Corona):
#00FFFF (Cyan brillante)
#0088FF (Azul claro - sombra)
#88FFFF (Cyan pálido)
```

### 2.4 UI Components

```
BOTONES:
#33AA33 (Verde - normal)
#228822 (Verde oscuro - hover)
#66DD66 (Verde claro - pressed)
#FFFFFF (Blanco - texto)

BUTTONS SECONDARY:
#CC3333 (Rojo - cancel/destruir)
#AA2222 (Rojo oscuro - hover)

BACKGROUNDS:
#1A1A2E (Azul muy oscuro - fondo principal)
#16213E (Azul oscuro - panel)
#0F3460 (Azul medio - dialogs)

TEXT:
#FFFFFF (Blanco - primario)
#CCCCCC (Gris claro - secundario)
#999999 (Gris medio - disabled)
```

---

## 3. Dimensiones de Assets

### 3.1 Tablero

```
TABLERO COMPLETO:
- Grid: 8x8 casillas
- Tamaño por casilla: 32x32 pixels (modo pixel-perfect)
  - Escalado a: 64x64 para web moderno
- Dimensión total: 256x256 (32-bit) → 512x512 (web)
- Borde del tablero: 2 pixels

CASILLA (Single Square):
- 32x32 pixels
- Líneas divisoras: 1 pixel
- Sombra 3D: 1 pixel en borde inferior/derecho
```

### 3.2 Fichas

```
FICHA ESTÁNDAR:
- Diámetro: 24x24 pixels (dentro de casilla 32x32)
- Centro de la casilla: (4px, 4px) offset
- Forma: Círculo con contorno 2px
- Sombra: 1 pixel debajo

FICHA REINA:
- Tamaño base: 28x28 pixels
- Corona adicional: 8x8 pixels arriba
- Sprites: 4 variantes (orientaciones)
- Animación de coronación: 6 frames

SPRITES DE FICHAS:
- Frame 1: Posición normal
- Frame 2: Hover (brillo aumentado)
- Frame 3: Seleccionado (aura brillante)
- Frame 4: Capturada (transparencia 50%)
```

### 3.3 UI Elements

```
BOTONES:
- Tamaño estándar: 64x32 pixels
- Texto: 8-bit font, 8px altura
- Padding: 4px interior
- Borde: 1-2 pixels

ICONO PEQUEÑO:
- 16x16 pixels
- Para rankings, badges, etc.

ICONO MEDIANO:
- 32x32 pixels
- Para menús, items

ICONO GRANDE:
- 64x64 pixels
- Para pantalla de inicio, skins
```

---

## 4. Estilo de Fichas Detallado

### 4.1 Ficha Roja (Jugador - Humano)

```
Composición (layers):
1. Base oscura (CC0000)
   - Círculo 24x24, contorno 1px negro
   - Sombra inferior 2px (negra, 50% opacity)

2. Cuerpo principal (FF4444)
   - Círculo 22x22, centrado
   - Degradado simulado: más oscuro en bordes

3. Highlight brillante (FFAA00)
   - Arco de 120° en la parte superior
   - 4 pixels de altura
   - Crea efecto 3D convexo

4. Brillo final (FFFFFF)
   - Punto pequeño (2x2) en extremo superior
   - Máximo brillo, 70% opacity

REFERENCIA VISUAL (ASCII):
```
        **
      ****
     ***  (Brillo blanco)
    ***   (Highlight naranja)
   *****
  ******* (Cuerpo rojo)
 *********
***FICHA***
 *********
   ROJA
```

### 4.2 Ficha Reina Roja

```
Toda la ficha anterior +

CORONA (oro):
- 3 puntas triangulares
- Base en (y=6) del circulo
- Alto total: 8 pixels
- Color punta: #FFD700 (Oro)
- Color sombra: #FFA500 (Naranja)
- Brillo: #FFFF00 (Amarillo brillante)
```

### 4.3 Ficha Azul (Máquina - IA)

```
Estructura idéntica a roja, pero colores:
1. Base oscura (0000CC)
2. Cuerpo principal (4444FF)
3. Highlight (00CCFF)
4. Brillo (FFFFFF)
```

---

## 5. Tablero Detallado

### 5.1 Casillas

```
CASILLA CLARA (Crema):
Fondo: #F5E6D3
Borde superior-izquierda: #D4A574 (highlight, 1px)
Borde inferior-derecha: #2A1810 (sombra, 1px)
Línea divisoria interior: #CCAA88 (1px)
Efecto: Relieve 3D sutil

CASILLA OSCURA (Marrón):
Fondo: #2A1810
Borde superior-izquierda: #4A3820 (highlight, 1px)
Borde inferior-derecha: #000000 (sombra, 1px)
Línea divisoria interior: #1A0F08 (1px)
Efecto: Hundido 3D sutil

CASILLA PERMITIDA (Possible Move):
Casilla normal + círculo punteado central (1px)
Color: #FFAA00 (Naranja)
Radio: 8 pixels
```

### 5.2 Efectos en Casillas

```
HOVER (Casilla sin seleccionar):
Fondo: Ligeramente más brillante (+10% luminosidad)
Borde: Más definido

SELECCIONADA (Casilla activa):
Borde externo: 2px color #FFAA00 (Naranja)
Fondo: Sin cambio
Animación: Parpadeo suave (0.5s ciclo)

MOVIMIENTO VÁLIDO:
Símbolo: ◆ (diamante pequeño, 4x4px)
Color: #FFAA00 (Naranja)
Posición: Centro de casilla
Animación: Parpadeo (1s ciclo)

CAPTURA PENDIENTE:
Fondo casilla: Overlay rojo 20% opacity
Símbolo: ⚠ (2 pixeles, color rojo oscuro)
Animación: Pulso (0.3s)
```

---

## 6. Interfaz de Usuario

### 6.1 Panel de Control

```
LAYOUT:
┌─────────────────────────┐
│ DAMAS - V1.0            │  ← Header (32px altura)
├─────────────────────────┤
│                         │
│   TABLERO (512x512)     │
│                         │
├─────────────────────────┤
│ Turno: ROJO             │  ← Status (24px)
├─────────────────────────┤
│ [NUEVO] [DESHACER]      │  ← Botones (40px)
└─────────────────────────┘

HEADER:
Fuente: 8-bit style, 16px bold
Color: #FFFFFF
Fondo: #1A1A2E
Borde inferior: 2px #33AA33

FOOTER (STATUS):
Fuente: 8-bit, 12px
Color: #CCCCCC
Fondo: #0F3460
Indicador turno: Pequeño cuadrado del color del jugador (16x16)
```

### 6.2 Botones

```
ESTADO NORMAL:
Fondo: #33AA33
Borde: 2px #228822 (arriba-izq) + 2px #000000 (abajo-der)
Texto: #FFFFFF, 8px, bold
Padding: 4px
Efecto 3D: Relieve convexo

HOVER:
Fondo: #44BB44
Brillo +15%

PRESSED/ACTIVE:
Fondo: #228822
Borde invertido (hundido)
Offset: 1px hacia abajo-derecha

DISABLED:
Fondo: #666666
Texto: #999999
Sin borde 3D

DIMENSIONES ESTÁNDAR:
- Pequeño: 40x24px (Deshacer)
- Mediano: 64x32px (Nuevo Juego)
- Grande: 128x48px (Iniciar)
```

### 6.3 Rankings / Menus

```
TABLA DE RANKINGS:
┌──────────────────────────────────┐
│ RANKINGS TOP 10                  │  ← Header
├──┬────────────┬─────────┬────────┤
│# │ Jugador    │ Puntos  │ Nivel  │
├──┼────────────┼─────────┼────────┤
│1 │ Player A   │  2500   │ Master │
│2 │ Player B   │  2200   │ Master │
│...
└──┴────────────┴─────────┴────────┘

Fuente: 8-bit, 10px (filas), 12px (header)
Alto de fila: 20px
Colores alternos: #1A1A2E / #16213E
Hover: #0F3460
Seleccionado: Borde #33AA33, fondo #0F3460
```

---

## 7. Animaciones

### 7.1 Movimiento de Ficha

```
DURACIÓN: 200ms
EASING: Linear (movimiento rápido y directo)
FRAMES:
1. Posición inicial (0%)
2. 75% del camino hacia destino (120ms)
3. Posición final con "landing" (200ms)

LANDING EFFECT:
- Compresión vertical: -2px
- Duración: 50ms
- Color: Brillo temporal +20%
```

### 7.2 Captura de Ficha

```
DURACIÓN: 300ms
SECUENCIA:
1. Ficha volteada (200ms)
   - Escala X: 100% → 0% → -100%
   - Rotación Y: 0° → 180°
   - Opacidad: 100% → 50%

2. Desaparición (100ms)
   - Escala: 100% → 0%
   - Opacidad: 50% → 0%
   - Efecto: "Whoosh" visual

SONIDO: (si aplica)
- Captura: Efecto "pop" retro
```

### 7.3 Coronación

```
DURACIÓN: 500ms
SECUENCIA:
1. Ficha se eleva (300ms)
   - Y: 0px → -8px
   - Rotación: 0° → 360° (1 vuelta)
   - Brillo: Normal → +30%

2. Corona aparece (200ms)
   - Escala corona: 0% → 100%
   - Efecto: Destello #FFFF00
   - Duración total parpadeo: 100ms

3. Regresa a posición (0ms)
   - Y: -8px → 0px (snap instantáneo)

SONIDO: Efecto "ding" retro de victoria
```

### 7.4 Parpadeos de UI

```
SELECCIÓN CASILLA:
- Duración: 500ms
- Ciclo: On (250ms) / Off (250ms)
- Opacidad: 100% → 60% → 100%

MOVIMIENTO VÁLIDO:
- Duración: 1000ms (ciclo completo)
- Escala: 100% → 110% → 100%
- Parpadeo: 2 ciclos por movimiento visible

TURNO CAMBIO:
- Fade: 200ms
- Color de fondo anterior: Fade to oscuro
- Texto nuevo: Fade in
```

---

## 8. Tipografía

### 8.1 Fuentes

```
FUENTE PRINCIPAL: 8-bit / Pixel Font
Opciones recomendadas:
- "PressStart2P" (Google Fonts)
- "Retro Computer" (itch.io)
- "Commodore 64" (alternativa clásica)
- Fallback: Monospace (si no está disponible)

TAMAÑOS:
- Hero/Title: 24-32px (títulos principales)
- Header: 16px (secciones)
- Body: 10-12px (texto regular)
- Caption: 8px (información secundaria)
- Button: 12px (botones)

WEIGHT:
- Regular: Texto base
- Bold: Énfasis, botones, títulos
- NO italic (las fuentes pixel no soportan bien)
```

### 8.2 Colores de Texto

```
PRIMARIO: #FFFFFF (Blanco - títulos, botones)
SECUNDARIO: #CCCCCC (Gris claro - descripciones)
TERCIARIO: #999999 (Gris oscuro - disabled, hints)
ACENTO: #FFAA00 (Naranja - importantes)
ÉXITO: #33AA33 (Verde - confirmación)
ERROR: #FF4444 (Rojo - errores)
```

---

## 9. Implementación Técnica

### 9.1 Canvas Rendering

```typescript
// IMPORTANTE: Usar pixel-perfect rendering
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d', { willReadFrequently: true })!

// CRITICAL: Desactivar antialiasing
ctx.imageSmoothingEnabled = false
ctx.imageSmoothingQuality = 'low'

// Escala para pixel-perfect (debe ser potencia de 2)
const PIXEL_SIZE = 2 // Para escalar de 256x256 a 512x512
ctx.scale(PIXEL_SIZE, PIXEL_SIZE)
```

### 9.2 Sprite Sheets

```
FORMATO: PNG con transparencia (24-bit + alpha)
COMPRESSION: Maximum (PNG optimizer)

LAYOUT SPRITE SHEET (8 fichas + estados):
┌──┬──┬──┬──┐
│R1│R2│R3│R4│  R = Red (Rojo)
└──┴──┴──┴──┘
┌──┬──┬──┬──┐
│B1│B2│B3│B4│  B = Blue (Azul)
└──┴──┴──┴──┘
┌──┬──┬──┬──┐
│RQ│RQ│RQ│RQ│  RQ = Red Queen (Reina Roja)
│1 │2 │3 │4 │
└──┴──┴──┴──┘
┌──┬──┬──┬──┐
│BQ│BQ│BQ│BQ│  BQ = Blue Queen (Reina Azul)
│1 │2 │3 │4 │
└──┴──┴──┴──┘

Cada frame: 32x32 pixels
Total sheet: 128x128 pixels (4 columnas × 4 filas)
```

### 9.3 CSS para Pixel Art

```css
/* Pixel Art Rendering */
image-rendering: pixelated;
image-rendering: -moz-crisp-edges;
image-rendering: crisp-edges;

canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  border: 2px solid #2A1810;
}

/* Sin antialiasing en web */
* {
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 10. Guía de Assets a Crear

### 10.1 Priority - V1 (MVP)

- [ ] `board.png` (8x8 tablero, 256x256)
- [ ] `piece-red.png` (Ficha roja estándar, 32x32)
- [ ] `piece-blue.png` (Ficha azul estándar, 32x32)
- [ ] `ui-buttons.png` (Sprite sheet botones)
- [ ] `ui-panel.png` (Panel fondo semi-transparente)
- [ ] `font-8bit.woff2` (Tipografía pixel)

### 10.2 Priority - V2 (Rankings)

- [ ] `piece-red-queen.png` (Reina roja, 32x32)
- [ ] `piece-blue-queen.png` (Reina azul, 32x32)
- [ ] `ui-rankings-table.png` (Tabla rankings fondo)
- [ ] `badges.png` (Medallas/rankings, sprite sheet 16x16)
- [ ] `effects-spark.png` (Efecto chispa animado)

### 10.3 Priority - V3 (Shop)

- [ ] `skins/board-variants.png` (Tableros alternativos)
- [ ] `skins/piece-variants.png` (Fichas temáticas)
- [ ] `ui-shop.png` (Fondo tienda)
- [ ] `effects-purchase.png` (Efecto de compra)

---

## 11. Proceso de Creación de Assets

### 11.1 Herramientas Recomendadas

- **Pixel Art:** Aseprite (profesional), Piskel (gratis web), GIMP (gratis)
- **Optimization:** PNGCrush, TinyPNG
- **Preview:** itch.io asset viewer, browser DevTools

### 11.2 Workflow

1. **Diseño en 32x32 (100% zoom)**
   - Crear en canvas mínimo 1x zoom
   - Usar grid visible
   - Paleta limitada a colores especificados

2. **Verificación**
   - Exportar PNG 24-bit + alpha
   - Test en múltiples resoluciones (web 2x, 4x)
   - Verificar sin antialiasing

3. **Optimización**
   - Reducir a 256 colores si aplica
   - Ejecutar PNGCrush
   - Versionar en git (no en lfs)

4. **Integración**
   - Agregar a `src/assets/sprites/`
   - Importar en TanStack Start
   - Test en componentes

---

## 12. Ejemplos de Referencia

### 12.1 Inspiración Visual

- **Game Boy Pokemon Red/Blue:** Fichas y tablero
- **Chess.com Lichess Pixel themes:** UI estructura
- **Dragonball Z Batalla Táctica:** Animaciones
- **Tactics Ogre:** Tablero grid isométrico (adaptado a ortho)

### 12.2 Recursos Online

- OpenGameArt.org (assets pixel art libres)
- itch.io game assets (colecciones)
- Lospec.com (paletas pixel art)

---

## 13. Validación de Calidad

### 13.1 Checklist de Assets

- [ ] Bordes pixelados nítidos (sin antialiasing)
- [ ] Paleta limitada a colores especificados
- [ ] Tamaño exacto en pixels (32x32, 64x64, etc.)
- [ ] Transparencia correcta (PNG alpha channel)
- [ ] Simetría en fichas (cuando aplique)
- [ ] Animaciones 200ms-500ms (no jerky)
- [ ] Sin gradientes suaves (solo cambios de color nítidos)

### 13.2 Testing en Navegador

```javascript
// Test pixel-perfect rendering
console.log('ImageData pixelada:', ctx.getImageData(0, 0, 32, 32))
// Verificar cada pixel tiene solo colores de la paleta
```

---

## 14. Notas Importantes

### ⚠️ DO's

✅ Mantener consistencia con proyecto Pokemon
✅ Usar grid y snap to grid siempre
✅ Crear versiones escaladas (1x, 2x, 4x)
✅ Documentar cambios de paleta
✅ Versionar assets en git

### ⛔ DON'Ts

❌ NO aplicar antialiasing
❌ NO mezclar estilos (pixel + vector)
❌ NO usar más de 64 colores por asset
❌ NO crear animaciones > 500ms sin justificación
❌ NO guardar como JPEG (siempre PNG)

---

**Última Actualización:** 26 de mayo de 2026
**Versión:** 1.0 (Basada en estilo Pokémon del equipo)
**Estado:** Listo para implementación V1
