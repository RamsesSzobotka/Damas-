# 🎨 Guía Visual de Wireframes - Damas

**Última actualización:** 26 de mayo de 2026  
**Versión:** 1.0 - Completo  

---

## 📑 Índice de Wireframes

### 1. 🎮 Menú Principal
**Archivo:** [`01-menu-principal.md`](./01-menu-principal.md)

**Lo que incluye:**
- ✅ Logo y título centrados
- ✅ 5 botones principales (Jugar, Rankings, Tienda, Opciones, Salir)
- ✅ **Login estratégicamente en esquina superior derecha**
- ✅ Footer con información de versión
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Estados de autenticación (sin login / autenticado)

**Dimensiones:**
- Mobile: 320px - 480px (botones 100% - 24px)
- Tablet: 768px - 1024px (botones 240px)
- Desktop: 1024px+ (botones 200px)

---

### 2. 🎯 Selección de Dificultad
**Archivo:** [`02-seleccion-dificultad.md`](./02-seleccion-dificultad.md)

**Lo que incluye:**
- ✅ 4 tarjetas de dificultad (Principiante, Intermedio, Master, Ultra)
- ✅ Descripción y especificaciones por nivel
- ✅ Botones "Jugar" y "Atrás"
- ✅ Colores diferenciados por dificultad
- ✅ Estados de selección (hover, selected, disabled)
- ✅ Responsive grid (2x2 en desktop, 1 columna en mobile)

**Especificaciones:**
- Tarjeta: 240px × 140px
- Grid gap: 16px
- Colores: Verde, Naranja, Rojo, Gris

---

### 3. 🎮 Pantalla de Juego
**Archivo:** [`03-pantalla-juego.md`](./03-pantalla-juego.md)

**Lo que incluye:**
- ✅ **Tablero 8×8 centrado (512×512 en desktop)**
- ✅ **Perfil del jugador (avatar, nombre, puntos) - SUPERIOR IZQUIERDA**
- ✅ Indicador de turno (ROJO o AZUL) - SUPERIOR CENTRO
- ✅ **Login - SUPERIOR DERECHA (consistente con otros wireframes)**
- ✅ Panel de control (opciones IA, botones, fichas)
- ✅ Historial de movimientos scrolleable
- ✅ Status bar (tiempo, FPS, estado)
- ✅ Animaciones de movimiento (200ms)
- ✅ Responsive (256×256 mobile, 512×512 desktop)

**Zonas Clave:**
- **Header:** Perfil izquierda, Turno centro, Login derecha
- **Central:** Tablero 8×8 con casillas interactivas
- **Lateral Izq:** Panel control con estado IA
- **Lateral Der:** Historial movimientos
- **Footer:** Status bar con información

---

### 4. 📊 Rankings
**Archivo:** [`04-rankings.md`](./04-rankings.md)

**Lo que incluye:**
- ✅ Tabla de Top 10 jugadores
- ✅ Filtros por dificultad
- ✅ Medallas para Top 3 (🥇 🥈 🥉)
- ✅ Resaltado de tu posición
- ✅ Columnas: Rank, Jugador, Puntos, Victorias, Win Rate

---

### 5. 🛍️ Tienda
**Archivo:** [`05-tienda.md`](./05-tienda.md)

**Lo que incluye:**
- ✅ Grid de skins (fichas y tableros)
- ✅ Filtros por tipo
- ✅ Ordenamiento (Nuevos, Populares, Precio)
- ✅ Rareza con colores (Common, Uncommon, Rare, Epic, Legendary)
- ✅ Carrito de compras
- ✅ Integración Stripe

---

## 🎨 Paleta de Colores Global

```
FONDOS:
#0B0D2B  - Fondo principal (espacio profundo)
#1E2547  - Panel/Card (visor espacial)
#0E1233  - Panel oscuro/Footer (azul cósmico)

BOTONES PRIMARIOS:
#FFD700  - Dorado galáctico (Jugar, Confirmar)
#67E8F9  - Cyan espacial (Hover)
#C026D3  - Magenta cósmico (Pressed / acento)

BOTONES SECUNDARIOS:
#FF4D6B  - Rojo cósmico (Cancelar, Deshacer)
#B91C3C  - Rojo claro (Hover)
#7F1D1D  - Rojo oscuro (Pressed)

TEXTO:
#FFFFFF  - Blanco (primario)
#B0E0FF  - Azul claro espacial (secundario)
#9CA3AF  - Gris oscuro (terciario/disabled)

ACENTOS:
#FFD700  - Dorado (highlights)
#67E8F9  - Cyan (interacciones)
#FF4D6B  - Rojo (errores)

DIFICULTADES:
🟢 Principiante: #67E8F9 (Cyan)
🟡 Intermedio: #FFD700 (Dorado)
🔴 Master: #C026D3 (Magenta)
⚫ Ultra: #F0F8FF (Blanco estelar)

TABLERO:
Casilla clara: #1E2547 (Panel claro)
Casilla oscura: #0B0D2B (Espacio profundo)
Borde activo: #67E8F9 (Cyan)
```

---

## 📐 Espaciado Estándar

```
Grid base: 8px
Separaciones: 8px, 16px, 24px, 32px, 40px
Padding: 12px (componentes pequeños), 16px (estándar), 24px (secciones)
Margen exterior: 24px (desktop), 16px (tablet), 12px (mobile)

COMPONENTES:
Botón estándar: 200px × 40px
Tarjeta: 240px × 140px
Tablero: 512px × 512px (2x escalado desde 256px)
Avatar: 24px × 24px
```

---

## 🎭 Estados Interactivos

### Botones

```
NORMAL:
Fondo: Color base
Borde: 2px relief 3D
Cursor: pointer

HOVER:
Fondo: +10% brillo
Efecto: Sombra aumentada
Duración: 100ms ease-out

PRESSED:
Fondo: -20% brillo
Borde: Invertido (hundido)
Offset: 1px down-right
Duración: 50ms

DISABLED:
Fondo: #666666
Texto: #999999
Cursor: not-allowed
Opacity: 0.6
```

### Tarjetas

```
NORMAL:
Borde: 2px base color
Fondo: Panel color

HOVER:
Borde: 2px accent color (#67E8F9)
Fondo: +5% brillo
Transform: scale(1.02)
Duración: 100ms ease-out

SELECTED:
Borde: 3px accent color
Box-shadow: 0 0 8px #FFD700
Transform: scale(1.0)
```

---

## 🔐 Flujo de Autenticación

### En Todos los Wireframes

**Ubicación consistente:** Esquina superior derecha

```
❌ SIN AUTENTICAR:
Botón: "LOGIN / SIGN UP"
Color: #67E8F9 (Cyan espacial)
Acción: Click → Abre modal Clerk

✅ AUTENTICADO:
Muestra: 👤 NombreUsuario ▼
Color: #B0E0FF
Acción: Click → Dropdown menu
  ├─ Ver Perfil
  ├─ Configuración
  └─ Cerrar Sesión
```

---

## 📱 Estrategia Responsive

### Breakpoints

```
Móvil: < 480px
  - 1 columna
  - Botones full width - 24px padding
  - Tablero: 256x256 (escala 1x)
  - Paneles: Tabs/Collapsible

Tablet: 480px - 1024px
  - 2 columnas
  - Botones 240px
  - Tablero: 400x400 (escala 1.56x)
  - Paneles: Side-by-side

Desktop: > 1024px
  - 3 columnas
  - Botones 200px
  - Tablero: 512x512 (escala 2x)
  - Paneles: Fixed layout
```

---

## ✨ Animaciones Globales

```
Fade entre pantallas: 200ms ease-in-out
Hover de botones: 100ms ease-out
Hover de tarjetas: 100ms ease-out
Movimiento pieza: 200ms linear
Selección casilla: 100ms ease-in-out
Parpadeo turno: 500ms
Transición de color: 150ms ease-in-out
```

---

## 🔧 Implementación Técnica

### Framework
- **Frontend:** TanStack Start (React + TypeScript)
- **Estilos:** TailwindCSS + CSS custom properties
- **Animaciones:** CSS transitions / Framer Motion
- **Routing:** TanStack Router
- **Autenticación:** Clerk
- **Pagos:** Stripe

### Assets

```
Tipografía:
- Primaria: PressStart2P (Google Fonts)
- Fallback: Monospace

Imágenes:
- Formato: PNG 32x32 (pixel art)
- Escalado: 2x, 4x sin interpolación
- CSS: image-rendering: pixelated

Iconos:
- Emojis: 🎮 📊 🛍️ ⚙️ ❌ 👤
- SVG custom: Para fichas y tablero
```

---

## 📝 Checklist Implementación

### Componentes Prioritarios (V1)
- [ ] MainMenu
- [ ] DifficultySelector
- [ ] GameBoard (8x8)
- [ ] PlayerProfile
- [ ] StatusBar
- [ ] NavBar/Header (con Login)

### Componentes Secundarios (V2)
- [ ] RankingsTable
- [ ] ShopGrid
- [ ] MoveHistory
- [ ] ControlPanel
- [ ] SettingsModal

### Polish (V3)
- [ ] Animaciones avanzadas
- [ ] Efectos visuales
- [ ] Sonidos retro
- [ ] Particulas
- [ ] Transiciones suaves

---

## 🎯 Notas Especiales

### Perfil del Jugador
**Ubicación pantalla juego:** Esquina superior izquierda
```
Contiene:
- Avatar 24x24px
- Nombre usuario
- Puntos acumulados
- Fichas en juego
```

### Login Estratégico
**Ubicación global:** Esquina superior derecha
```
Mantiene consistencia en:
- Menú principal
- Selección dificultad
- Pantalla juego
- Rankings
- Tienda
```

### Tablero Principal
**Ubicación:** Centro de pantalla juego
```
Especificaciones:
- Grid 8x8 (64px × 64px por casilla en desktop)
- Escalable responsive
- Interactivo (click/drag)
- Animations suaves
```

---

## 📚 Referencias

- [Diseño Pixel Art](../../Docs/agents/DESIGN-PIXELART.SKILL.md)
- [PRD - Product Requirements](../../Docs/PRD.md)
- [Documentación Base de Datos](../../Docs/DATABASE.md)

---

## 🤝 Notas para Desarrolladores

1. **Usar componentes reutilizables:** Botones, Cards, Modals
2. **Mantener paleta de colores:** No improvisar colores
3. **Responsive mobile-first:** Comenzar con móvil
4. **Testear en múltiples resoluciones:** 320px, 768px, 1024px
5. **Accesibilidad:** Semantic HTML, ARIA labels, keyboard navigation
6. **Performance:** Lazy load images, optimizar CSS
7. **Tipo de letra:** Pixel art requiere `image-rendering: pixelated`

---

**Aprobado:** 26 de mayo de 2026  
**Estado:** Listo para Implementación  
**Versión:** 1.0 Completa
